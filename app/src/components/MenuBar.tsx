import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";

interface MenuBarProps {
  handleDrawerToggle: () => void;
}

export default function MenuBar({ handleDrawerToggle }: MenuBarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        {/* <SvgIcon component={LogoIcon} viewBox="0 0 24 24" /> */}
        <LogoIcon />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
        >
          PCSO Lotto Results
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

const LogoIcon = () => (
  <svg
    height="1.5em"
    strokeMiterlimit="10"
    style={{
      fillRule: "nonzero",
      clipRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
    version="1.1"
    viewBox="0 0 24 24"
    width="1.5em"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="basic">
      <path
        d="M12 1.43871C18.0751 1.43871 23 6.16716 23 12C23 17.8328 18.0751 22.5613 12 22.5613"
        fill="#0000ff"
        fillRule="nonzero"
        opacity="1"
        stroke="#ffff00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
      <path
        d="M12 1.43871C5.92487 1.43871 1 6.16716 1 12C1 17.8328 5.92487 22.5613 12 22.5613"
        fill="#ff0000"
        fillRule="nonzero"
        opacity="1"
        stroke="#ffff00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
      <path
        d="M12 21.8611L9.8083 17.2783L5.00999 18.9729L6.70876 14.1863L2.11463 12L6.70876 9.81367L5.00999 5.02712L9.8083 6.72174L12 2.13886L14.1917 6.72174L18.99 5.02712L17.2912 9.81367L21.8854 12L17.2912 14.1863L18.99 18.9729L14.1917 17.2783L12 21.8611Z"
        fill="#ffffff"
        fillRule="nonzero"
        opacity="1"
        stroke="#ffff00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </g>
  </svg>
);
