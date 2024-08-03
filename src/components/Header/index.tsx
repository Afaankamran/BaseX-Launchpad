import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// import Image from 'next/image';
// import Link from 'next/link';
// import NavLink from '../NavLink';
// import { Popover } from '@headlessui/react';
import Web3Status from "../Web3Status";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useETHBalances } from "../../state/wallet/hooks";
import { useWalletModalToggle } from "@/state/application/hooks";
import moment from "moment-timezone";
import AdminProvider, { useAdmin } from "../Admin/Context";
import { NATIVE } from "@devdot/basex-sdk";
import Iframe from "react-iframe";

// New UI Import
import {
  Box,
  Grid,
  Container,
  Stack,
  Typography,
  SwitchProps,
  Switch,
  FormControlLabel,
  Card,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Divider from "@mui/material/Divider";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import Images from "@/public/Assets/Images";

// Drawer Import Start
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "next/link";
import { useDarkModeManager } from "@/state/user/hooks";
// import { getTokenPrice } from "@/services/graph/fetchers";
import { OutlinedCard } from "../OutlinedCard";
import CountDown from "../CountDown";
import { useLaunchpads } from "@/hooks/useLaunchpadPools";
import getEarlyPool from "@/functions/getEarlyPools";

type Anchor = "right";

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: "0",
  marginRight: "0",
}));
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
    sx={{
      left: "20px",
    }}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 15,
    marginTop: theme.spacing(1),
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow: "0px 4px 20px rgba(70, 109, 253, 0.15)",
    border:
      theme.palette.mode == "dark"
        ? "0.5px solid #2C2E56"
        : "0.5px solid #D8DAF5",
    "& .MuiMenu-list": {
      padding: "1rem",
    },

    // backgroundColor: isDarkMode ? ' #020203' : '#fafafa',
    background:
      theme.palette.mode == "dark" ? "#020203" : " rgb(255, 250, 245)",
  },
}));
// 

function AppBar(): JSX.Element {
  const [isDarkMode, toggleMode] = useDarkModeManager();
  // Wallet Connect start
  const { account, chainId, library } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ""
  ];

  const routeToAvoid = ["exchange", "add", "remove", "farm", "pool", "swap", "find"];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Drawer Menu Start
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: "300px",
        height: "100%",
        // backgroundColor: '#243A85',
        background: isDarkMode ? "#000000" : "#ffffff",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Link href="/">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="20px"
              width="100%"
              className="cursor-pointe"
            >
              <h1 className="  font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-[#FF3E3D] to-[#466DFD]">
                BASEX
              </h1>
              <Box
                sx={{
                  background: "linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)",
                  padding: "7px 13px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                {/*<Image src={Images.cash} alt="Coin Image" />*/}
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-golden" >$</div>
                <span className="ml-2"> {10}</span>{" "}
              </Box>
            </Box>
          </Link>
          <Box className="flex flex-col items-center justify-between mb-10 space-y-5 transition">
            <NavLink href="/swap" title="DEX" />
            {/* <NavLink href="/farm" title="Farm" />
            <NavLink href="/launchpad" title="Launchpad" />
            <NavLink href="/stake" title="Stake" />

            <NavLink2 href="https://docs.array.capital/" title="Docs" /> */}
            {/* <NavLink href="/apply_ido" title="Apply" /> */}
            {/* <NavLink href="/bridge" title="Bridge"/> */}

            {/* <NavLink3
              href="https://app.kado.money/?apiKey=19e78e6b-4940-4a99-a8a2-faab237059e7&product=BUY&onPayCurrency=USD&onRevCurrency=ETH&network=ARBITRUM"
              title="Buy ETH"
            /> */}
            {/* {
              routeToAvoid.some(route => router.asPath.includes(route)) ? null :
                <StyledFormControlLabel
                  onChange={toggleMode}
                  control={<Android12Switch checked={isDarkMode} />}
                  label=""
                />
            } */}
          </Box>

          <Box className="flex justify-center items-center flex-col">
            <Web3Status />
          {/* //  <w3m-button /> */}


          </Box>
        </ListItem>
      </List>
      {/* <Divider /> */}
    </Box>
  );

  const [stickyClass, setStickyClass] = useState("relative transition");

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY;

      windowHeight > 0
        ? setStickyClass(" sticky top-0 left-0 z-30 w-full transition-all")
        : setStickyClass("relative transition");
    }
  };

  const router = useRouter();
  const pools = useLaunchpads();



  return (
    <>

      {/* {router.pathname !== "/airdrop" && <OutlinedCard
        sx={{
          padding: "1rem",
          width: "100%",
          borderRadius: 0,
          textAlign: "center",
          fontSize: "1.3rem",
          fontWeight: "bold",
        }}
      >
        <CountDown pool={pool} />
      </OutlinedCard>} */}

      <Box
        className={`${stickyClass} w-full`}
        sx={{
          // background: linear-gradient(90deg, #FF3E3D 30%, #466DFD 60%);
          background: isDarkMode ? "#000000" : "#ffffff",

          borderImageSlice: "1",
        }}
      >
        <Container maxWidth="xl">
          <Box
            className="h-[100px] "
            sx={{
              display: "flex ",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Grid
              item
              xs={12}
              md={12}
              lg={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            // sx={{
            //   background: 'green',
            // }}
            >
              <Link href="/">
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  className="cursor-pointer"
                >
                  <h1 className="ml-4 mb-1 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-[#FF3E3D] to-[#466DFD]">
                    BaseX
                  </h1>
                </Box>
              </Link>

              {/* Drawer Start */}
              <Box
                sx={{
                  display: { xs: "flex", lg: "none" },
                  marginRight: "15px",
                }}
              >
                {(["right"] as const).map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Box
                      onClick={toggleDrawer(anchor, true)}
                      sx={{
                        cursor: "pointer",
                        filter: isDarkMode ? "" : "invert(100%)",
                      }}
                    >
                      <Image src={Images.headerIcon} />
                    </Box>
                    <Drawer
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                    >
                      {list(anchor)}
                    </Drawer>
                  </React.Fragment>
                ))}
              </Box>
              {/* Drawer End */}
            </Grid>
            <Box
              sx={{
                display: { xs: "none", md: "none", lg: "flex" },
                height: "100px",
                // background: 'red',
              }}
              className="w-full"
            >
              {/* <HomeButton /> */}

              <Grid item sx={{ display: "flex", width: "100%" }}>
                <Box
                  sx={{
                    borderLeft: "1px solid rgba(129, 169, 216, 0.08)",
                    borderRight: "1px solid rgba(129, 169, 216, 0.08)",
                    alignItems: "center",
                  }}
                  className="flex items-center justify-between px-2  w-full"
                >
                  <NavLink href="/swap" title="DEX" />
                  {/* <NavLink href="/farm" title="Farm" />
                  <NavLink href="/launchpad" title="Launchpad" />
                  <NavLink href="/stake" title="Stake" /> */}

                  {/* <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div className="!relative">
                        <Button
                          style={{
                            background: "none",
                            textTransform: "capitalize",
                            fontSize: "16px",
                            color: isDarkMode ? "white" : "black",
                          }}
                          className={
                            "cursor-pointer hover:text-white   bg-gradient-to-r   hover:from-[#FF3E3D] hover:to-[#466DFD] px-4 py-3 p-2 rounded-[10px] relative  transition "
                          }
                          id="demo-customized-button"
                          aria-controls={
                            open ? "demo-customized-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          variant="contained"
                          disableElevation
                          onClick={handleClick}
                          endIcon={
                            <KeyboardArrowDownIcon
                            />
                          }

                        >
                          Stats
                        </Button>
                        <StyledMenu
                          id="demo-customized-menu"
                          MenuListProps={{
                            "aria-labelledby": "demo-customized-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          className="absolute top-0 left-0"
                        >
                          <Link href="/stats">
                            <MenuItem
                              onClick={handleClose}
                              disableRipple
                              sx={{
                                fontSize: "20px",
                                fontWeight: "600",
                                lineHeight: "30px",
                                paddingBottom: "10px",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, rgba(255, 62, 61, 0.1) 0%, rgba(70, 109, 253, 0.1) 100%)",
                                },
                              }}
                              className="border_bottom_raidal"
                            >
                              <Box className=" flex justify-between items-center  w-[250px]">
                                <Box className="flex items-center">
                                  <Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      filter: `${isDarkMode ? "" : "invert(100%)"
                                        }`,
                                    }}
                                  >
                                    <p className="ml-3 font-bold text-white">
                                      Stats
                                    </p>
                                  </Box>
                                </Box>
                                <Box>
                                  <Image src={Images.heroarrow} />
                                </Box>
                              </Box>
                            </MenuItem>
                          </Link>

                          <Link href="/">
                            <a
                              href="https://analytics.array.capital/"
                              target="_blank"
                            >
                              <MenuItem
                                onClick={handleClose}
                                disableRipple
                                sx={{
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  lineHeight: "30px",
                                  paddingTop: "15px",

                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg, rgba(255, 62, 61, 0.1) 0%, rgba(70, 109, 253, 0.1) 100%)",
                                  },
                                }}
                              >
                                <Box className=" flex justify-between items-center  w-[250px]">
                                  <Box className="flex items-center justify-between">


                                    <Box
                                      sx={{
                                        filter: `${isDarkMode ? "" : "invert(100%)"
                                          }`,
                                      }}
                                    >
                                      <p className="ml-3 font-bold text-white">
                                        Analytics
                                      </p>
                                    </Box>
                                  </Box>
                                  <Box>
                                    <Image src={Images.heroarrow} />
                                  </Box>
                                </Box>
                              </MenuItem>
                            </a>
                          </Link>
                        </StyledMenu>
                      </div>
                    </Box>
                  </Box> */}

                  {/* <NavLink2 href="https://docs.array.capital/" title="Docs" /> */}
                  {/* <NavLink href="/apply_ido" title="Apply" /> */}

                  {/* <NavLink href="bridge" title="Bridge"/> */}

                  {/* <NavLink3
                    href="https://app.kado.money/?apiKey=19e78e6b-4940-4a99-a8a2-faab237059e7&product=BUY&onPayCurrency=USD&onRevCurrency=ETH&network=ARBITRUM"
                    title="Buy ETH"
                  /> */}
                </Box>
              </Grid>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "none", lg: "flex" },
                height: "100px",
                // background: 'orange',
              }}
              className="space-x-2"
            >
              {/* Wallet Connect */}
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 1rem",
                  borderRight: "1px solid rgba(129, 169, 216, 0.08)",
                  borderLeft: "1px solid rgba(129, 169, 216, 0.08)",
                }}
              >
                <Web3Status />
                {/* <w3m-button /> */}
              </Grid>
              {/* Wallet Connect End */}

              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  jsutifyContent: "center",
                }}
              // className="space-x-3"
              >
                {/* Theme Shift */}

                {/* {routeToAvoid.some((route) =>
                  router.asPath.includes(route)
                ) ? null : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid rgba(129, 169, 216, 0.08)",
                      height: "100%",
                    }}
                  >
                    <StyledFormControlLabel
                      onChange={toggleMode}
                      control={<Android12Switch checked={isDarkMode} />}
                      label=""
                    />
                  </Box>
                )} */}

                {/* Theme Shift End */}

                {/* Live Price */}
                <Box sx={{ paddingLeft: "15px", width: "110px" }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      display: "flex",
                      flexShrink: "0",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Box className=" flex-shrink-0 flex items-center">
                      {/* <Image src={Images.cash} alt="Coin Image" /> */}
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-golden" >$</div>
                    </Box>

                    <span className="ml-2 text-white">
                      {" "}
                      10
                    </span>
                  </Box>
                </Box>

                {/* Live Price  End*/}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default AppBar;
// AppBar.Provider = AdminProvider;

function NavLink({ href, title, unavailable = false }) {
  const router = useRouter();

  return (
    <Link href={href}>
      <a
        className={
          router.pathname === href
            ? "cursor-pointer text-white  bg-gradient-to-r px-4 py-3 p-2  relative  transition"
            : "cursor-pointer hover:text-white bg-gradient-to-r border-b border-transparent hover:border-red  px-4 py-3 p-2  relative  transition"
        }
      >
        {title}
        {unavailable && (
          <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#FF3E3D] to-[#466DFD] absolute -top-2 left-1/2 -translate-x-1/2 w-max  ">
            Soon
          </span>
        )}
      </a>
    </Link>
  );
}