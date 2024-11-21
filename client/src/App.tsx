import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Home from './pages/Home/Home';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b00',
    },
    secondary: {
      main: '#333',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Home />
      </Router>
    </ThemeProvider>
  );
}

export default App;
