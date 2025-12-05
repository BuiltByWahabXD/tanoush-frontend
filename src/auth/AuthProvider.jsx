// src/auth/AuthProvider.jsx
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { apiFetch } from "../api/api";

export const AuthContext = createContext();

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  // Check if user is authenticated on mount (has valid cookies)
  useEffect(() => {
    // Prevent duplicate calls in StrictMode
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      // Only check auth if localStorage says user was authenticated
      const storedAuth = localStorage.getItem("isAuthenticated");
      
      if (storedAuth !== "true") {
        // User was not authenticated, skip the check
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/refresh`, {
          method: "POST",
          headers: { 
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include",
        });
        
        console.log("Auth check response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Auth check data:", data);
          if (data.success) {

            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            
            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
              method: "GET",
              headers: { 
                "Accept": "application/json",
              },
              credentials: "include",
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.success) {
                setUser(userData.data);
                console.log("User data loaded:", userData.data);
              }
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("isAuthenticated");
          }
        } else {
          // No valid cookies
          console.log("Auth check failed - no valid cookies");
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        // No valid cookies, user needs to login
        console.log("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("isAuthenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
