import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { apiFetch } from '../api/api';
import ProductCard from '../components/ProductCard';
import ResponsiveAppBar from '../components/AppBar';
import '../styles/products.css';

// Main product listing page with filters and search
const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  
  // Dynamic filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });
  const [priceRange, setPriceRange] = useState({
    from: '',
    to: ''
  });
  
  // Available options extracted from products
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  
  // Menu anchors for dropdowns
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [anchorElBrand, setAnchorElBrand] = useState(null);
  const [anchorElColor, setAnchorElColor] = useState(null);
  const [anchorElSize, setAnchorElSize] = useState(null);
  const [anchorElAvailability, setAnchorElAvailability] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);
  const [anchorElSort, setAnchorElSort] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique values when products change
  useEffect(() => {
    if (products.length > 0) {
      extractDynamicFilters();
    }
  }, [products]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, sortBy, selectedCategories, selectedBrands, selectedColors, selectedSizes, availability, priceRange]);

  const extractDynamicFilters = () => {
    // Extract unique categories
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
    setAvailableCategories(categories);

    // Extract unique brands
    const brands = [...new Set(products.map(p => p.brand))].filter(Boolean).sort();
    setAvailableBrands(brands);

    // Extract unique colors from attributes
    const colors = [...new Set(products.flatMap(p => p.attributes?.color || []))].filter(Boolean).sort();
    setAvailableColors(colors);

    // Extract unique sizes from attributes
    const sizes = [...new Set(products.flatMap(p => p.attributes?.size || []))].filter(Boolean);
    // Sort sizes in logical order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
    const sortedSizes = sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a.toUpperCase());
      const indexB = sizeOrder.indexOf(b.toUpperCase());
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    setAvailableSizes(sortedSizes);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params = new URLSearchParams();
      if (sortBy && sortBy !== 'featured') params.append('sortBy', sortBy);
      if (priceRange.from) params.append('minPrice', priceRange.from);
      if (priceRange.to) params.append('maxPrice', priceRange.to);
      
      const queryString = params.toString();
      const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      const data = await apiFetch(endpoint, { method: 'GET' });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter(product => 
        product.attributes?.color?.some(color => selectedColors.includes(color))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(product => 
        product.attributes?.size?.some(size => selectedSizes.includes(size))
      );
    }

    // Availability filter
    const selectedCount = Object.values(availability).filter(Boolean).length;
    if (selectedCount > 0 && selectedCount < 2) {
      if (availability.inStock) {
        result = result.filter(product => product.stock > 0);
      }
      if (availability.outOfStock) {
        result = result.filter(product => product.stock === 0);
      }
    }

    // Price range filter
    const fromPrice = parseFloat(priceRange.from);
    const toPrice = parseFloat(priceRange.to);
    
    if (!isNaN(fromPrice)) {
      result = result.filter(product => product.price >= fromPrice);
    }
    if (!isNaN(toPrice)) {
      result = result.filter(product => product.price <= toPrice);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleAvailabilityChange = (type) => {
    setAvailability(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setAvailability({ inStock: false, outOfStock: false });
    setPriceRange({ from: '', to: '' });
  };

  const getActiveFilterCount = () => {
    return selectedCategories.length + 
           selectedBrands.length + 
           selectedColors.length + 
           selectedSizes.length + 
           Object.values(availability).filter(Boolean).length +
           (priceRange.from || priceRange.to ? 1 : 0);
  };

  const getSelectedAvailabilityCount = () => {
    return Object.values(availability).filter(Boolean).length;
  };

  const resetAvailability = () => {
    setAvailability({
      inStock: false,
      outOfStock: false
    });
  };

  const getHighestPrice = () => {
    if (products.length === 0) return 0;
    return Math.max(...products.map(p => p.price));
  };

  const resetPriceRange = () => {
    setPriceRange({ from: '', to: '' });
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
        {/* Filter and Sort Bar */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          {/* Filter Label */}
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Filter:
          </Typography>

          {/* Category Filter Dropdown */}
          {availableCategories.length > 0 && (
            <Box>
              <Button
                onClick={(e) => setAnchorElCategory(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                  borderBottom: '1px solid',
                  borderColor: selectedCategories.length > 0 ? 'primary.main' : 'text.primary',
                  borderRadius: 0,
                  px: 1,
                  minWidth: 'auto',
                  fontWeight: selectedCategories.length > 0 ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.7
                  }
                }}
              >
                Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </Button>
              <Menu
                anchorEl={anchorElCategory}
                open={Boolean(anchorElCategory)}
                onClose={() => setAnchorElCategory(null)}
                sx={{ '& .MuiPaper-root': { minWidth: 250, mt: 1 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {selectedCategories.length} selected
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setSelectedCategories([])}
                      sx={{ textTransform: 'none', textDecoration: 'underline' }}
                    >
                      Reset
                    </Button>
                  </Box>
                  {availableCategories.map(category => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                      }
                      label={`${category} (${products.filter(p => p.category === category).length})`}
                    />
                  ))}
                </Box>
              </Menu>
            </Box>
          )}

          {/* Brand Filter Dropdown */}
          {availableBrands.length > 0 && (
            <Box>
              <Button
                onClick={(e) => setAnchorElBrand(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                  borderBottom: '1px solid',
                  borderColor: selectedBrands.length > 0 ? 'primary.main' : 'text.primary',
                  borderRadius: 0,
                  px: 1,
                  minWidth: 'auto',
                  fontWeight: selectedBrands.length > 0 ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.7
                  }
                }}
              >
                Brand {selectedBrands.length > 0 && `(${selectedBrands.length})`}
              </Button>
              <Menu
                anchorEl={anchorElBrand}
                open={Boolean(anchorElBrand)}
                onClose={() => setAnchorElBrand(null)}
                sx={{ '& .MuiPaper-root': { minWidth: 250, mt: 1 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {selectedBrands.length} selected
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setSelectedBrands([])}
                      sx={{ textTransform: 'none', textDecoration: 'underline' }}
                    >
                      Reset
                    </Button>
                  </Box>
                  {availableBrands.map(brand => (
                    <FormControlLabel
                      key={brand}
                      control={
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                        />
                      }
                      label={`${brand} (${products.filter(p => p.brand === brand).length})`}
                    />
                  ))}
                </Box>
              </Menu>
            </Box>
          )}

          {/* Color Filter Dropdown */}
          {availableColors.length > 0 && (
            <Box>
              <Button
                onClick={(e) => setAnchorElColor(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                  borderBottom: '1px solid',
                  borderColor: selectedColors.length > 0 ? 'primary.main' : 'text.primary',
                  borderRadius: 0,
                  px: 1,
                  minWidth: 'auto',
                  fontWeight: selectedColors.length > 0 ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.7
                  }
                }}
              >
                Color {selectedColors.length > 0 && `(${selectedColors.length})`}
              </Button>
              <Menu
                anchorEl={anchorElColor}
                open={Boolean(anchorElColor)}
                onClose={() => setAnchorElColor(null)}
                sx={{ '& .MuiPaper-root': { minWidth: 250, mt: 1, maxHeight: 400 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {selectedColors.length} selected
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setSelectedColors([])}
                      sx={{ textTransform: 'none', textDecoration: 'underline' }}
                    >
                      Reset
                    </Button>
                  </Box>
                  {availableColors.map(color => (
                    <FormControlLabel
                      key={color}
                      control={
                        <Checkbox
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                        />
                      }
                      label={`${color} (${products.filter(p => p.attributes?.color?.includes(color)).length})`}
                    />
                  ))}
                </Box>
              </Menu>
            </Box>
          )}

          {/* Size Filter Dropdown */}
          {availableSizes.length > 0 && (
            <Box>
              <Button
                onClick={(e) => setAnchorElSize(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                  borderBottom: '1px solid',
                  borderColor: selectedSizes.length > 0 ? 'primary.main' : 'text.primary',
                  borderRadius: 0,
                  px: 1,
                  minWidth: 'auto',
                  fontWeight: selectedSizes.length > 0 ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.7
                  }
                }}
              >
                Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}
              </Button>
              <Menu
                anchorEl={anchorElSize}
                open={Boolean(anchorElSize)}
                onClose={() => setAnchorElSize(null)}
                sx={{ '& .MuiPaper-root': { minWidth: 250, mt: 1 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {selectedSizes.length} selected
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setSelectedSizes([])}
                      sx={{ textTransform: 'none', textDecoration: 'underline' }}
                    >
                      Reset
                    </Button>
                  </Box>
                  {availableSizes.map(size => (
                    <FormControlLabel
                      key={size}
                      control={
                        <Checkbox
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                      }
                      label={`${size} (${products.filter(p => p.attributes?.size?.includes(size)).length})`}
                    />
                  ))}
                </Box>
              </Menu>
            </Box>
          )}

          {/* Availability Filter Dropdown */}
          <Box>
            <Button
              onClick={(e) => setAnchorElAvailability(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                borderBottom: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 0,
                px: 1,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.7
                }
              }}
            >
              Availability
            </Button>
            <Menu
              anchorEl={anchorElAvailability}
              open={Boolean(anchorElAvailability)}
              onClose={() => setAnchorElAvailability(null)}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: 250,
                  mt: 1
                }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">
                    {getSelectedAvailabilityCount()} selected
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={resetAvailability}
                    sx={{ textTransform: 'none', textDecoration: 'underline' }}
                  >
                    Reset
                  </Button>
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={availability.inStock}
                      onChange={() => handleAvailabilityChange('inStock')}
                    />
                  }
                  label={`In stock (${products.filter(p => p.stock > 0).length})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={availability.outOfStock}
                      onChange={() => handleAvailabilityChange('outOfStock')}
                    />
                  }
                  label={`Out of stock (${products.filter(p => p.stock === 0).length})`}
                />
              </Box>
            </Menu>
          </Box>

          {/* Price Filter Dropdown */}
          <Box>
            <Button
              onClick={(e) => setAnchorElPrice(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                borderBottom: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 0,
                px: 1,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.7
                }
              }}
            >
              Price
            </Button>
            <Menu
              anchorEl={anchorElPrice}
              open={Boolean(anchorElPrice)}
              onClose={() => setAnchorElPrice(null)}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: 400,
                  mt: 1,
                  p: 2
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    The highest price is Rs.{getHighestPrice().toFixed(2)}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={resetPriceRange}
                    sx={{ textTransform: 'none', textDecoration: 'underline' }}
                  >
                    Reset
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Rs</Typography>
                    <TextField
                      size="small"
                      placeholder="From"
                      value={priceRange.from}
                      onChange={(e) => handlePriceChange('from', e.target.value)}
                      type="number"
                      sx={{ width: 130 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Rs</Typography>
                    <TextField
                      size="small"
                      placeholder="To"
                      value={priceRange.to}
                      onChange={(e) => handlePriceChange('to', e.target.value)}
                      type="number"
                      sx={{ width: 130 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Menu>
          </Box>

          {/* Sort Dropdown */}
          <Box>
            <Button
              onClick={(e) => setAnchorElSort(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                borderBottom: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 0,
                px: 1,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.7
                }
              }}
            >
              Sort
            </Button>
            <Menu
              anchorEl={anchorElSort}
              open={Boolean(anchorElSort)}
              onClose={() => setAnchorElSort(null)}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: 200,
                  mt: 1
                }
              }}
            >
              <MenuItem onClick={() => { setSortBy('featured'); setAnchorElSort(null); }}>
                Featured
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('price-asc'); setAnchorElSort(null); }}>
                Price: Low to High
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('price-desc'); setAnchorElSort(null); }}>
                Price: High to Low
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('name-asc'); setAnchorElSort(null); }}>
                Name: A-Z
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('name-desc'); setAnchorElSort(null); }}>
                Name: Z-A
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('newest'); setAnchorElSort(null); }}>
                Newest First
              </MenuItem>
            </Menu>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Clear All Filters */}
          {getActiveFilterCount() > 0 && (
            <Button
              onClick={resetAllFilters}
              sx={{
                textTransform: 'none',
                textDecoration: 'underline',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.7
                }
              }}
            >
              Clear all ({getActiveFilterCount()})
            </Button>
          )}

          {/* Product Count */}
          <Typography variant="body1" color="text.secondary">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Active Filters:
            </Typography>
            {selectedCategories.map(category => (
              <Chip
                key={`cat-${category}`}
                label={`Category: ${category}`}
                onDelete={() => handleCategoryToggle(category)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {selectedBrands.map(brand => (
              <Chip
                key={`brand-${brand}`}
                label={`Brand: ${brand}`}
                onDelete={() => handleBrandToggle(brand)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {selectedColors.map(color => (
              <Chip
                key={`color-${color}`}
                label={`Color: ${color}`}
                onDelete={() => handleColorToggle(color)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {selectedSizes.map(size => (
              <Chip
                key={`size-${size}`}
                label={`Size: ${size}`}
                onDelete={() => handleSizeToggle(size)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {availability.inStock && (
              <Chip
                label="In Stock"
                onDelete={() => handleAvailabilityChange('inStock')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {availability.outOfStock && (
              <Chip
                label="Out of Stock"
                onDelete={() => handleAvailabilityChange('outOfStock')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {(priceRange.from || priceRange.to) && (
              <Chip
                label={`Price: Rs ${priceRange.from || '0'} - Rs ${priceRange.to || '∞'}`}
                onDelete={resetPriceRange}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Products Grid */}
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

        {!loading && !error && filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters
            </Typography>
          </Box>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default ProductListingPage;
