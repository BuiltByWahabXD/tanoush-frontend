import React from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../styles/landingPage.css";

// Landing page with hero banner - serves as home page
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-Page">
      <ResponsiveAppBar />

      {/* Hero Banner Section */}
      <div className="hero-image" style={{ marginTop: '80px' }}>
        <img src="/static/images/hero-image.jpg" alt="Landing Page Image" />
      </div>

      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Tanoush Clothing
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover our exclusive collection of premium products
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/products")}
            sx={{ mr: 2 }}
          >
            Browse Products
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default LandingPage;