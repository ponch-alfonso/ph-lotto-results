import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Container } from '@mui/material';
import MenuBar from './components/MenuBar';
import MainSideMenu from './components/MainSideMenu/MainSideMenu';

import { initializeDb } from './utils/db-helper';
import { LottoResultsFilter } from './utils/types';
import { LottoResultsPage } from './components/LottoResultsPage';


initializeDb();

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const [filter, setFilter] = React.useState<LottoResultsFilter>({
    ultra: true,
    mega: true,
    super: true,
    lotto: true,
    grand: true,
    lotto6D: true,
    lotto4D: true,
    swertres3D: false,
    swertres2D: false,
  });

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', display: 'flex' }}>
      <CssBaseline />
        <MenuBar
          handleDrawerToggle={handleDrawerToggle}
        />
      <Box
        component="nav"
        sx={{ flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <MainSideMenu
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
          filterState={{filter, setFilter}}
        />
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1  }}
      >
        <Container  
          sx={{
            marginTop: {
              xs: '56px',
              sm: '64px',
            },
            maxWidth: {
              xs: '100%',
              sm: '60%',
            },
            padding: {
              xs: '0',
            },
          }}
        >
          <LottoResultsPage filterState={{filter, setFilter}} />
        </Container>
      </Box>
    </Box>
  );
}
