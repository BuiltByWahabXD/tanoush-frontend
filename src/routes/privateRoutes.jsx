// src/routes/privateRoutes.jsx
import { Navigate } from "react-router-dom";
import Homepage from "../pages/homePage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../auth/ProtectedRoute";

const privateRoutes = [
  {
    path: "/",
    element: <Navigate to="/home" replace />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    )
  },
  {
    path: "/me",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  }
];

export default privateRoutes;
