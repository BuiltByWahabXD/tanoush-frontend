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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/AuthProvider';

// Simple product card component for the catalog
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

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
      navigate('/login');
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

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      {/* Favorite Icon */}
      {user && (
        <IconButton
          onClick={handleWishlistToggle}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'background.paper',
            },
            zIndex: 1
          }}
        >
          {isInWishlist ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      )}

      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0] || '/static/images/placeholder.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          
          <Chip 
            label={product.category} 
            size="small" 
            sx={{ mb: 1 }}
            color="primary"
            variant="outlined"
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.brand}
          </Typography>
          
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${product.price?.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
