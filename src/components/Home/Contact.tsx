import {
  Box,
  Button,
  TextareaAutosize,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { styled } from '@mui/system';
import { useIsDarkMode } from '@/state/user/hooks';

const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.border}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2.2),
  fontSize: '16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.text.light,
  '&::-webkit-input-placeholder': {
    color: theme.palette.text.light,
  },
  '&::-moz-placeholder': {
    color: theme.palette.text.light,
  },
  '&:-ms-input-placeholder': {
    color: theme.palette.text.light,
  },
  '&:-moz-placeholder': {
    color: theme.palette.text.light,
  },
  '&::placeholder': {
    color: theme.palette.text.light,
  },
}));
export default function Contact() {
  const isDarkMode = useIsDarkMode();

  const inputStyle = [
    ' border-2 rounded border-[#4767fb1a] bg-[#090c1c] flex items-center  rounded-[15px] flex justify-between items-center w-full p-5',
  ];
  return (
    <Box
      sx={{
        background: ' linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
        padding: '1px 0px',
      }}
    >
      <Box
        sx={{
          background: isDarkMode ? '#0A0815' : '#ffffff',
        }}
      >
        <Box
          sx={{
            background:
              'linear-gradient(90deg, rgba(255, 62, 61, 0.05) 0%, rgba(70, 109, 253, 0.05) 100%)',
          }}
          className="calWidth py-[10vh] "
        >
          <div className="text-center text-xs text-white space-y-2">
            <Box className="flex justify-center items-center">
              <Typography variant="h4">Newsletter</Typography>
            </Box>
            <Box>
              <Typography variant="h1" color="text.primary">
                Let's Get in Touch
              </Typography>
            </Box>
          </div>
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="max-w-5xl mx-auto p-10 "
          >
            <div className="flex w-full flex-col  md:flex-row justify-around items-center space-y-3 md:space-y-0 md:space-x-2  text-white">
              <div className="w-full col-span-6 sm:col-span-3 flex-1">
                <TextField placeholder="Name" fullWidth />
              </div>

              <div className="w-full col-span-6 sm:col-span-3 flex-1 ">
                <TextField placeholder="Telegram Handle" fullWidth />
              </div>
            </div>

            <div className="mt-4">
              <div className="mt-1">
                <StyledTextArea
                  placeholder="Write Your Message..."
                  className={`w-full`}
                  minRows={5}
                />
              </div>
            </div>
            <div className=" text-center ">
              <button
                id="submitId"
                type="submit"
                className=" font-bold p-5 text-center border-[#4767fb1a] cursor-pointer  rounded-[15px] bg-gradient-to-r from-[#FF3E3D] to-[#466DFD]  flex justify-center items-center w-full mt-5 text-white "
              >
                Send Message
              </button>
            </div>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
