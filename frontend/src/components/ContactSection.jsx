import React, { useState } from "react";
import { Mail, Send, Github, Linkedin, MapPin, CheckCircle2, MessageSquare } from "lucide-react";
import { submitContact } from "../services/api";
import { showToast } from "./ToastContainer";

export default function ContactSection({ profile }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in your name, email, and message", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitContact(formData);
      showToast(res.message || "Message transmitted successfully!", "success");
      setSentSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      showToast(err.message || "Failed to transmit message", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">09 // Digital Transmission</span>
          <h2 className="section-title">Initiate Contact</h2>
          <p className="section-sub">
            Let's connect for software engineering internships, technical collaborations, or Web3 developments.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Info Column */}
          <div>
            <h3 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "16px" }}>
              Reach Out Across the Digital Universe
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "30px" }}>
              Whether you are an engineering hiring manager, recruiter, or fellow developer interested in smart contract verification, my inbox is always open.
            </p>

            <div className="contact-info-list">
              <a href="mailto:jyotirleha@gmail.com" className="contact-card-item">
                <div className="contact-icon-wrap">
                  <Mail size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Direct Email</span>
                  <h4 style={{ fontSize: "1rem", color: "#fff" }}>jyotirleha@gmail.com</h4>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/jyotir-leha-r-7971a232a/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-item"
              >
                <div className="contact-icon-wrap" style={{ background: "rgba(37, 99, 235, 0.15)", color: "#60a5fa" }}>
                  <Linkedin size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Professional Profile</span>
                  <h4 style={{ fontSize: "1rem", color: "#fff" }}>Jyotir Leha R on LinkedIn</h4>
                </div>
              </a>

              <a
                href="https://github.com/jyotirleha-ship-it"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-item"
              >
                <div className="contact-icon-wrap" style={{ background: "rgba(255, 255, 255, 0.08)", color: "#fff" }}>
                  <Github size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Code Repositories</span>
                  <h4 style={{ fontSize: "1rem", color: "#fff" }}>@jyotirleha-ship-it</h4>
                </div>
              </a>

              <div className="contact-card-item">
                <div className="contact-icon-wrap" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#c084fc" }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Location</span>
                  <h4 style={{ fontSize: "1rem", color: "#fff" }}>Thoothukudi & Kovilpatti, Tamil Nadu, India</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-xl)",
              padding: "40px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            {sentSuccess ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: "0 auto 16px auto" }} />
                <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Transmission Confirmed</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                  Thank you! Your message has been safely saved in the database. Jyotir Leha will reply to your email promptly.
                </p>
                <button onClick={() => setSentSuccess(false)} className="btn btn-outline btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Honeypot field (hidden from users) */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Alex Morgan"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. alex@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Internship Opportunity / Project Inquiry"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Share details about the role, project, or question..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  <Send size={16} />
                  <span>{submitting ? "Transmitting..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
