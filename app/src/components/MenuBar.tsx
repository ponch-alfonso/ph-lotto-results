import React, { FC } from 'react';

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';

interface MenuBardProps {
  showMinorLottos: boolean,
  setShowMinorLottos: (showMinorLottos: boolean) => void,
}


export const MenuBar: FC<MenuBardProps> = ({ showMinorLottos, setShowMinorLottos }) => {
  const [anchorEl, setAnchorEl] = React.useState(null); // TODO: whats this for

  function handleClick(event: any) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  };

  function toggleShowAllLottos(event: any) {
    setShowMinorLottos(event.target.checked);
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <MenuIcon style={{ marginRight: '16px' }} />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            Show all:
            <Switch
              checked={showMinorLottos}
              onChange={toggleShowAllLottos}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </MenuItem>
        </Menu>
        <Typography variant="h6" style={{ flexGrow: '1' }}>
          Daily PCSO Results
        </Typography>
      </Toolbar>
    </AppBar>
  )
}