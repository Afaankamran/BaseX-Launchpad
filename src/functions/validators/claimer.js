import { boolean, number, object, string, date, ref, array } from 'yup';
import { ethers } from 'ethers';
import moment from 'moment-timezone';
import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
export const ClaimerSchema = object({
    claims: array().of(
        object().shape({
            unlockTime: string()
                .transform((value) => (value ? value : ''))
                .test('isValid', "Claim Time can't be empty", (value) => {
                    return moment(value).isValid();
                })
                .test(
                    'isAfterNow',
                    'Claim Time must be after Current time',
                    (value) => {
                        return moment(value).utc().isAfter(moment().utc());
                    },
                )
                .required('Claim Time is required'),
            percentage: number().required()
        })
    ),
    token: string()
        .test('token', 'Please Enter a Valid Address', (value) =>
            ethers.utils.isAddress(value),
        )
        .test('notNullAddress', 'Please Enter a Valid Address', (value) =>
            value !== "0x0000000000000000000000000000000000000000",
        )
        .required("Token is Required")
})


const testFilename = (fileName, exts) =>
    new RegExp("(" + exts.join("|").replace(/\./g, "\\.") + ")$").test(fileName);
export const isValidFile = (fileName) => {
    const exts = [
        ".txt",
        ".csv",
        ".xls",
        ".xlsx",
        ".xlsb",
        ".xlsm",
        ".ods",
        ".xml",
        ".fods",
        ".uos",
        ".sylk",
        ".dif",
        ".dbf",
        ".prn",
        ".qpw",
        ".123",
    ];
    return testFilename(fileName, exts);
};
export const isExelFile = (fileName) => {
    const exts = [".xls", ".xlsx", ".xlsb", ".xlsm", ".xml"];
    return testFilename(fileName, exts);
};
export const isCSVFile = (fileName) => {
    const exts = [".csv"];
    return testFilename(fileName, exts);
};
export const parseText = (value) => (value ? value.toString().trim() : "");
export const parseDataFromFile = (
    file,
    updateState,
    updateParsedData,
    address
) => {
    if (isExelFile(file.name)) {
        readXlsxFile(file).then(async (res) => {
            const { state, parsedData } = await validateData(res, address);
            updateState(state);
            updateParsedData(parsedData);
        });
    } else if (isCSVFile(file.name)) {
        Papa.parse(file, {
            complete: async (res) => {
                const { state, parsedData } = await validateData(res.data, address);
                updateState(state);
                updateParsedData(parsedData);
            },
        });
    } else {
        var fr = new FileReader();
        fr.onload = async function () {
            let result = [];
            const data = fr.result.split(",");
            for (let i = 0; i < data.length; i = i + 2) {
                const val = [parseText(data[i]), parseText(data[i + 1])];
                result.push(val);
            }
            const { state, parsedData } = await validateData(result, address);
            updateState(state);
            updateParsedData(parsedData);
        };

        fr.readAsText(file);
    }
};
export const parseStateData = async (state, address, checkPrevious = true) => {
    let result = [];
    const data = state.replace(/(\r\n|\n|\r|",\n")/gm, ",").split(",");
    for (let i = 0; i < data.length; i = i + 2) {
        const val = [parseText(data[i]), parseText(data[i + 1])];
        result.push(val);
    }
    return await validateData(result, address, checkPrevious);
};
const calculateErrors = (data, tokens) => {
    let parsedData = [];
    let state = ``;

    data.forEach((pair, index) => {
        if (pair[0]) {
            let obj = {};
            pair[1] = Number(pair[1]);
            obj.pair = pair;
            obj.value = pair.join(",");
            obj.hasError = false;
            if (!ethers.utils.isAddress(pair[0]) && isNaN(pair[1])) {
                obj.hasError = true;
                obj.errorType = "invalidAddress";
                obj.error = `${obj.value} is a invalid wallet address and wrong amount`;
            } else if (!ethers.utils.isAddress(pair[0])) {
                obj.hasError = true;
                obj.errorType = "invalidAddress";
                obj.error = `${pair[0]} is a invalid wallet address`;
            } else if (isNaN(pair[1])) {
                obj.hasError = true;
                obj.errorType = "invalidAmmount";
                obj.error = `${pair[1]} is wrong amount`;
            } else if (
                data.filter((el) => el[0].toString() === pair[0].toString()).length > 1
            ) {
                obj.hasError = true;
                obj.errorType = "dublicateAddress";
                obj.error = `duplicate address ${pair[0]}`;
            }
            state += `${obj.value}\n`;
            parsedData.push(obj);
        }
    });
    state = state.slice(0, -1);
    return { state, parsedData };
};
export const validateData = async (data, address, checkPrevious = false) => {
    if (address) {
        try {
            if (checkPrevious) {
                let e = calculateErrors(data, []);
                const hasErrors = e.parsedData.some((obj) => obj.hasError);
                return { state: e.state, parsedData: e.parsedData, hasErrors };
            }
        } catch (err) { }
    }
    let e = calculateErrors(data, []);

    const hasErrors = e.parsedData.some((obj) => obj.hasError);
    return { state: e.state, parsedData: e.parsedData, hasErrors };
};

export const FilterData = (parsedData, type) => {
    let nData = [];
    let nState = ``;
    if (type.toString() === "delete") {
        nData = parsedData.filter((obj) => {
            if (
                !(
                    obj.hasError &&
                    (obj.errorType === "invalidAddress" ||
                        obj.errorType === "addressExists")
                )
            ) {
                nState += `${obj.value}\n`;
                return obj;
            }
            return false;
        });
    } else if (type.toString() === "keepfirst") {
        parsedData.map((obj) => {
            if (
                !(
                    obj.hasError &&
                    obj.errorType === "dublicateAddress" &&
                    nData.find((d) => d.pair[0].toString() === obj.pair[0].toString())
                )
            ) {
                if (!isNaN(obj.pair[1])) {
                    obj.hasError = false;
                    obj.errorType = "";
                    nData.push(obj);
                    nState += `${obj.value}\n`;
                }
            }
            return false;
        });
    } else if (type.toString() === "combine") {
        parsedData.map((obj) => {
            let dataIndex = nData.findIndex(
                (d) => d.pair[0].toString() === obj.pair[0].toString()
            );
            if (
                !(
                    obj.hasError &&
                    obj.errorType === "dublicateAddress" &&
                    dataIndex >= 0
                )
            ) {
                if (!isNaN(obj.pair[1])) {
                    obj.hasError = false;
                    obj.errorType = "";
                    nData.push(obj);
                }
            } else if (
                obj.hasError &&
                obj.errorType === "dublicateAddress" &&
                dataIndex >= 0 &&
                !isNaN(obj.pair[1])
            ) {
                let oldobj = nData[dataIndex];
                const sum = Number(oldobj.pair[1]) + Number(obj.pair[1]);
                oldobj.pair[1] = sum;
                oldobj.value = oldobj.pair.join(",");
                nData[dataIndex] = oldobj;
            }
            return false;
        });
        nData.map((obj) => {
            nState += `${obj.value}\n`;
            return false;
        });
    }
    nState = nState.slice(0, -1);

    return { nState, nData };
};

export function generateMerkleTree(data, distribution, token) {
    const leaves = data.map((x) => {
        return ethers.utils.solidityKeccak256(
            ["address", "uint256", "uint256"],
            [
                x.pair[0].toLowerCase(),
                toTokenAmount(token, x.pair[1].toString()).toString(),
                distribution.toString(),
            ]
        );
    });
    const tree = new MerkleTree(leaves, keccak256, {
        sortPairs: true,
    });
    const root = tree.getHexRoot();
    const mappedData = {};
    data.map((obj, index) => {
        return (mappedData[obj.pair[0]] = {
            address: obj.pair[0],
            amount: toTokenAmount(token, obj.pair[1].toString()).toString(),
            distribution: distribution.toString(),
            proof: tree.getHexProof(leaves[index]),
        });
    });
    return { root, mappedData };
}

export const toTokenAmount = (token, amount) => {
    if (token.decimals) {
        return ethers.utils.parseUnits(
            amount.toString(),
            token.decimals.toString()
        );
    }
    return ethers.utils.parseUnits(amount.toString());
};