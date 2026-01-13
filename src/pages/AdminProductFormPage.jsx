import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryIcon from '@mui/icons-material/Category';
import { apiFetch } from '../api/api';
import ResponsiveAppBar from '../components/AppBar';

// Admin form for creating or editing products
const AdminProductFormPage = () => {
  const { id } = useParams(); // If id exists, we're editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
    stock: '',
    color: '',
    size: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch(`/api/products/${id}`, { method: 'GET' });
      const product = data.product || data;
      setFormData({
        name: product.name || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock ?? '',
        color: product.attributes?.color?.join(', ') || '',
        size: product.attributes?.size?.join(', ') || ''
      });
      setUploadedImages(product.images || []);
    } catch (err) {
      setError(err.message || 'Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Check file sizes before upload
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(f => f.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`Some files are too large. Maximum size is 10MB per file.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        console.log(`Uploading ${file.name} (${(file.size / 1024).toFixed(2)} KB)...`);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Upload failed');
        }

        console.log(`Successfully uploaded ${file.name}`);
        return data.imageUrl;
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...newImages]);
      setSuccessMessage(`Successfully uploaded ${newImages.length} image(s)`);
      
      // Reset file input
      e.target.value = '';
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.category || !formData.price || !formData.brand || !formData.description) {
      setError('Please fill in all required fields (Name, Category, Brand, Price, Description)');
      return;
    }

    if (uploadedImages.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0,
        images: uploadedImages,
        attributes: {
          color: formData.color ? formData.color.split(',').map(c => c.trim()).filter(Boolean) : [],
          size: formData.size ? formData.size.split(',').map(s => s.trim()).filter(Boolean) : []
        }
      };

      console.log('Submitting product payload:', payload);

      if (isEditMode) {
        await apiFetch(`/api/products/${id}`, {
          method: 'PUT',
          body: payload
        });
        setSuccessMessage('Product updated successfully!');
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          body: payload
        });
        setSuccessMessage('Product created successfully!');
      }

      console.log('Product saved successfully');
      
      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      console.error('Error saving product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) {
    return (
      <>
        <ResponsiveAppBar />
        <Container maxWidth="md" sx={{ mt: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg" sx={{ mt: 10 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mb: 3, fontWeight: 500 }}
          >
            Back to Products
          </Button>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CategoryIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isEditMode ? 'Update product information' : 'Fill in the details to create a new product'}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: 3 }} />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                
                {/* PRODUCT INFORMATION */}
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Product Information
                  </Typography>
                  <Divider />
                </Box>

                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Cotton T-Shirt"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., TANOUSH"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <FormControl required fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="tees">Tees</MenuItem>
                    <MenuItem value="hoodies">Hoodies</MenuItem>
                    <MenuItem value="graphical-hoodies">Graphical Hoodies</MenuItem>
                    <MenuItem value="basic-hoodies">Basic Hoodies</MenuItem>
                    <MenuItem value="mocknecks">Mocknecks</MenuItem>
                    <MenuItem value="trousers">Trousers</MenuItem>
                    <MenuItem value="shorts">Shorts</MenuItem>
                    <MenuItem value="jeans">Jeans</MenuItem>
                    <MenuItem value="jackets">Jackets</MenuItem>
                    <MenuItem value="coats">Coats</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography fontWeight="600" color="primary">Rs</Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the product..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                {/* IMAGE UPLOAD */}
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Product Images
                  </Typography>
                  <Divider />
                </Box>

                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Button>

                {/* IMAGE PREVIEW */}
                {uploadedImages.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Uploaded Images ({uploadedImages.length})
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      {uploadedImages.map((img, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            border: '2px solid',
                            borderColor: index === 0 ? 'primary.main' : 'divider'
                          }}
                        >
                          {index === 0 && (
                            <Chip
                              label="Primary"
                              size="small"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                zIndex: 2,
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                          <Box
                            component="img"
                            src={img}
                            alt={`Product ${index + 1}`}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: '#fff',
                              '&:hover': { bgcolor: 'error.dark' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ATTRIBUTES */}
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Size & Color Options
                  </Typography>
                  <Divider />
                </Box>

                <TextField
                  fullWidth
                  label="Available Sizes"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL, XXL"
                  helperText="Enter comma-separated size options"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Available Colors"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Black, White, Red, Blue"
                  helperText="Enter comma-separated color names"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                {/* ACTION BUTTONS */}
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 6,
                      fontWeight: 600,
                      minWidth: 150
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving || !formData.name || !formData.brand || !formData.category || !formData.price || !formData.description}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 6,
                      fontWeight: 600,
                      minWidth: 150
                    }}
                  >
                    {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}
                  </Button>
                </Stack>

              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminProductFormPage;
