import React, { useState } from "react";
import { Award, FileText, ExternalLink, ShieldCheck, Download } from "lucide-react";
import TiltCard from "./TiltCard";

export default function CertificationsSection({ certifications = [] }) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Cybersecurity", "Blockchain", "Cloud", "IoT", "Programming", "Academic"];

  const filteredCerts =
    filter === "All"
      ? certifications
      : certifications.filter((c) => c.category === filter);

  return (
    <section className="section" id="certifications">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">07 // Verified Credentials</span>
          <h2 className="section-title">Certifications & Accreditations</h2>
          <p className="section-sub">
            Verified academic, industry, and contest credentials. Click any certificate to open or download the original file.
          </p>
        </div>

        {/* Filter Navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skill-category-tab ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="cert-grid">
          {filteredCerts.map((cert, idx) => (
            <TiltCard key={cert.id || cert._id || idx} className="cert-card">
              <div>
                <div className="cert-head">
                  <div className="cert-icon-box">
                    <Award size={22} />
                  </div>
                  <div className="cert-info">
                    <h4>{cert.title}</h4>
                    <p>{cert.issuer}</p>
                  </div>
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "20px", lineHeight: 1.5 }}>
                  {cert.description}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--primary)",
                    padding: "3px 8px",
                    background: "rgba(0, 229, 255, 0.08)",
                    borderRadius: "4px",
                  }}
                >
                  {cert.category}
                </span>

                {cert.file && (
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ padding: "6px 12px", fontSize: "0.8rem", gap: "6px" }}
                  >
                    <span>View Credential</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
