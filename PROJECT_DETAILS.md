# 🛍️ Tanoush Clothing - E-Commerce Platform

A modern, full-stack e-commerce web application for clothing retail, built with React and Node.js. Features a beautiful UI with dark mode support, complete shopping cart functionality, wishlist management, and Cloudinary-powered image storage.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.4-purple)
![Material-UI](https://img.shields.io/badge/MUI-7.3.6-007FFF)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Repository](#api-repository)
- [Available Scripts](#available-scripts)
- [Key Features Breakdown](#key-features-breakdown)

## ✨ Features

### 🎨 **User Interface**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Complete theme support across all pages and components
- **Modern UI/UX** - Built with Material-UI for a polished, professional look
- **Smooth Animations** - Framer Motion integration for delightful user interactions

### 🛒 **Shopping Experience**
- **Product Catalog** - Browse through an extensive collection of clothing items
- **Advanced Filtering** - Filter by category, brand, color, size, price, and availability
- **Product Search** - Quick search functionality to find items
- **Sorting Options** - Sort products by price (low to high, high to low)
- **Product Details** - Detailed view with image gallery and product specifications
- **Shopping Cart** - Add/remove items, adjust quantities, view cart total
- **Wishlist** - Save favorite items for later

### 👤 **User Management**
- **Authentication** - Secure login and signup with JWT tokens
- **Protected Routes** - Role-based access control (User/Admin)
- **User Profile** - View and manage account information
- **Order History** - Track previous purchases

### 🖼️ **Media Management**
- **Cloudinary Integration** - Optimized image storage and delivery
- **Image Gallery** - Multiple product images with thumbnail navigation
- **Fast Loading** - Optimized image delivery for better performance

### 📊 **Admin Features**
- Product management (coming soon)
- User management (coming soon)
- Order management (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI) 7.3.6** - Component library
- **React Router DOM 7.10.0** - Client-side routing
- **Axios 1.13.2** - HTTP client
- **Framer Motion 12.23.26** - Animation library
- **JWT Decode 4.0.0** - Token decoding
- **React Hook Form 7.68.0** - Form management

### Backend
See the [Tanoush API Repository](https://github.com/BuiltByWahabXD/tanoush-API) for backend details.

## 📁 Project Structure

```
tanoush-frontend/
├── public/
│   └── static/
│       └── images/           # Static images
├── src/
│   ├── api/
│   │   └── api.js           # API configuration and endpoints
│   ├── auth/
│   │   ├── AuthProvider.jsx # Authentication context provider
│   │   ├── jwtdecode.js     # JWT token utilities
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── components/
│   │   ├── AppBar.jsx       # Navigation bar with theme toggle
│   │   ├── ProductCard.jsx  # Reusable product card component
│   │   └── ...              # Other UI components
│   ├── context/
│   │   └── themeContext.jsx # Theme management context
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── login.jsx    # Login page
│   │   │   └── signup.jsx   # Signup page
│   │   ├── User/
│   │   │   ├── homePage.jsx         # Main shopping page
│   │   │   ├── ProductListingPage.jsx # Product catalog
│   │   │   ├── ProductDetailPage.jsx  # Individual product view
│   │   │   ├── WishlistPage.jsx      # User's wishlist
│   │   │   └── ProfilePage.jsx       # User profile
│   │   └── landingPage.jsx  # Landing/welcome page
│   ├── routes/
│   │   ├── index.jsx        # Main route configuration
│   │   ├── privateRoutes.jsx # Protected routes
│   │   └── publicRoutes.jsx # Public routes
│   ├── styles/              # CSS stylesheets
│   ├── App.jsx              # Root component
│   └── main.jsx             # Application entry point
├── .env                     # Environment variables (create this)
├── package.json
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Backend API running** - See [Tanoush API](https://github.com/BuiltByWahabXD/tanoush-API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BuiltByWahabXD/tanoush-frontend.git
   cd tanoush-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file**
   
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section below)

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🔐 Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3080

# Note: VITE_ prefix is required for Vite to expose the variable to the client
```

### Backend Environment Variables

The backend API requires its own environment variables. Create a `.env` file in the [tanoush-API](https://github.com/BuiltByWahabXD/tanoush-API) repository with:

```env
# Server Configuration
PORT=3080
NODE_ENV=development

# Database
MONGODB_URL=mongodb://localhost:27017/tanoush-clothing
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/tanoush-clothing

# JWT Tokens
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRATION=7d
REFRESH_TOKEN=your_super_secure_refresh_token_secret_here
REFRESH_TOKEN_EXPIRATION=30d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### How to Get Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Add them to your backend `.env` file

### Important Notes

- ⚠️ **Never commit `.env` files to version control**
- 🔒 Keep your JWT secrets long and random (at least 32 characters)
- 🌐 Update `VITE_API_URL` if your backend runs on a different port or domain
- 📦 For production, use environment variables from your hosting provider

## 🔗 API Repository

The backend API for this project is maintained in a separate repository:

**[Tanoush API - Backend Repository](https://github.com/BuiltByWahabXD/tanoush-API)**

### Backend Features
- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Cloudinary integration for image storage
- User, Product, and Order management
- Secure password hashing with bcrypt
- CORS enabled for frontend communication

### API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/signup` | Register new user | ❌ |
| POST | `/api/users/login` | User login | ❌ |
| POST | `/api/users/refresh` | Refresh JWT token | ✅ |
| GET | `/api/users/profile` | Get user profile | ✅ |
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| POST | `/api/wishlist` | Add to wishlist | ✅ |
| GET | `/api/wishlist` | Get user wishlist | ✅ |
| DELETE | `/api/wishlist/:id` | Remove from wishlist | ✅ |

For complete API documentation, please visit the [backend repository](https://github.com/BuiltByWahabXD/tanoush-API).

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🎯 Key Features Breakdown

### Theme System
The application features a comprehensive dark/light mode system:
- Persistent theme preference (stored in localStorage)
- Theme context provider for global state management
- All components are theme-aware with conditional styling
- Smooth transitions between themes

### Authentication Flow
1. User signs up or logs in
2. JWT access token and refresh token are generated
3. Tokens are stored in localStorage
4. Protected routes verify token before allowing access
5. Refresh token automatically renews expired access tokens

### Product Filtering & Search
- **Category Filter**: T-Shirts, Hoodies, Jackets, Jeans, Shorts, Coats
- **Brand Filter**: Multiple brand options
- **Color Filter**: Wide range of colors
- **Size Filter**: XS, S, M, L, XL, XXL
- **Availability Filter**: In Stock / Out of Stock
- **Price Filter**: Custom price range selection
- **Sort Options**: Price Low to High / High to Low

### Responsive Design
- Mobile-first approach
- Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
- Adaptive layouts for all screen sizes
- Touch-friendly interface on mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Abdul Wahab**
- GitHub: [@BuiltByWahabXD](https://github.com/BuiltByWahabXD)

## 🙏 Acknowledgments

- Material-UI for the amazing component library
- Cloudinary for image hosting and optimization
- All contributors and supporters of this project

---

**⭐ If you found this project helpful, please consider giving it a star!**

For backend setup and API documentation, visit: **[Tanoush API Repository](https://github.com/BuiltByWahabXD/tanoush-API)**
