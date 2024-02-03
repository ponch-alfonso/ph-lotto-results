import { Box, Divider, Drawer, Link, Toolbar, Typography } from "@mui/material";

import FilterList from "./FilterList";
import FooterTextModal, { FooterTextModalType } from "./FooterTextModal";
import { DRAWER_WIDTH } from "../../utils/constants";
import { LottoResultsFilterState } from "../../utils/types";
import React from "react";

interface MainSideMenuProps {
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
  filterState: LottoResultsFilterState;
}

export default function MainSideMenu({
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
  filterState,
}: MainSideMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState(FooterTextModalType.About);

  /* The implementation can be swapped with js to avoid SEO duplication of links. */
  return (
    <Drawer
      container={document.body}
      variant="temporary"
      open={mobileOpen}
      onTransitionEnd={handleDrawerTransitionEnd}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", sm: "block" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Toolbar />
        <FilterList filterState={filterState}></FilterList>
        <Divider />

        <Box sx={{ p: 2, textAlign: "center", mt: "auto" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} &nbsp;
            <span style={{ color: "blue" }}>Ph</span>
            <span style={{ color: "red" }}>Lotto</span>
            <span style={{ color: "#f8e521" }}>Results</span>
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/terms"
              color="inherit"
              underline="none"
              onClick={(event) => {
                event.preventDefault();
                setType(FooterTextModalType.Terms);
                setOpen(true);
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Terms
              </Typography>
            </Link>

            <Link
              href="/privacy"
              color="inherit"
              underline="none"
              onClick={(event) => {
                event.preventDefault();
                setType(FooterTextModalType.Privacy);
                setOpen(true);
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Privacy
              </Typography>
            </Link>

            <Link
              href="/contact"
              color="inherit"
              underline="none"
              onClick={(event) => {
                event.preventDefault();
                setType(FooterTextModalType.About);
                setOpen(true);
              }}
            >
              <Typography variant="body2" color="text.secondary">
                About
              </Typography>
            </Link>
          </Box>
        </Box>

        <FooterTextModal type={type} open={open} setOpen={setOpen} />
      </div>
    </Drawer>
  );
}
