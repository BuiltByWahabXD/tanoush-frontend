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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check wishlist status when user is logged in
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  useEffect(() => {
    // Set default selections when product loads
    if (product) {
      if (product.attributes?.color?.length > 0) {
        setSelectedColor(product.attributes.color[0]);
      }
      if (product.attributes?.size?.length > 0) {
        setSelectedSize(product.attributes.size[0]);
      }
    }
  }, [product]);

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
      setOpenLoginDialog(true);
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

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLoginRedirect = () => {
    setOpenLoginDialog(false);
    navigate('/login');
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert('Add to cart functionality - to be implemented');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 10 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>

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
            <Grid container spacing={0}>
              {/* Left Side - Image */}
              <Grid item xs={12} md={6} sx={{ bgcolor: 'white', p: 0 }}>
                <Box sx={{ position: 'relative', height: '85vh', minHeight: '500px', maxHeight: '800px' }}>
                  {/* Main Product Image */}
                  <Box
                    component="img"
                    src={product.images?.[selectedImage] || '/static/images/placeholder.jpg'}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Wishlist Heart */}
                  <IconButton
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      right: 24,
                      bgcolor: 'white',
                      width: 56,
                      height: 56,
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {isInWishlist ? (
                      <FavoriteIcon sx={{ color: 'error.main', fontSize: 28 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>

                  {/* Back Button on Image */}
                  <IconButton
                    onClick={handleBack}
                    sx={{
                      position: 'absolute',
                      top: 24,
                      left: 24,
                      bgcolor: 'white',
                      width: 48,
                      height: 48,
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'white'
                      }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>

                  {/* Image Thumbnails/Scroll - Horizontal strip at bottom */}
                  {product.images && product.images.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        p: 2,
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                          height: 6
                        },
                        '&::-webkit-scrollbar-track': {
                          bgcolor: 'rgba(0,0,0,0.1)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                          bgcolor: 'rgba(0,0,0,0.3)',
                          borderRadius: 3
                        }
                      }}
                    >
                      {product.images.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          sx={{
                            minWidth: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '3px solid',
                            borderColor: selectedImage === index ? 'black' : 'transparent',
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderColor: selectedImage === index ? 'black' : 'grey.400',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Right Side - Product Details */}
              <Grid item xs={12} md={6} sx={{ bgcolor: 'white', p: { xs: 3, md: 6 } }}>
                <Box sx={{ maxWidth: 600 }}>
                   {/* Brand Name */}
                  {product.brand && (
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        color: 'text.secondary',
                        letterSpacing: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'block',
                        mb: 1
                      }}
                    >
                      {product.brand}
                    </Typography>
                  )}

                  {/* Product Name */}
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 300,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      mb: 3,
                      fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Price */}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 400,
                      mb: 4,
                      fontSize: '1.5rem'
                    }}
                  >
                    $ {product.price?.toFixed(2)}
                  </Typography>

                  {/* Description */}
                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        fontSize: '0.9rem'
                      }}
                    >
                      {product.description || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.'}
                    </Typography>
                  </Box>

                  {/* Size Dropdown */}
                  {product.attributes?.size && product.attributes.size.length > 0 && (
                    <TextField
                      select
                      fullWidth
                      value={selectedSize || ''}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      label="Size"
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f9f9f9'
                        }
                      }}
                    >
                      {product.attributes.size.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size.toUpperCase()}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  {/* Color Dropdown */}
                  {product.attributes?.color && product.attributes.color.length > 0 && (
                    <TextField
                      select
                      fullWidth
                      value={selectedColor || ''}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      label="Color"
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f9f9f9'
                        }
                      }}
                    >
                      {product.attributes.color.map((color) => (
                        <MenuItem key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  {/* Quantity Selector and Add to Cart */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {/* Quantity Box */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#f9f9f9',
                        px: 2
                      }}
                    >
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{ p: 1 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography 
                        sx={{ 
                          mx: 2, 
                          minWidth: 30, 
                          textAlign: 'center',
                          fontWeight: 500
                        }}
                      >
                        {quantity}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product?.stock || 99)}
                        sx={{ p: 1 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      sx={{ 
                        bgcolor: 'black',
                        color: 'white',
                        py: 1.8,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        '&:hover': {
                          bgcolor: '#333'
                        },
                        '&:disabled': {
                          bgcolor: 'grey.300',
                          color: 'grey.500'
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>

                  {/* Add to Wishlist Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    sx={{ 
                      borderColor: 'divider',
                      color: 'text.primary',
                      py: 1.5,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Add to Wishlist
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {!loading && !error && !product && (
            <Alert severity="warning">
              Product not found
            </Alert>
          )}
        </Container>
      </Box>

      {/* Login Dialog for Guests */}
      <Dialog 
        open={openLoginDialog} 
        onClose={handleCloseLoginDialog}
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
            onClick={handleCloseLoginDialog}
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

export default ProductDetailPage;
