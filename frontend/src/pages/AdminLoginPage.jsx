import React, { useState } from "react";
import { Shield, KeyRound, Mail, ArrowLeft } from "lucide-react";
import { adminLogin } from "../services/api";
import { showToast } from "../components/ToastContainer";

export default function AdminLoginPage({ onLoginSuccess, onBackToHome }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await adminLogin(email, password);
      showToast(`Welcome back, ${res.data.username}!`, "success");
      onLoginSuccess(res.data);
    } catch (err) {
      showToast(err.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="admin-login-box">
        <button
          onClick={onBackToHome}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: "20px", display: "inline-flex", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "#030712",
              boxShadow: "0 0 20px var(--primary-glow)",
            }}
          >
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: "1.7rem", color: "#fff" }}>Admin Authentication</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            The Digital Universe Portfolio Control Center
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                id="adminEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="jyotirleha@admin.universe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <KeyRound size={16} />
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
          }}
        >
          Protected by bcrypt + JWT bearer security. Initialized via npm run seed:admin.
        </div>
      </div>
    </div>
  );
}
