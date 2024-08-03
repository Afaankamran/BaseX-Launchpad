import { Box, Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Images from "@/public/Assets/Images";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Telegram } from "@mui/icons-material";
import { FaDiscord } from "react-icons/fa";

export default function Team() {
  const iconsStyle = ["p-5 border-2   flex items-center cursor-pointer"];

  const teamData = [
    {
      name: "Ray",
      rule: "Co-Founder",
      subtitle: "Roboticist and AI Developer. Former 2x Founder.",
      img: Images.Team2,
      twitter: "https://twitter.com/array_capital",
    },
    {
      name: "Ace",
      rule: "Co-Founder & Project Analyst",
      subtitle: "Computer Scientist and Founder of an EdTech startup.",
      img: Images.Team3,
      twitter: "https://twitter.com/array_capital",
    },
    {
      name: "One",
      rule: "Blockchain Developer & Partner",
      subtitle: "Blockchain Developer and CEO of a Web3 Development Company.",
      img: Images.Team1,
      twitter: "https://twitter.com/array_capital",
    },
    {
      name: "Tyr",
      rule: "Advisor Analyst",
      subtitle: "Investment Fund Analyst and Owner of DeFi Made Here.",
      img: Images.Team4,
      twitter: "https://twitter.com/DeFi_Made_Here",
    },
    {
      name: "Arc",
      role: "Head of Business Development",
      subtitle: "MechE and Co-Founder of multiple Web2 Startups",
      img: Images.Team5,
      twitter: "https://twitter.com/array_capital",
    },
    {
      name: "Jue",
      role: "Core Contributor",
      subtitle: "Blockchain Investment Analyst",
      img: Images.Team6,
      twitter: "https://twitter.com/array_capital",
    },
  ];
  return (
    <>
      <div className="max-w-[1530px] mx-auto px-4 py-[3rem] mt-10">
        <div className="text-center text-xs text-white space-y-2">
          <Box className="flex justify-center items-center">
            <Typography variant="h4">Meet with our</Typography>
          </Box>
          <Box>
            <Typography color="text.primary" variant="h1">
              Team
            </Typography>
          </Box>
        </div>

        <div className=" mt-20 lg:mt-44">
          <Grid container className="my-[9rem] gap-y-36">
            {teamData.map((item, id) => {
              return (
                <Grid item xs={12} sm={12} md={6} lg={4} key={id}>
                  <Card
                    variant="outlined"
                    sx={{ overflow: "visible", my: { xs: "8rem", lg: "0rem" } }}
                    className="rounded-xl  border  mx-3   pt-8 px-2 h-full"
                  >
                    <div className="flex relative -top-40 items-center justify-center  ">
                      <div className="rounded-full overflow-hidden w-[250px] h-[250px]">
                        <Image src={item.img} />
                      </div>
                    </div>
                    <div className="relative -top-24 space-y-3">
                      <Typography variant="h5" className="mb-2 text-center">
                        {item.name}
                      </Typography>
                      <Typography
                        color="text.light"
                        className="mb-4 text-center "
                      >
                        {item.rule}
                      </Typography>

                      <Typography
                        color="text.light"
                        className="text-center  px-6 mb-6"
                        style={{ minHeight: "120px" }}
                      >
                        {item.subtitle}
                      </Typography>
                      <div className="flex justify-center items-center space-x-5 relative top-10  ">
                        <a href="https://t.me/array_capital" target="_blank">
                          <Card
                            sx={{ borderRadius: 0.5 }}
                            variant="outlined"
                            className={`${iconsStyle}`}
                          >
                            <Telegram />
                          </Card>
                        </a>
                        <a href={item.twitter} target="_blank">
                          <Card
                            sx={{ borderRadius: 0.5 }}
                            variant="outlined"
                            className={`${iconsStyle}`}
                          >
                            <TwitterIcon />
                          </Card>
                        </a>
                        <a
                          href="https://discord.com/invite/arraycapital"
                          target="_blank"
                        >
                          <Card
                            sx={{ borderRadius: 0.5 }}
                            variant="outlined"
                            className={`${iconsStyle}`}
                          >
                            <FaDiscord size={25} />
                          </Card>
                        </a>
                      </div>
                    </div>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </>
  );
}
