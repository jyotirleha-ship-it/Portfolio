import React from "react";
import { Trophy, Award, Zap, Shield, Star } from "lucide-react";
import TiltCard from "./TiltCard";

export default function AchievementsSection({ achievements = [] }) {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">06 // Competitive Honors</span>
          <h2 className="section-title">Contests & Achievements</h2>
          <p className="section-sub">
            Recognitions in international cybersecurity capture-the-flags, algorithmic coding tournaments, and academic software modeling.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {achievements.map((item, idx) => (
            <TiltCard key={item.id || item._id || idx} style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(0, 229, 255, 0.12)",
                    border: "1px solid var(--border-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <Trophy size={20} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "#f59e0b",
                    padding: "4px 10px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "9999px",
                  }}
                >
                  {item.badge || "Award"}
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "8px" }}>
                {item.title}
              </h3>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--primary)", marginBottom: "12px" }}>
                {item.event} • {item.date}
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {item.description}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
