import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Filter sidebar component for product catalog
const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handleCategoryChange = (category) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleBrandChange = (brand) => {
    const current = filters.brands || [];
    const updated = current.includes(brand)
      ? current.filter(b => b !== brand)
      : [...current, brand];
    onFilterChange({ ...filters, brands: updated });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceCommit = (event, newValue) => {
    onFilterChange({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  // Static options - in real app, these would come from API
  const categories = ['Clothing', 'Shoes', 'Accessories', 'Electronics'];
  const brands = ['Nike', 'Adidas', 'Puma', 'Under Armour'];

  return (
    <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: 20 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Filters
        </Typography>
        <Button size="small" onClick={onClearFilters}>
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Category
        </Typography>
        <FormGroup>
          {categories.map(category => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                  size="small"
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Brand Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Brand
        </Typography>
        <FormGroup>
          {brands.map(brand => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => handleBrandChange(brand)}
                  size="small"
                />
              }
              label={brand}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceCommit}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            valueLabelFormat={(value) => `$${value}`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">${priceRange[0]}</Typography>
            <Typography variant="caption">${priceRange[1]}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFilters;
