// src/routes/publicRoutes.jsx
import Login from "../pages/login";
import AdminLogin from "../pages/AdminLogin";
import Signup from "../pages/signup";
import LandingPage from "../pages/landingPage";
import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailPage from "../pages/ProductDetailPage";

const publicRoutes = [
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/adminlogin",
    element: <AdminLogin />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/adminportal",
    element: <Signup />
  },
  {
    path: "/products",
    element: <ProductListingPage />
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />
  }
];

export default publicRoutes;
