import { ErrorMessage, Formik } from 'formik';
import PoolSchema from '@/functions/validators/pool';
import moment from 'moment-timezone';
import { getContract } from '@/functions/contract';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '@/hooks/useActiveWeb3React';
import ERC_20_ABI from '@/constants/abis/erc20.json';
import Button from '@/components/Button';
export const PoolForm = ({ handleFormSubmit, initialValues, actionLabel }) => {
  const { library } = useActiveWeb3React();
  const handleOnChangeToken = async (e, handleChange, setValues, values) => {
    const tokenAddress =
      e.target.name === 'tokenAddress' ? e.target.value : values.tokenAddress;
    const tokenType =
      e.target.name === 'tokenType' ? e.target.value : values.tokenType;
    handleChange(e);
    let tokenName = '',
      tokenDecimals = '',
      tokenSymbol = '';
    // const library = new ethers.providers.JsonRpcProvider(tokenType === "ERC-20" ? process.env.NEXT_PUBLIC_ETH_NETWORK_URL : process.env.NEXT_PUBLIC_BSC_NETWORK_URL);
    // const library = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_NETWORK_URL);
    if (ethers.utils.isAddress(tokenAddress) && library) {
      const contract = getContract(tokenAddress, ERC_20_ABI, library);
      try {
        tokenName = await contract.name();
        tokenDecimals = await contract.decimals();
        tokenSymbol = await contract.symbol();
      } catch (error) {
        console.error(error);
      }
    }
    setValues({
      ...values,
      tokenName,
      tokenDecimals,
      tokenSymbol,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Formik
      validationSchema={PoolSchema}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        isSubmitting,
        handleSubmit,
        handleChange,
        values,
        errors,
        setValues,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="mt-10 mb-5">
            <p className="text-lg font-bold text-white"> Project Info:</p>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Project Name</span>
              <input
                name="projectName"
                placeholder="Project Name"
                onChange={handleChange}
                value={values.projectName}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="projectName" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Logo Url</span>
              <input
                name="logo"
                placeholder="Logo Url"
                onChange={handleChange}
                value={values.logo}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="logo" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Small Logo Url</span>
              <input
                name="smallLogo"
                placeholder="Small Logo Url"
                onChange={handleChange}
                value={values.smallLogo}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="smallLogo" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Short Description</span>
              <input
                name="shortDescription"
                placeholder="Short Description"
                onChange={handleChange}
                value={values.shortDescription}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="shortDescription" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Description</span>
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={values.description}
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="description" />
            </label>
          </div>
          <div className="mt-10 mb-5">
            <p className="text-lg font-bold text-white"> Token Info:</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <label className="block w-full col-span-2">
              <span className="text-white"> Token Address</span>
              <input
                name="tokenAddress"
                placeholder="Token Address"
                onChange={(e) =>
                  handleOnChangeToken(e, handleChange, setValues, values)
                }
                value={values.tokenAddress}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="tokenAddress" />
            </label>
            <label className="block w-full ">
              <span className="text-white"> Token Type</span>
              <select
                name="tokenType"
                onChange={(e) =>
                  handleOnChangeToken(e, handleChange, setValues, values)
                }
                value={values.tokenType}
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="ERC-20">ERC-20</option>
              </select>
              <Error name="tokenType" />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <label className="block w-full ">
              <span className="text-white">Token Name</span>
              <input
                name="tokenName"
                placeholder="Token Name"
                onChange={handleChange}
                value={values.tokenName}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="tokenName" />
            </label>
            <label className="block w-full ">
              <span className="text-white">Token Symbol</span>
              <input
                name="tokenSymbol"
                placeholder="Token Symbol"
                onChange={handleChange}
                value={values.tokenSymbol}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="tokenSymbol" />
            </label>
            <label className="block w-full ">
              <span className="text-white">Token Decimals</span>
              <input
                name="tokenDecimals"
                placeholder="Token Decimals"
                onChange={handleChange}
                value={values.tokenDecimals}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="tokenDecimals" />
            </label>
          </div>

          <div className="grid grid-cols-12 mt-2">
            <label className="block w-full col-span-5">
              <span className="text-white">Listing On</span>
              <input
                name="listingON"
                placeholder="Listing On"
                onChange={handleChange}
                value={values.listingON}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="listingON" />
            </label>
            <div className="flex items-center justify-center col-span-2 mt-4 mb-3 text-lg font-bold">
              at
            </div>
            <label className="block w-full col-span-5 ">
              <span className="text-white">Listing Time</span>
              <input
                name="listingTime"
                placeholder="Listing Time"
                onChange={handleChange}
                value={moment(values.listingTime).format('YYYY-MM-DDTHH:mm:ss')}
                type="datetime-local"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="listingTime" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Initial Supply (Optional)</span>
              <input
                name="initialSupply"
                placeholder="Initial Supply"
                onChange={handleChange}
                value={values.initialSupply}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="initialSupply" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Token Vesting (Optional)</span>
              <input
                name="vesting"
                placeholder="Token Vesting"
                onChange={handleChange}
                value={values.vesting}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="vesting" />
            </label>
          </div>
          <div className="mt-10 mb-5">
            <p className="text-lg font-bold text-white"> Sale Info:</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="block w-full ">
              <span className="text-white">Access Type </span>
              <select
                name="accessType"
                onChange={handleChange}
                value={values.accessType}
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="privateandpublic">Private and Public</option>
              </select>
              <Error name="accessType" />
            </label>
            <label className="block w-full ">
              <span className="text-white">Amount Allocated</span>
              <input
                name="raiseAmount"
                placeholder="Amount Allocated"
                onChange={handleChange}
                value={values.raiseAmount}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="raiseAmount" />
            </label>
          </div>
          {(values.accessType === 'private' ||
            values.accessType === 'privateandpublic') && (
            <SaleFrom
              handleChange={handleChange}
              values={values}
              prefix="private"
              label={'Private'}
            />
          )}
          {(values.accessType === 'public' ||
            values.accessType === 'privateandpublic') && (
            <SaleFrom
              handleChange={handleChange}
              values={values}
              prefix="public"
              label={'Public'}
            />
          )}

          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Owner Of Raise</span>
              <input
                name="ownerOfRaise"
                placeholder="Owner Of Raise"
                onChange={handleChange}
                value={values.ownerOfRaise}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="ownerOfRaise" />
            </label>
          </div>

          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Website Url</span>
              <input
                name="website"
                placeholder="Website Url"
                onChange={handleChange}
                value={values.website}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="website" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Twitter Url (Optional)</span>
              <input
                name="twitter"
                placeholder="Twitter Url (Optional)"
                onChange={handleChange}
                value={values.twitter}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="twitter" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Github Url (Optional)</span>
              <input
                name="github"
                placeholder="Github Url (Optional)"
                onChange={handleChange}
                value={values.github}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="github" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Medium Url (Optional)</span>
              <input
                name="medium"
                placeholder="Medium Url (Optional)"
                onChange={handleChange}
                value={values.medium}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="medium" />
            </label>
          </div>
          <div className="mt-2">
            <label className="block w-full ">
              <span className="text-white">Telegram Url (Optional)</span>
              <input
                name="telegram"
                placeholder="Telegram Url (Optional)"
                onChange={handleChange}
                value={values.telegram}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="telegram" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <Button
              color="blue"
              variant="filled"
              type="submit"
              disabled={
                isSubmitting ||
                JSON.stringify(initialValues) === JSON.stringify(values)
              }
            >
              Next
            </Button>
          </div>
          {/* <div className="grid grid-cols-2 mt-2">
            <label className="flex items-center w-full ">
              <span>Access Private</span>
              <Switch
                checked={values.private}
                onChange={(value) => setValues({ ...values, private: value })}
                name="private"
                className={`${values.private ? 'bg-blue' : 'bg-blue'}
               ml-3 relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    values.private
                      ? 'translate-x-7 bg-dark-blue'
                      : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>

              <Error name="private" />
            </label>
          </div> */}
        </form>
      )}
    </Formik>
  );
};
function Error(props) {
  return (
    <ErrorMessage {...props}>
      {(msg) => <div className="mt-1 text-xs text-red">{msg}</div>}
    </ErrorMessage>
  );
}

function SaleFrom({ values, handleChange, prefix, label }) {
  return (
    <div>
      <div className="mt-10 mb-5">
        <p className="text-lg font-bold text-white capitalize">
          {' '}
          {label} Sale Info:
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <label className="block w-full">
          <span className="text-white">{label} Sale Start Time</span>
          <input
            name={`${prefix}StartTime`}
            placeholder={`${label} Sale Start Time`}
            onChange={handleChange}
            value={
              values[`${prefix}StartTime`]
                ? moment(values[`${prefix}StartTime`]).format(
                    'YYYY-MM-DDTHH:mm:ss',
                  )
                : undefined
            }
            type="datetime-local"
            className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Error name={`${prefix}StartTime`} />
        </label>
        <label className="block w-full">
          <span className="text-white">{label} Sale End Time</span>
          <input
            name={`${prefix}EndTime`}
            placeholder={`${label} Sale End Time`}
            onChange={handleChange}
            value={
              values[`${prefix}EndTime`]
                ? moment(values[`${prefix}EndTime`]).format(
                    'YYYY-MM-DDTHH:mm:ss',
                  )
                : undefined
            }
            type="datetime-local"
            className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Error name={`${prefix}EndTime`} />
        </label>
      </div>
      <div
        className={`mt-2 ${prefix === 'public' && 'grid grid-cols-2 gap-2'}`}
      >
        <label className="block w-full">
          <span className="text-white">{label} Sale Price</span>
          <input
            name={`${prefix}Price`}
            placeholder={`${label} Sale Price`}
            onChange={handleChange}
            value={values[`${prefix}Price`]}
            type="text"
            className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Error name={[`${prefix}Price`]} />
        </label>
        {prefix === 'public' && (
          <label className="block w-full">
            <span className="text-white">{label} Max Buy Limit</span>
            <input
              name={`${prefix}MaxBuy`}
              placeholder={`${label} Max Buy Limit`}
              onChange={handleChange}
              value={values[`${prefix}MaxBuy`]}
              type="text"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={[`${prefix}MaxBuy`]} />
          </label>
        )}
      </div>
      <div className="mt-5 mb-5">
        <p className="font-bold text-white capitalize text-md">
          {' '}
          {label} Claimer Info:
        </p>
      </div>
      <div className="mt-2">
        <div className="grid grid-cols-4 gap-2">
          <label className="block w-full">
            <span className="text-white">TGE Percentage</span>
            <input
              name={`${prefix}TgePercentage`}
              placeholder="TGE Percentage"
              onChange={handleChange}
              value={values[`${prefix}TgePercentage`]}
              type="text"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={`${prefix}TgePercentage`} />
          </label>

          <label className="block w-full">
            <span className="text-white">Cliff Period</span>
            <input
              name={`${prefix}Cliff`}
              placeholder="Cliff Period"
              onChange={handleChange}
              value={values[`${prefix}Cliff`]}
              type="text"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={`${prefix}Cliff`} />
          </label>

          <label className="block w-full">
            <span className="text-white">Interval</span>
            <input
              name={`${prefix}Interval`}
              placeholder="Interval"
              onChange={handleChange}
              value={values[`${prefix}Interval`]}
              type="text"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={`${prefix}Interval`} />
          </label>

          <label className="block w-full">
            <span className="text-white">Vesting Percentage</span>
            <input
              name={`${prefix}VestingPercentage`}
              placeholder="Vesting Percentage"
              onChange={handleChange}
              value={values[`${prefix}VestingPercentage`]}
              type="text"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={`${prefix}VestingPercentage`} />
          </label>
        </div>
        <div className="mt-2">
          <label className="block w-full">
            <span className="text-white">TGE Start Time</span>
            <input
              name={`${prefix}TgeStartTime`}
              placeholder={`TGE Start Time`}
              onChange={handleChange}
              value={
                values[`${prefix}TgeStartTime`]
                  ? moment(values[`${prefix}TgeStartTime`]).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    )
                  : undefined
              }
              type="datetime-local"
              className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <Error name={`${prefix}TgeStartTime`} />
          </label>
        </div>
      </div>
    </div>
  );
}
