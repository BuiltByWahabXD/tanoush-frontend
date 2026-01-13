import React from 'react';
import { Container, Box, Typography, Paper, Avatar } from '@mui/material';
import { useAuth } from "../auth/AuthProvider";
import { useThemeContext } from '../context/themeContext';
import ResponsiveAppBar from '../components/AppBar';

const ProfilePage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        pt: 12
      }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: theme === 'dark' ? '#1a1a1a' : '#fff',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: 3
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto 24px',
                bgcolor: 'primary.main',
                fontSize: '2.5rem'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </Avatar>
            
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: theme === 'dark' ? '#fff' : '#000'
              }}
            >
              👋 Hello{user?.name ? `, ${user.name}` : ""}!
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
              }}
            >
              You're Currently logged in, Details ⬇️
            </Typography>

            {user && (
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 3, 
                  bgcolor: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
                  borderRadius: 2,
                  textAlign: 'left'
                }}
              >
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                {user.name && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Name:</strong> {user.name}
                  </Typography>
                )}
                {user.role && (
                  <Typography variant="body1">
                    <strong>Role:</strong> {user.role}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage;
