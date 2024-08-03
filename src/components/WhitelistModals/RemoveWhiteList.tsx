import { useIDOContract } from '@/hooks';
import useWhiteListForm from '@/hooks/useWhiteListForm';
import { useTransactionAdder } from '@/state/transactions/hooks';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function RemoveWhiteListModal({
  toggleWhiteListModal,
  whiteListModalOpen,
  poolAddress,
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const idoContract = useIDOContract(poolAddress);
  const { handleChange, value, parsedData, error, invalidData, reset } =
    useWhiteListForm();
  const addTransaction = useTransactionAdder();

  const whiteListUsers = async () => {
    if (error || parsedData.length <= 0) {
      return;
    }
    try {
      setLoading(true);
      const tx = await idoContract.batchRemoveWhitelisted(parsedData);
      addTransaction(tx, {
        summary: 'Removed Whitelist ',
      });
      reset();
      toggleWhiteListModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={whiteListModalOpen}
      onClose={toggleWhiteListModal}
    >
      <DialogTitle>Remove Users from whitelist</DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2}>
          <InputLabel>Users</InputLabel>
          <Box sx={{ '&>textarea': { borderRadius: '4px' } }}>
            <TextareaAutosize
              value={value}
              onChange={handleChange}
              className="w-full mt-1 text-sm bg-transparent"
              minRows={5}
              placeholder="Insert address: separate with breaks line. Ex: 0x34E7f6A4d0BB1fa7aFe548582c47Df337FC337E6 0xd8Ebc66f0E3D638156D6F5eFAe9f43B1eBc113B1 0x968136BB860D9534aF1563a7c7BdDa02B1A979C2"
            />
          </Box>
          <Box>
            <Typography color="error" variant="caption">
              {error}
            </Typography>
            {invalidData.length > 0 && (
              <Box sx={{ fontSize: 13 }}>
                {invalidData.map((i) => {
                  return (
                    <span>
                      {i}
                      <br />
                    </span>
                  );
                })}
              </Box>
            )}
          </Box>
          <Button
            onClick={whiteListUsers}
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            disabled={!!error || loading}
          >
            {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
            Remove Users
          </Button>
        </Box>
      </DialogContent>
      <div className="flex flex-col space-y-6"></div>
    </Dialog>
  );
}
