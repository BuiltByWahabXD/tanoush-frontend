import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../api/api';
import { useThemeContext } from '../context/themeContext';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/wishlist');
      setWishlistItems(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await apiFetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      });
      // Remove from local state
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <>
        <ResponsiveAppBar />
        <Box sx={{ 
          minHeight: '100vh',
          bgcolor: theme === 'dark' ? '#000' : '#fff'
        }}>
          <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000'
      }}>
      <Container sx={{ mt: 12, mb: 6, pt: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, color: theme === 'dark' ? '#fff' : '#000' }}>
          My Wishlist
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {wishlistItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add products you love to your wishlist and view them here
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <ProductCard
                  product={item.product}
                  onRemoveFromWishlist={() => handleRemoveFromWishlist(item.product._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      </Box>
    </>
  );
}
