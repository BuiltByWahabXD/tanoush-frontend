import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";    
import { useAuth } from "../auth/AuthProvider";   

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/users/login", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      console.log("Admin login response:", res);
      
      if (res.success) {
        // Check if user is actually an admin
        if (res.data.role !== 'admin') {
          setError("Access denied. Admin credentials required.");
          setLoading(false);
          return;
        }

        login({
          userId: res.data.userId,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        });
        navigate("/admin/products", { replace: true });
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      const msg = err?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="title">
          <h2>ADMIN LOGIN</h2>
        </div>

        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          textAlign: 'center',
          marginBottom: '16px',
          fontWeight: 'bold'
        }}>
          🔐 ADMIN ACCESS ONLY
        </div>

        <p className="hint">Enter your admin credentials to access the dashboard.</p>

        {error && <div className="error">{error}</div>}

        <div className="field-row">
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email"
            required
          />
        </div>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Admin Password"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
            required
          />
          <span
            className="eye-icon"
            role="button"
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "👁️" : "🫣"}
          </span>
        </div>

        <button className="login_button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>

        <p className="small">
          Don't have an admin account? <Link to="/adminportal">Register</Link>
        </p>
        
        <p className="small">
          <Link to="/login">← Back to User Login</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
