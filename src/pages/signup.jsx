import React, { useState } from "react";
import "../styles/Signup.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/api";       
import { useAuth } from "../auth/AuthProvider";   

const SignupPage = () => {
  const location = useLocation();
  const isAdminSignup = location.pathname === '/adminportal';
  
  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.email.trim() || !formData.name.trim() || !formData.password) {
      setError("Please fill all fields.");
      return false;
    }
    // simple email check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // Add role field if it's admin signup
      if (isAdminSignup) {
        payload.role = 'admin';
      }

      const res = await apiFetch("/api/users/signup", {
        method: "POST",
        body: payload,
      });

      navigate("/login", { replace: true });
      
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <div className="title">
          <h2>{isAdminSignup ? 'ADMIN SIGNUP' : 'SIGNUP'}</h2>
        </div>

        <p className="hint">
          {isAdminSignup 
            ? 'Create your admin account with full management privileges.' 
            : 'Create your account — it only takes a minute.'}
        </p>

        {isAdminSignup && (
          <div className="admin-badge" style={{
            background: '#ff4444',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: 'bold'
          }}>
            🔐 ADMIN REGISTRATION
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <div className="field-row">
          <input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email"
            required
          />
        </div>

        <div className="field-row">
          <input
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            aria-label="Name"
            required
          />
        </div>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Your Password"
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

        <button className="signup_button" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="small">
          Already have an account? <Link to={isAdminSignup ? "/adminlogin" : "/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
