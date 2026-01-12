import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/AuthProvider';
import ResponsiveAppBar from '../components/AppBar';

// Product detail page - shows single product information
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check wishlist status when user is logged in
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  const checkWishlistStatus = async () => {
    try {
      const response = await apiFetch(`/api/wishlist/check/${id}`);
      setIsInWishlist(response.isInWishlist);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch(`/api/products/${id}`, { method: 'GET' });
      setProduct(data.product || data);
    } catch (err) {
      setError(err.message || 'Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await apiFetch(`/api/wishlist/${id}`, { method: 'DELETE' });
        setIsInWishlist(false);
      } else {
        await apiFetch(`/api/wishlist/${id}`, { method: 'POST' });
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setError(err.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert('Add to cart functionality - to be implemented');
  };

  const handleBack = () => {
    navigate('/products');
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && product && (
          <Paper elevation={2} sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Product Image */}
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={product.images?.[0] || '/static/images/placeholder.jpg'}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'cover',
                    borderRadius: 2
                  }}
                />
              </Grid>

              {/* Product Info */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={product.category} color="primary" />
                    {product.brand && (
                      <Chip label={product.brand} variant="outlined" />
                    )}
                  </Box>

                  <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                    ${product.price?.toFixed(2)}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {product.description || 'No description available.'}
                  </Typography>

                  {/* Additional Attributes */}
                  {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Specifications
                      </Typography>
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 120 }}>
                            {key}:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Stock Status */}
                  {product.stock !== undefined && (
                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? 'success.main' : 'error.main'}
                      sx={{ mb: 2 }}
                    >
                      {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </Typography>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      sx={{ flexGrow: 1 }}
                    >
                      Add to Cart
                    </Button>
                    
                    {user && (
                      <IconButton
                        color="error"
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        sx={{
                          border: '2px solid',
                          borderColor: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.light',
                          }
                        }}
                      >
                        {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {!loading && !error && !product && (
          <Alert severity="warning">
            Product not found
          </Alert>
        )}
      </Container>
    </>
  );
};

export default ProductDetailPage;
