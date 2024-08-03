import Images from '@/public/Assets/Images';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import Image from 'next/image';
const lastCardData = [

  {
    img: Images.lastCard2,
    title: 'Announcing Launch',
    author: 'BaseX',
    tag: 'News',
    // time: '2 days ago',
    url: '',
  },
  {
    img: Images.lastCard3,
    title: 'Announcing Launch',
    author: 'BaseX',
    tag: 'News',
    // time: '2 days ago',
    url: '',
  },
];
export default function LearnAndEarn() {
  return (
    <Container maxWidth="lg" className='mt-32'>
      <Box className="">
        <Box>
          <div className="text-left w-full space-y-2">
            <Box className="flex justify-start items-center w-full">
              <Typography variant="h4" fontSize="50px" fontWeight="bold">Read More</Typography>
            </Box>

          </div>
        </Box>

        <Box className="mt-20">
          <div className="grid gap-5 grid-cols1 md:grid-cols-2 lg:grid-cols-3 place-content-center">
            {lastCardData.map((item, id) => {
              return (
                <div>
                  <Card
                    key={id}
                    sx={{
                      maxWidth: 425,
                      padding: '8px',
                      background: '#1f1b5b',
                      borderRadius: '20px',
                      border: '1px solid rgba(71, 103, 251, 0.2)',
                    }}
                  >
                    <a href={`${item.url}`} target="_blank">
                      <CardActionArea
                        disableRipple={true}
                        disableTouchRipple
                        focusRipple={false}

                        sx={{
                          "& .MuiCardActionArea-focusHighlight .Mui-focusVisible": {
                            "&:hover": {
                              backgroundColor: "red"
                            }
                          }
                        }}
                      >
                        <CardMedia style={{ background: "#fffff234", width: '100%', height: "200px", padding: "5px", borderRadius: "20px" }}>
                          {/* <Image src={item.img} /> */}
                        </CardMedia>
                        <CardContent sx={{ padding: "16px 0px" }}>
                          <Button
                            variant="contained"
                            size="medium"
                            sx={{
                              borderRadius: '10px',
                              background:
                                ' linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                              padding: '10px 2rem ',
                              fontWeight: '600',
                              marginRight: '-8px',
                            }}
                          >
                            {item.tag}
                          </Button>

                          <Typography
                            variant="h5"
                            color="black"
                            sx={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: ' 700',
                              fontSize: '24px',
                              // lineHeight: '36px',

                              color: 'text.light',
                            }}
                          >
                            {item.title}
                          </Typography>

                          <Box
                            sx={{
                              height: '1px',
                              background:
                                'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.46) 0%, rgba(124, 147, 255, 0.26) 100%);',
                              opacity: 0.5,
                            }}
                          ></Box>

                        </CardContent>
                      </CardActionArea>
                    </a>

                    <CardActions>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs
                          sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                          }}
                        >
                          <hr />
                          <div >
                            <div className='w-3 h-3 rounded-full p-3 bg-[#fff]' />
                            {/* <Image width={25} height={25} src={Images.lastAvatar} /> */}
                          </div>
                          <Typography
                            sx={{
                              marginLeft: '0.5rem',
                              fontWeight: '500',
                              fontSize: '14px',
                              lineHeight: '21px',
                              color: 'text.light',
                            }}
                          >
                            {item.author}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ flexShrink: 0 }}>
                            <Image src={Images.lastclock} />{' '}
                          </Box>
                          {/* <Typography
                            sx={{
                              marginLeft: '0.5rem',
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: '500',
                              fontSize: '14px',
                              lineHeight: '21px',
                              color: '#353e6e',
                            }}
                          >
                            {item.time}
                          </Typography> */}
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </div>
              );
            })}
          </div>
          {/* <Stack
              direction="row"
              spacing={2}
              className="flex justify-center mt-20 "
            >
              <LoadingButton

                startIcon={<Image src={Images.loading} alt="0" />}
                variant="outlined"
                size="large"
                style={{
                  border: '1px solid #81aad8',
                  background: '#4767FB12',
                  color: '#81A9D8',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                }}
              >
                Load More
              </LoadingButton>
            </Stack> */}
        </Box>
      </Box>
    </Container >
  );
}
