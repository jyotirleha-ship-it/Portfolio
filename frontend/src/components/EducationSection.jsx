import React from "react";
import { GraduationCap, BookOpen, MapPin } from "lucide-react";
import TiltCard from "./TiltCard";

export default function EducationSection({ education = [] }) {
  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">08 // Academic Foundation</span>
          <h2 className="section-title">Educational Milestones</h2>
          <p className="section-sub">
            Formal engineering foundations in algorithmic theory, database engineering, network security, and computer architectures.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "30px", maxWidth: "980px", margin: "0 auto" }}>
          {education.map((item, idx) => (
            <TiltCard key={item.id || item._id || idx} style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(0, 229, 255, 0.12)",
                    border: "1px solid var(--border-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <GraduationCap size={24} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "var(--text-highlight)",
                    padding: "4px 12px",
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                    borderRadius: "9999px",
                  }}
                >
                  {item.startYear} — {item.endYear}
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", color: "#fff", marginBottom: "6px" }}>
                {item.degree}
              </h3>
              <h4 style={{ fontSize: "1rem", color: "var(--primary)", fontWeight: 500, marginBottom: "12px" }}>
                {item.field}
              </h4>
              <p style={{ color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px" }}>
                {item.institution}
              </p>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} />
                <span>{item.location}</span>
              </p>

              <ul style={{ listStyle: "none", padding: 0 }}>
                {(item.highlights || []).map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    style={{
                      position: "relative",
                      paddingLeft: "20px",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      marginBottom: "6px",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "var(--primary)" }}>▹</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
