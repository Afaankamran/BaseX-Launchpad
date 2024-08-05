import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3Status from "../Web3Status";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useETHBalances } from "../../state/wallet/hooks";
import { useWalletModalToggle } from "@/state/application/hooks";
import moment from "moment-timezone";
import AdminProvider, { useAdmin } from "../Admin/Context";
import { NATIVE } from "@devdot/basex-sdk";
import Iframe from "react-iframe";
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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "next/link";
import { useDarkModeManager } from "@/state/user/hooks";
import { OutlinedCard } from "../OutlinedCard";
import CountDown from "../CountDown";
import { useLaunchpads } from "@/hooks/useLaunchpadPools";
import getEarlyPool from "@/functions/getEarlyPools";
import baseXLogo from "../../../public/images/BASE X white-01.png"; // Import the logo image

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
    background:
      theme.palette.mode == "dark" ? "#020203" : "rgb(255, 250, 245)",
  },
}));

function AppBar(): JSX.Element {
  const [isDarkMode, toggleMode] = useDarkModeManager();
  const { account } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ""
  ];
  const routeToAvoid = ["exchange", "add", "remove", "farm", "pool", "swap", "find"];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [state, setState] = useState({ right: false });

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
              className="cursor-pointer"
            >
              <Image
                src={baseXLogo}
                alt="BaseX Logo"
                width={90} // Adjust the width as needed
                height={60} // Adjust the height as needed
              />
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
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-golden">$</div>
                <span className="ml-2"> {10}</span>
              </Box>
            </Box>
          </Link>
          <Box className="flex flex-col items-center justify-between mb-10 space-y-5 transition">
            {/* <NavLink href="/swap" title="DEX" /> */}
            {/* <NavLink href="/farm" title="Farm" />
            <NavLink href="/launchpad" title="Launchpad" />
            <NavLink href="/stake" title="Stake" />
            <NavLink2 href="https://docs.array.capital/" title="Docs" />
            <NavLink href="/apply_ido" title="Apply" />
            <NavLink href="/bridge" title="Bridge"/>
            <NavLink3
              href="https://app.kado.money/?apiKey=19e78e6b-4940-4a99-a8a2-faab237059e7&product=BUY&onPayCurrency=USD&onRevCurrency=ETH&network=ARBITRUM"
              title="Buy ETH"
            /> */}
          </Box>
          <Box className="flex justify-center items-center flex-col">
            <Web3Status />
            {/* <w3m-button /> */}
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
        ? setStickyClass("sticky top-0 left-0 z-30 w-full transition-all")
        : setStickyClass("relative transition");
    }
  };

  const router = useRouter();
  const pools = useLaunchpads();

  return (
    <>
      <Box
        className={`${stickyClass} w-full`}
        sx={{
          background: isDarkMode ? "#000000" : "#ffffff",
          borderImageSlice: "1",
        }}
      >
        <Container maxWidth="xl">
          <Box
            className="h-[100px]"
            sx={{
              display: "flex",
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
            >
              <Link href="/">
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  className="cursor-pointer"
                >
                  <Image
                    src={baseXLogo}
                    alt="BaseX Logo"
                    width={90} // Adjust the width as needed
                    height={60} // Adjust the height as needed
                  />
                </Box>
              </Link>
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
                      className="cursor-pointer"
                    >
                      <Box
                        sx={{
                          width: "26px",
                          height: "2px",
                          borderRadius: "10px",
                          background: isDarkMode
                            ? "#ffffff"
                            : "rgb(0, 22, 51)",
                          mb: "5px",
                        }}
                      ></Box>
                      <Box
                        sx={{
                          width: "26px",
                          height: "2px",
                          borderRadius: "10px",
                          background: isDarkMode
                            ? "#ffffff"
                            : "rgb(0, 22, 51)",
                          mb: "5px",
                        }}
                      ></Box>
                      <Box
                        sx={{
                          width: "15px",
                          height: "2px",
                          borderRadius: "10px",
                          background: isDarkMode
                            ? "#ffffff"
                            : "rgb(0, 22, 51)",
                        }}
                      ></Box>
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
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              display={{ xs: "none", lg: "flex" }}
              justifyContent="center"
              alignItems="center"
            >
              {/* Add your navigation links here */}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={3}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Web3Status />
              {/* <Web3NetworkSwitcher /> */}
              <Button
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: isDarkMode ? "#ffffff" : "#000000",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                {/* <Box
                  sx={{
                    width: "26px",
                    height: "2px",
                    borderRadius: "10px",
                    background: isDarkMode ? "#ffffff" : "rgb(0, 22, 51)",
                    mb: "5px",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: "26px",
                    height: "2px",
                    borderRadius: "10px",
                    background: isDarkMode ? "#ffffff" : "rgb(0, 22, 51)",
                    mb: "5px",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: "15px",
                    height: "2px",
                    borderRadius: "10px",
                    background: isDarkMode ? "#ffffff" : "rgb(0, 22, 51)",
                  }}
                ></Box> */}
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} disableRipple>
                  {/* Add your menu items here */}
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
              </StyledMenu>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default AppBar;