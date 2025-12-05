// src/routes/publicRoutes.jsx
import Login from "../pages/login";
import Signup from "../pages/signup";

const publicRoutes = [
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
