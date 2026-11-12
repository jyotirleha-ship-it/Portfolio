import React from "react";
import { Download, ExternalLink, ArrowRight, Github, Linkedin, ShieldCheck, Sparkles } from "lucide-react";
import TiltCard from "./TiltCard";

export default function HeroSection({ profile, projectsCount = 6, certsCount = 16 }) {
  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Hero Intro */}
          <div className="hero-content">
            <div className="hero-badge-live">
              <span className="pulse-dot"></span>
              <span>Available for Opportunities • Sepolia Active</span>
            </div>

            <h1 className="hero-name">
              THE DIGITAL UNIVERSE <br />
              <span className="hero-gradient-text">Jyotir Leha R</span>
            </h1>

            <div className="hero-subtitle">
              <Sparkles size={18} color="var(--primary)" />
              <span>Full Stack Developer | Blockchain Enthusiast | Software Developer</span>
            </div>

            <p className="hero-desc">
              Building next-generation web applications, resilient smart contracts on Ethereum,
              and enterprise backends. Focused on bringing cryptographic trust, responsive UX,
              and clean system architecture to real-world software.
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary">
                <span>Explore Projects</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={profile?.resumeUrl || "/assets/resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                download
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>

              <a
                href="https://github.com/jyotirleha-ship-it"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                title="GitHub Profile"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/jyotir-leha-r-7971a232a/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                title="LinkedIn Profile"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <span className="stat-value">{projectsCount}+</span>
                <span className="stat-label">Featured Projects</span>
              </div>
              <div className="hero-stat-card">
                <span className="stat-value">{certsCount}+</span>
                <span className="stat-label">Certifications</span>
              </div>
              <div className="hero-stat-card">
                <span className="stat-value">EVM</span>
                <span className="stat-label">Sepolia Verified</span>
              </div>
              <div className="hero-stat-card">
                <span className="stat-value">3rd Yr</span>
                <span className="stat-label">B.E - CSE (2028)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hologram Profile Card */}
          <div className="hero-hologram-card">
            <TiltCard className="hologram-frame">
              <div className="hologram-avatar-wrap">
                <img
                  src={profile?.avatarUrl || "/assets/profile.jpeg"}
                  alt="Jyotir Leha R"
                  className="hologram-avatar-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{
                    display: "none",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0d162d, #14234b)",
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  JL
                </div>
                <div className="hologram-overlay-grid" />
              </div>

              <div className="hologram-meta">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>Jyotir Leha R</h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--primary)" }}>
                    VERIFIED DEV
                  </span>
                </div>
                <p>National Engineering College, Kovilpatti</p>
                <div className="hologram-badge-sepolia">
                  <ShieldCheck size={14} />
                  <span>On-Chain Cryptographic Identity</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
