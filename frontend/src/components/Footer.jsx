import React from "react";
import { ArrowUp, Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="brand-hexagon" style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}>
              JL
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", color: "#fff" }}>Jyotir Leha R</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                THE DIGITAL UNIVERSE • WEB3 PORTFOLIO
              </p>
            </div>
          </div>

          <div className="footer-socials">
            <a
              href="https://github.com/jyotirleha-ship-it"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="GitHub"
            >
              <Github size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/jyotir-leha-r-7971a232a/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>

            <a
              href="mailto:jyotirleha@gmail.com"
              className="icon-btn"
              title="Email"
            >
              <Mail size={16} />
            </a>

            <button
              onClick={scrollToTop}
              className="icon-btn"
              title="Back to Top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "0.82rem",
            color: "var(--text-dim)",
          }}
        >
          <p>© {new Date().getFullYear()} Jyotir Leha R. Engineered with React, Express, MongoDB Atlas & Ethereum Sepolia.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
            <ShieldCheck size={14} />
            <span>PortfolioProjectRegistry v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
