import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PHOTO_URL =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div
        className="login-photo"
        style={{ backgroundImage: `url(${PHOTO_URL})` }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "1rem" }}>
          <Coffee size={26} color="var(--accent)" />
        </div>
        <h1 style={{ fontSize: "2.4rem", margin: "16px 0 4px" }}>Cafe Delight</h1>
        <p style={{ color: "var(--accent)", fontWeight: 600, margin: 0 }}>Good Food | Good Mood</p>
      </div>

      <div className="login-form-side">
        <div className="login-form-inner">
          <p className="eyebrow">Welcome back!</p>
          <h2 style={{ marginTop: 6, marginBottom: 4 }}>Login</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 0 }}>Please login to your account</p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Email</label>
              <div style={{ position: "relative", marginTop: 6 }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email"
                  required
                  style={{ paddingLeft: 36 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Password</label>
              <div style={{ position: "relative", marginTop: 6 }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="password"
                  required
                  style={{ paddingLeft: 36 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.9rem", color: "var(--text-muted)", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up</Link>
          </p>

          <div style={{ marginTop: 22, padding: 14, background: "var(--accent-soft)", borderRadius: 10, fontSize: "0.82rem" }}>
            <strong>Demo admin login:</strong><br />
            admin@cafedemo.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
