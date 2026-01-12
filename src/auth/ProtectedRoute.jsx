// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import ResponsiveAppBar from "../components/AppBar";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ResponsiveAppBar />
      <main style={{ paddingTop: 80, color:"darkorange" }}>
        {children}
      </main>
    </>
  );
}
