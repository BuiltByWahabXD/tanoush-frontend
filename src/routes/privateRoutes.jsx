// src/routes/privateRoutes.jsx
import Homepage from "../pages/homePage";
import ProtectedRoute from "../auth/ProtectedRoute";

const privateRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    )
  }
  // Add more protected routes here as your app grows
  // {
  //   path: "/profile",
  //   element: <ProtectedRoute><Profile /></ProtectedRoute>
  // }
];

export default privateRoutes;
