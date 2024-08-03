import { Box, Typography, Link } from "@mui/material";
import Image from "next/image";
import Images from "@/public/Assets/Images";
import HeroCard from "./Card/heroCard";
import { useTheme } from "@mui/system";
import styled from "@emotion/styled";
import { useIsDarkMode } from "@/state/user/hooks";
import Web3Status from "../Web3Status";

export default function Hero() {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  const {
    palette: { mode },
  } = theme;
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        zIndex: "1",
      }}
    >
      <Box className={`mx-5 md:h-[600px]  ${isDarkMode ? "darkBg" : ""}`}>
        <Box sx={{ padding: "12vh 0" }} className="max-w-7xl mx-auto">
          <Box className='flex justify-between items-center flex-col md:flex-row'>
            <Box className="text-center md:text-left mb-10 ">
              <h2 style={{ color: "#fff" }} className="text-3xl lg:text-[40px] font-bold text-transparent lg:leading-normal text-[#ffffff] md:mb-5 pb-4 text-center md:text-left">
                <span className='text-3xl lg:text-[40px] font-bold text-transparent lg:leading-tight bg-clip-text bg-gradient-to-r from-[#fd0000] to-[#466DFD] pb-4 text-center md:text-left'>Welcome to BaseDEX:  </span> <br /> Your Gateway to the Future of Finance
              </h2>
              <Typography color="text.primary" fontSize='18px'>
                Explore seamless decentralized trading, token launches <br /> and robust security features on Base Network
              </Typography>
            </Box>
            <Box>
              <video autoPlay style={{ width: '500px', height: '500px' }} loop muted>
                <source src="/video/dark.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
