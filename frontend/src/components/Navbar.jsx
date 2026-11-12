import React, { useState, useEffect } from "react";
import { Wallet, Menu, X, Shield, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { connectWeb3Wallet, shortenAddress } from "../services/web3Service";
import { showToast } from "./ToastContainer";

export default function Navbar({ onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      const res = await connectWeb3Wallet();
      setWalletAddress(res.address);
      showToast(`Wallet connected: ${shortenAddress(res.address)}`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setConnecting(false);
    }
  };

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Internships", href: "#internships" },
    { name: "Achievements", href: "#achievements" },
    { name: "Certificates", href: "#certifications" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className={`navbar-wrapper ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-container">
        <a href="#home" className="nav-brand">
          <div className="brand-hexagon">JL</div>
          <span>Jyotir Leha R</span>
        </a>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.name} className="nav-item">
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          {walletAddress ? (
            <div
              className="btn btn-outline btn-sm"
              style={{
                fontFamily: "var(--font-mono)",
                borderColor: "#10b981",
                color: "#34d399",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={15} />
              <span>{shortenAddress(walletAddress)}</span>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={connecting}
              className="btn btn-outline btn-sm"
              title="Connect MetaMask / Web3 Wallet"
            >
              <Wallet size={15} />
              <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="btn btn-ghost btn-sm"
            title="Admin Console"
            style={{ padding: "8px" }}
          >
            <Shield size={16} />
          </button>

          {/* Mobile hamburger button */}
          <button
            className="btn btn-ghost btn-sm mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none" }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "rgba(3, 7, 18, 0.98)",
            padding: "24px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "1.1rem", color: "#f8fafc", fontWeight: 600 }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
