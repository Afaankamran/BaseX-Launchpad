import {
  Typography,
  Container,
  Button,
  Stack,
  styled,
  Grid,
  alpha,
} from '@mui/material';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
import { useIsDarkMode } from '@/state/user/hooks';
import { FiPlusCircle } from "react-icons/fi";


const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  background: alpha(theme.palette.primary.dark, 0.1),
  border: `1px solid ${theme.palette.common.border} `,
  '&.Mui-expanded .MuiAccordionDetails-root': {
    borderTop: `1px solid ${theme.palette.common.border}`,
  },
  '&::before': {
    display: 'none',
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
}));

const StyledFaqImageWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  width: "50px",
  height: "50px",
  borderRadius: '50%',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, #070E30 100%)',
    opacity: 0.2,
  },
}));

export default function Faqs() {
  const isDarkMode = useIsDarkMode();
  const faqData = [
    {
      question: 'What kind of projects will BaseX host?',
      answer:
        'BaseX will exclusively host projects on Base network with sustainable revenue models.',
    },
    {
      question: "How safe are BaseX's launches?",
      answer:
        'Investors should check whether the project in KYCed and audited. BaseX will try their best to guarantee safe investments but are not liable for any malacious or hack activities outside of their control. Investments will always pose a real risk.',
    },
    {
      question: 'How do i participate in IDOs?',
      answer:
        'For Launchpads, wait for the sale to start. Once the sale starts, connect your wallet and send it how much you want to invest.',
    },
    {
      question: 'Are there Participation limits?',
      answer:
        'Participation limits of the investors are decided by project owners. Please check their terms and conditions in investing.',
    },
    {
      question: 'When will i receive the project tokens after the IDO is finished?',
      answer:
        'Each project TGE date & Vesting schedule is unique, all dates are mentioned in the IDO Pages.',
    },
    // {
    //   question: 'What are the launch price premium?',
    //   answer:
    //     'We aim for a 20% launch price premium at TGE, but that is up to the team\'s final discretion.',
    // },
    {
      question: 'How do i apply as a project for IDO?',
      answer:
        'Visit the Apply for IDO page to apply.',
    }
  ];
  return (
    <Container maxWidth="lg">
      <Box
        py={10}
        // mb={10}
        sx={{
          backgroundColor: isDarkMode ? '#070309' : 'transparent',
        }}
        className="faq"
      >
        <Box>
          <Box>
            <Box>
              <div className="text-left w-full space-y-2">
                <Box className="flex justify-start items-center w-full">
                  <Typography variant="h4" fontSize="50px" fontWeight="bold">FAQS</Typography>
                </Box>

              </div>
            </Box>

            <Box py={10}>
              <Container maxWidth="lg">
                <div className="space-y-1">
                  {faqData.map((item, id) => {
                    return (
                      <StyledAccordion key={id}>
                        <AccordionSummary
                          sx={{ flexShrink: '0' }}
                          expandIcon={<FiPlusCircle size="35px" />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <StyledFaqImageWrapper>
                              <Image src={Images.FaqQuestion} />
                            </StyledFaqImageWrapper>
                            <h2 className="ml-5 font-bold text-md lg:text-xl">
                              {item.question}
                            </h2>
                          </Box>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                          <Typography
                            color="common.white"
                            className="pt-4 pl-[1rem] lg:pl-[5rem] max-w-[1400px] "
                          >
                            {item.answer}
                          </Typography>
                        </StyledAccordionDetails>
                      </StyledAccordion>
                    );
                  })}
                </div>
              </Container>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}