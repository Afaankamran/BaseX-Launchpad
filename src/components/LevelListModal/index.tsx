import { useIDOContract } from "@/hooks";
import {
  useMasterChefTokenBalance,
  useMasterChefUser,
} from "../../hooks/useMasterChefUsers";
import {
  useTierGenerator,
  useUsersBuyingPower,
} from "@/hooks/useTierGenerator";
import { useTransactionAdder } from "@/state/transactions/hooks";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useState } from "react";
import IPFS from "nano-ipfs-store";
import { BigNumber } from "@ethersproject/bignumber";
import { fromWei, truncate } from "@/functions";
import JSBI from "jsbi";
const ipfs = IPFS.at("https://ipfs.io/ipfs");
import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the thirdweb IPFS storage
const storage = new ThirdwebStorage();

export default function LevelListModal({
  toggleLevelListModal,
  levelListModalOpen,
  poolAddress,
  data,
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const idoContract = useIDOContract(poolAddress);
  const masterChefUsers = useMasterChefUser();
  const userTier = useTierGenerator(masterChefUsers);
  const { userBuying, root, mappedData } = useUsersBuyingPower(
    data.tokensForSale,
    userTier
  );
  const addTransaction = useTransactionAdder();
  const addLevelUsers = async () => {
    if (!root || Object.values(mappedData).length <= 0) {
      return;
    }
    try {
      setLoading(true);
      const ipfsHash = await storage.upload(mappedData);
      // const ipfsHash = await ipfs.add(JSON.stringify(mappedDaa));
      const tx = await idoContract.setTierUsersRoot(root, ipfsHash);
      addTransaction(tx, {
        summary: "Added LevelUsers ",
      });
      toggleLevelListModal();
      setLoading(false);
    } catch (error) {
      alert(
        (error.error ? error.error.message : error.message).replace(
          "execution reverted:",
          ""
        )
      );
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={levelListModalOpen}
      onClose={toggleLevelListModal}
      PaperProps={{
        sx: {
          boxShadow: "none",
          backgroundImage: "none",
          background: "#08192e",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
        }}
      >
        Add Levels users to IDO
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Token Buying Power</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: "90vh", overflowY: "auto" }}>
              {userBuying.map((user) => {
                return (
                  <TableRow>
                    <TableCell>{user.account}</TableCell>
                    <TableCell>
                      {truncate(
                        fromWei(
                          BigNumber.from(JSBI.BigInt(user.amount).toString())
                        )
                      )}
                    </TableCell>
                    <TableCell>{user.tier.tier}</TableCell>
                    <TableCell>
                      {truncate(
                        fromWei(
                          BigNumber.from(
                            JSBI.BigInt(user.buyingPower).toString()
                          )
                        )
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={addLevelUsers}
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
              Add Users
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <div className="flex flex-col space-y-6"></div>
    </Dialog>
  );
}
