import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useThemeContext } from '../context/themeContext';
import "../styles/landingPage.css";

// Landing page with hero banner - serves as home page
const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const [currentReview, setCurrentReview] = useState(0);
  const scrollContainerRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Sarah Ahmed",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      review: "Amazing quality! The fabric is so soft and the fit is perfect. Will definitely order again."
    },
    {
      id: 2,
      name: "Ali Hassan",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      review: "Best online shopping experience. Fast delivery and excellent customer service. Highly recommended!"
    },
    {
      id: 3,
      name: "Fatima Khan",
      avatar: "https://i.pravatar.cc/150?img=9",
      rating: 4,
      review: "Great collection and reasonable prices. The hoodies are my favorite. Quality exceeded expectations."
    },
    {
      id: 4,
      name: "Omar Sheikh",
      avatar: "https://i.pravatar.cc/150?img=13",
      rating: 5,
      review: "Love the variety! Found exactly what I was looking for. The jeans fit perfectly and look great."
    },
    {
      id: 5,
      name: "Ayesha Malik",
      avatar: "https://i.pravatar.cc/150?img=20",
      rating: 5,
      review: "Impressed with the quality and style. The t-shirts are comfortable and trendy. Will shop again!"
    },
    {
      id: 6,
      name: "Hassan Raza",
      avatar: "https://i.pravatar.cc/150?img=33",
      rating: 4,
      review: "Good products and fair prices. Delivery was quick. The shorts are perfect for summer wear."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.querySelector('.review-card')?.offsetWidth || 350;
        const gap = 24; // 3 * 8px
        const scrollAmount = cardWidth + gap;
        
        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentReview(0);
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          setCurrentReview(prev => (prev + 1) % reviews.length);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="landing-Page">
      <ResponsiveAppBar />

      {/* Hero Banner Section */}
        <Box
          component="img"
          src="/static/images/hero-image.jpg"
          alt="Tanoush Clothing Store"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      
      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: theme === 'dark' ? '#000' : '#fff' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', md: '3rem' },
              color: theme === 'dark' ? '#fff' : 'inherit'
            }}
          >
            About Tanoush
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }} 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Discover premium quality clothing designed for modern lifestyle. 
            From casual tees to elegant coats, we bring you timeless fashion 
            that combines comfort with style. Each piece is carefully curated 
            to ensure the perfect blend of quality and affordability.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                100+
              </Typography>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: theme === 'dark' ? '#fff' : 'inherit' }}>
                Products
              </Typography>
              <Typography variant="body1" sx={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                Wide range of clothing for every occasion
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Premium
              </Typography>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: theme === 'dark' ? '#fff' : 'inherit' }}>
                Quality
              </Typography>
              <Typography variant="body1" sx={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                Only the finest materials and craftsmanship
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Fast
              </Typography>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: theme === 'dark' ? '#fff' : 'inherit' }}>
                Delivery
              </Typography>
              <Typography variant="body1" sx={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                Quick and reliable shipping nationwide
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Collection Showcase */}
      <Box sx={{ bgcolor: theme === 'dark' ? '#0a0a0a' : 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              mb: 6, 
              fontSize: { xs: '2rem', md: '3rem' },
              color: theme === 'dark' ? '#fff' : 'inherit'
            }}
          >
            Our Collections
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3,
              gridAutoRows: '1fr'
            }}
          >
            {/* T-Shirts */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=tees')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
                  alt="T-Shirts Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    T-Shirts
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Casual comfort for everyday
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Hoodies */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=hoodies')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
                  alt="Hoodies Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Hoodies
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Stay warm in style
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Trousers */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=trousers')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"
                  alt="Trousers Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Trousers
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Perfect fit for every occasion
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Shorts */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=shorts')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"
                  alt="Shorts Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Shorts
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Summer essentials
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Coats */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=coats')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"
                  alt="Coats Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Coats & Jackets
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Premium outerwear
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Jeans */}
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                overflow: 'hidden',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate('/products?category=jeans')}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '133.33%',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
                  alt="Jeans Collection"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Jeans
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Classic denim styles
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Customer Reviews Section */}
      <Box sx={{ py: 8, bgcolor: theme === 'dark' ? '#000' : '#fff' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              mb: 2, 
              fontSize: { xs: '2rem', md: '3rem' },
              color: theme === 'dark' ? '#fff' : 'inherit'
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ 
              mb: 6, 
              maxWidth: '600px', 
              mx: 'auto',
              color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
            }}
          >
            Real reviews from real customers who love our products
          </Typography>
          
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              pb: 2
            }}
          >
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="review-card"
                sx={{
                  minWidth: { xs: '280px', sm: '350px' },
                  flex: '0 0 auto',
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'divider',
                  bgcolor: theme === 'dark' ? '#1a1a1a' : '#fff',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <FormatQuoteIcon 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: 40,
                    color: 'primary.main',
                    opacity: 0.2
                  }} 
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={review.avatar} 
                    alt={review.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="600" sx={{ color: theme === 'dark' ? '#fff' : 'inherit' }}>
                      {review.name}
                    </Typography>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    lineHeight: 1.7,
                    fontStyle: 'italic'
                  }}
                >
                  "{review.review}"
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>



      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: theme === 'dark' ? '#0a0a0a' : 'grey.900', 
          color: 'white', 
          py: 6,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                TANOUSH
              </Typography>
              <Typography variant="body2" color="grey.400">
                Premium clothing for the modern wardrobe. Quality, style, and comfort in every piece.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/products')}
                  color="grey.400"
                >
                  Shop All Products
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/login')}
                  color="grey.400"
                >
                  Sign In
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/signup')}
                  color="grey.400"
                >
                  Create Account
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="grey.400">
                Email: info@tanoush.com
              </Typography>
              <Typography variant="body2" color="grey.400">
                Phone: +92 300 1234567
              </Typography>
              <Typography variant="body2" color="grey.400" sx={{ mt: 2 }}>
                © 2026 Tanoush Clothing. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default LandingPage;