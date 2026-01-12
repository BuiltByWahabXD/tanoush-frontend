import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ResponsiveAppBar from '../components/AppBar';
import { apiFetch } from '../api/api';

export default function WishlistPage() {
  const navigate = useNavigate();
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
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
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
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={item.product.images?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleViewProduct(item.product._id)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ fontWeight: 500, cursor: 'pointer' }}
                      onClick={() => handleViewProduct(item.product._id)}
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.product.brand}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mt: 1 }}>
                      ${item.product.price.toFixed(2)}
                    </Typography>
                    {item.product.stock === 0 && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Out of Stock
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleViewProduct(item.product._id)}
                    >
                      View Details
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWishlist(item.product._id)}
                      aria-label="remove from wishlist"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
