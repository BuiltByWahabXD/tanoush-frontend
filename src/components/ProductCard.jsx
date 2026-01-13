import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/AuthProvider';
import { useThemeContext } from '../context/themeContext';

// Simple product card component for the catalog
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    // Check if product is in wishlist when user is logged in
    if (user) {
      checkWishlistStatus();
    }
  }, [user, product._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await apiFetch(`/api/wishlist/check/${product._id}`);
      setIsInWishlist(response.isInWishlist);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      setOpenLoginDialog(true);
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await apiFetch(`/api/wishlist/${product._id}`, { method: 'DELETE' });
        setIsInWishlist(false);
      } else {
        await apiFetch(`/api/wishlist/${product._id}`, { method: 'POST' });
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLoginRedirect = () => {
    setOpenLoginDialog(false);
    navigate('/login');
  };

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product._id);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%',
          height: '580px',
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          bgcolor: theme === 'dark' ? '#1a1a1a' : '#fff',
          '&:hover': {
            boxShadow: theme === 'dark' ? '0 4px 20px rgba(255,255,255,0.08)' : '0 4px 20px rgba(0,0,0,0.08)'
          }
        }}
      >
        {/* Favorite Icon - Always visible */}
        <IconButton
          onClick={handleWishlistToggle}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: theme === 'dark' ? '#2a2a2a' : 'white',
            border: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'grey.300',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: theme === 'dark' ? '#3a3a3a' : 'white',
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'grey.400'
            },
            zIndex: 2,
            width: 44,
            height: 44
          }}
        >
          {isInWishlist ? (
            <FavoriteIcon sx={{ color: 'error.main', fontSize: 24 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 24, color: theme === 'dark' ? '#fff' : 'inherit' }} />
          )}
        </IconButton>

      <CardActionArea 
        onClick={handleClick} 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%'
        }}
      >
        {/* Fixed Image Container */}
        <Box
          sx={{
            width: '100%',
            height: '300px',
            overflow: 'hidden',
            bgcolor: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
            borderRadius: '12px 12px 0 0',
            flexShrink: 0
          }}
        >
          <CardMedia
            component="img"
            image={product.images?.[0] || '/static/images/placeholder.jpg'}
            alt={product.name}
            sx={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Content Container with Fixed Height */}
        <CardContent 
          sx={{ 
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            p: 2.5,
            height: 210
          }}
        >
          {/* Product Name - Fixed 2 lines */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{
              fontWeight: 600,
              fontSize: '1.125rem',
              mb: 2,
              height: 54,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.5,
              color: theme === 'dark' ? '#fff' : 'text.primary'
            }}
          >
            {product.name}
          </Typography>
          
          {/* Category Chip - Fixed height */}
          <Box sx={{ mb: 2, height: 28 }}>
            <Chip 
              label={product.category} 
              size="small" 
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                borderRadius: 1,
                bgcolor: 'primary.50',
                color: 'primary.main',
                border: '1px solid',
                borderColor: 'primary.main',
                fontSize: '0.8125rem',
                height: 28,
                '& .MuiChip-label': {
                  px: 1.5
                }
              }}
            />
          </Box>
          
          {/* Brand - Fixed height */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 3,
              height: 20,
              textTransform: 'uppercase',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {product.brand}
          </Typography>
          
          {/* Price - Fixed at bottom */}
          <Box sx={{ mt: 'auto', height: 36 }}>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'primary.main',
                lineHeight: 1.5
              }}
            >
              Rs {product.price?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Add to Cart Button - Outside CardActionArea */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.600'
            }
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Box>
    </Card>

    {/* Login Dialog for Guests */}
    <Dialog 
      open={openLoginDialog} 
      onClose={handleCloseDialog}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        Login Required
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Please log in to add items to your wishlist.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleCloseDialog}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleLoginRedirect} 
          variant="contained"
          sx={{ textTransform: 'none' }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
};

export default ProductCard;
