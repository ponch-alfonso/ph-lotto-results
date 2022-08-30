import React from 'react';
import Container from '@mui/material/Container';

import { LottoResultsPage } from './components/LottoResultsPage';
import { MenuBar } from './components/MenuBar';
import { initializeDb } from './db';

import './App.css';

initializeDb();

function App() {
  const [showMinorLottos, setShowMinorLottos] = React.useState(false);

  return (
    <div>
      <div style={{ flexGrow: '1' }}>
        <MenuBar
          showMinorLottos={showMinorLottos}
          setShowMinorLottos={setShowMinorLottos}
        />
        <Container maxWidth="sm">
          <LottoResultsPage showAllLottos={showMinorLottos} />
        </Container>
      </div>
    </div>
  );
}

export default App;
