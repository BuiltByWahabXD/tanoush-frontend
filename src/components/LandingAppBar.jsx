import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/themeContext';
import MaterialUISwitch from './ThemeSwitch';
import Fab from '@mui/material/Fab';

export default function LandingAppBar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{
        background: theme === 'dark' 
          ? 'rgba(30, 30, 30, 0.7)' 
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '40px',
        border: theme === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: theme === 'dark'
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        top: 25,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75%',
        zIndex: 1000,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>

          {/* LOGO */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 700,
              fontFamily: "'Sekuya', cursive",
              color: '#A52A2A',
              textDecoration: 'none',
              flexGrow: 1,
              cursor: 'pointer',
              '&:hover': {
                wordSpacing: '0.3rem',
                color:"#A52A2A"
              }
            }}
          >
            NERVE
          </Typography>

          {/* THEME TOGGLE */}
          <Box sx={{ mr: 2 }}>
            <MaterialUISwitch 
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
          </Box>

          {/* LOGIN BUTTON */}
          <Button 
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#A52A2A',
              fontFamily: "'Sekuya', cursive",
              color: 'white',
              fontWeight: 100,
              borderRadius: '20px',
              px: 3,
              py: 0.7,
              '&:hover': {
                backgroundColor: '#A52A2A',
                color: '#ffd54a',
                opacity: 0.9,
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
