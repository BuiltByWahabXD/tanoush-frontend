import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";    
import { useAuth } from "../auth/AuthProvider";   

const LoginPage = () => {
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

      console.log("Login response:", res);
      
      if (res.success) {
        login({
          userId: res.data.userId,
          name: res.data.name,
          email: res.data.email
        });
        navigate("/home", { replace: true });
      }
    } catch (err) {
      const msg = err?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="title">
          <h2>LOGIN</h2>
        </div>

        <p className="hint">Log in to your account to continue.</p>

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

        <button className="login_button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="small">
          Don't have an account? <Link to="/signUp">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
