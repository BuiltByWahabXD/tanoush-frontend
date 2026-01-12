import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/themeContext';
import { useAuth } from '../auth/AuthProvider';
import { apiFetch } from '../api/api';
import MaterialUISwitch from './ThemeSwitch';

const settings = ['Profile', 'Logout'];

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElMobileMenu, setAnchorElMobileMenu] = React.useState(null);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Debug logging
  React.useEffect(() => {
    console.log('AppBar Debug:', {
      user,
      isAuthenticated,
      isAdmin,
      userRole: user?.role
    });
  }, [user, isAuthenticated, isAdmin]);

  // Handlers for user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handlers for mobile menu
  const handleOpenMobileMenu = (event) => {
    setAnchorElMobileMenu(event.currentTarget);
  };
  const handleCloseMobileMenu = () => {
    setAnchorElMobileMenu(null);
  };

  // Navigate to a path
  const handleNavigate = (path) => {
    navigate(path);
    handleCloseMobileMenu();
  };

  // Handle user menu actions
  const handleMenuItemClick = async (setting) => {
    handleCloseUserMenu();
    
    if (setting === 'Profile') {
      navigate('/me');
    } else if (setting === 'Logout') {
      try {
        await apiFetch("/api/users/logout", {
          method: "POST",
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        logout();
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{
        background: theme === 'dark' 
          ? '#000' 
          : '#fff',
        borderBottom: theme === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        py: 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 700,
              fontFamily: "'Sekuya', cursive",
              color: theme === 'dark' ? '#fff' : '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              mr: 6,
              display: { xs: 'none', md: 'flex' },
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
            TANOUSH
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenMobileMenu}
              sx={{ color: theme === 'dark' ? '#fff' : '#000' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElMobileMenu}
              open={Boolean(anchorElMobileMenu)}
              onClose={handleCloseMobileMenu}
              disableScrollLock={true}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  border: 'none',
                }
              }}
            >
              {/* User Navigation - Mobile */}
              {!isAdmin && isAuthenticated && (
                <>
                  <MenuItem onClick={() => handleNavigate('/products')}>
                    PRODUCTS
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/wishlist')}>
                    WISHLIST
                  </MenuItem>
                </>
              )}

              {/* Guest Navigation - Mobile */}
              {!isAuthenticated && (
                <MenuItem onClick={() => handleNavigate('/products')}>
                  PRODUCTS
                </MenuItem>
              )}
              
              {/* Admin Navigation - Mobile */}
              {isAdmin && (
                <>
                  <MenuItem onClick={() => handleNavigate('/products')}>
                    PRODUCTS
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/admin/products')}>
                    MANAGE PRODUCTS
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/admin/products/new')}>
                    ADD PRODUCT
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/admin/users')}>
                    MANAGE USERS
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 700,
              fontFamily: "'Sekuya', cursive",
              color: theme === 'dark' ? '#fff' : '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            }}
          >
            TANOUSH
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {/* User Navigation - Desktop (logged in, non-admin) */}
            {!isAdmin && isAuthenticated && (
              <>
                <Button
                  onClick={() => handleNavigate('/products')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  PRODUCTS
                </Button>
                <Button
                  onClick={() => handleNavigate('/wishlist')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  WISHLIST
                </Button>
              </>
            )}

            {/* Guest Navigation - Desktop (not logged in) */}
            {!isAuthenticated && (
              <Button
                onClick={() => handleNavigate('/products')}
                sx={{
                  color: theme === 'dark' ? '#fff' : '#000',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.7,
                  }
                }}
              >
                PRODUCTS
              </Button>
            )}

            {/* Admin Navigation - Desktop */}
            {isAdmin && (
              <>
                <Button
                  onClick={() => handleNavigate('/products')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  PRODUCTS
                </Button>
                <Button
                  onClick={() => handleNavigate('/admin/products')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  MANAGE PRODUCTS
                </Button>
                <Button
                  onClick={() => handleNavigate('/admin/products/new')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  ADD PRODUCT
                </Button>
                <Button
                  onClick={() => handleNavigate('/admin/users')}
                  sx={{
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.7,
                    }
                  }}
                >
                  MANAGE USERS
                </Button>
              </>
            )}
          </Box>

          {/* Right Side - Theme Toggle & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle */}
            <MaterialUISwitch 
              checked={theme === 'dark'} 
              onChange={toggleTheme} 
              sx={{ ml: 1 }}
            />

            {/* User Menu */}
            <Tooltip title="Open settings">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 }}
              >
                {user?.profilePicture ? (
                  <Avatar 
                    alt={user?.name || 'User'} 
                    src={user?.profilePicture}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <PersonOutlineIcon 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      color: theme === 'dark' ? '#fff' : '#000',
                      p: 0.5,
                    }} 
                  />
                )}
              </IconButton>
            </Tooltip>
            {isAuthenticated && (
              <Menu
                disableScrollLock={true}
                sx={{ 
                  mt: '45px',
                  '& .MuiPaper-root': {
                    border: 'none',
                  }
                }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
