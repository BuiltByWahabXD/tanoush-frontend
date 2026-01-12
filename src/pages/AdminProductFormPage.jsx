import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditMode ? 'Update product information' : 'Fill in the details to create a new product'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </Grid>

              {/* Category and Brand */}
              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="tees">Tees</MenuItem>
                    <MenuItem value="hoodies">Hoodies</MenuItem>
                    <MenuItem value="graphical-hoodies">Graphical Hoodies</MenuItem>
                    <MenuItem value="basic-hoodies">Basic Hoodies</MenuItem>
                    <MenuItem value="mocknecks">Mocknecks</MenuItem>
                    <MenuItem value="trousers">Trousers</MenuItem>
                    <MenuItem value="shorts">Shorts</MenuItem>
                    <MenuItem value="jackets">Jackets</MenuItem>
                    <MenuItem value="coats">Coats</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., TANOUSH"
                />
              </Grid>

              {/* Price and Stock */}
              <Grid item xs={12} sm={6}>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Product Images
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ mb: 2 }}
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Button>
                
                {uploadedImages.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {uploadedImages.map((imageUrl, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box sx={{ position: 'relative', paddingTop: '100%', border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(255,255,255,0.9)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>

              {/* Attributes */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Colors"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Black, White, Red"
                  helperText="Enter comma-separated colors"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sizes"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  helperText="Enter comma-separated sizes"
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminProductFormPage;
