// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import AppBar from "../components/AppBar";
import ResponsiveAppBar from "../components/LandingAppBar";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    
    <ResponsiveAppBar />;
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AppBar />
      <main style={{ paddingTop: 16, color:"darkorange" }}>
        {children}
      </main>
    </>
  );
}
