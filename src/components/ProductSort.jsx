import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Sort dropdown component
const ProductSort = ({ sortBy, onSortChange }) => {
  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="sort-select-label">Sort By</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        value={sortBy}
        label="Sort By"
        onChange={handleChange}
      >
        <MenuItem value="name-asc">Name (A-Z)</MenuItem>
        <MenuItem value="name-desc">Name (Z-A)</MenuItem>
        <MenuItem value="price-asc">Price (Low to High)</MenuItem>
        <MenuItem value="price-desc">Price (High to Low)</MenuItem>
        <MenuItem value="newest">Newest First</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ProductSort;
