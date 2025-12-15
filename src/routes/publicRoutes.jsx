// src/routes/publicRoutes.jsx
import Login from "../pages/login";
import Signup from "../pages/signup";
import LandingPage from "../pages/landingPage";
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
    path: "/signup",
    element: <Signup />
  }
];

export default publicRoutes;
