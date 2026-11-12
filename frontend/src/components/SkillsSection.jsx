import React, { useState } from "react";
import { Terminal, Cpu, Database, Layers, ShieldCheck, Box, Flame } from "lucide-react";

export default function SkillsSection({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(skills[0] || null);

  const categories = [
    "All",
    "Blockchain & Web3",
    "Languages",
    "Frontend",
    "Backend",
    "Database",
    "Tools & DevOps",
    "Domains & Security",
  ];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const currentSelection = selectedSkill || filteredSkills[0] || skills[0];

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">02 // Technical Stack</span>
          <h2 className="section-title">Engineered Capabilities</h2>
          <p className="section-sub">
            Technologies, libraries, and frameworks honed through academic projects, open-source development, and deep exploration.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="skills-categories-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skill-category-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Master Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill) => {
            const isSelected = currentSelection?.name === skill.name;
            return (
              <div
                key={skill.name}
                className={`skill-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="skill-card-head">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent">{skill.proficiency}%</span>
                </div>

                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                <p className="skill-summary-text">{skill.summary}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Hologram Inspection Console */}
        {currentSelection && (
          <div
            style={{
              marginTop: "40px",
              padding: "28px 32px",
              background: "rgba(13, 22, 45, 0.8)",
              border: "1px solid var(--border-glow)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--primary-glow)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Terminal size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.3rem", color: "#fff" }}>
                  {currentSelection.name}
                </h3>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  padding: "4px 12px",
                  background: "rgba(0, 229, 255, 0.1)",
                  borderRadius: "9999px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {currentSelection.category} // {currentSelection.proficiency}% Mastery
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.7 }}>
              {currentSelection.detail || currentSelection.summary}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
