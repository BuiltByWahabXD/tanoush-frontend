// src/routes/privateRoutes.jsx
import ProfilePage from "../pages/ProfilePage";
import WishlistPage from "../pages/WishlistPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminProductFormPage from "../pages/AdminProductFormPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import ProtectedRoute from "../auth/ProtectedRoute";

const privateRoutes = [
  {
    path: "/me",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/wishlist",
    element: (
      <ProtectedRoute>
        <WishlistPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute>
        <AdminProductsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/products/new",
    element: (
      <ProtectedRoute>
        <AdminProductFormPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/products/:id/edit",
    element: (
      <ProtectedRoute>
        <AdminProductFormPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <AdminUsersPage />
      </ProtectedRoute>
    )
  }
];

export default privateRoutes;
