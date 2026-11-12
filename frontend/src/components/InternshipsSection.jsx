import React from "react";
import { Compass, CheckCircle2, Send, Rocket, Sparkles, Terminal } from "lucide-react";
import TiltCard from "./TiltCard";

export default function InternshipsSection() {
  const targetRoles = [
    { title: "Full Stack Developer Intern", tech: "React, Node.js, Express, MongoDB, REST APIs" },
    { title: "Blockchain / Web3 Engineer Intern", tech: "Solidity, Ethereum Sepolia, Hardhat, Ethers.js" },
    { title: "Backend Software Engineer Intern", tech: "Java, Spring Boot, MySQL, Clean Architecture" },
    { title: "Cybersecurity & QA Intern", tech: "Vulnerability Assessment, CTF Exploitation, OWASP" },
  ];

  const valueProps = [
    "Immediate productivity with modern developer workflows (Git, GitHub, Vite, Postman, Linux).",
    "Solid foundation in data structures, algorithms, and DBMS normal forms (Recipient of Database Design Award 2026).",
    "Hands-on experience deploying full-stack architectures and writing verifiable Solidity contracts.",
    "Proactive problem solver, disciplined communication, and continuous learner eager to contribute to collaborative engineering sprints.",
  ];

  return (
    <section className="section" id="internships" style={{ background: "rgba(6, 11, 28, 0.4)" }}>
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">05 // Career Focus</span>
          <h2 className="section-title">Internship Readiness</h2>
          <p className="section-sub">
            Actively seeking internship and co-op opportunities where I can apply my full-stack and blockchain engineering skills to mission-critical products.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", marginBottom: "40px" }}>
          {/* Target Roles Card */}
          <TiltCard style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Compass size={22} color="var(--primary)" />
              <h3 style={{ fontSize: "1.3rem" }}>Target Internship Roles</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {targetRoles.map((role) => (
                <div
                  key={role.title}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(3, 7, 18, 0.6)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                  }}
                >
                  <strong style={{ color: "#fff", display: "block", marginBottom: "4px" }}>
                    {role.title}
                  </strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-highlight)", fontFamily: "var(--font-mono)" }}>
                    {role.tech}
                  </span>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Value Proposition Card */}
          <TiltCard style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Rocket size={22} color="#c084fc" />
              <h3 style={{ fontSize: "1.3rem" }}>What I Bring to Your Team</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {valueProps.map((prop, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{prop}</p>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        {/* Quick CTA Box */}
        <div
          style={{
            textAlign: "center",
            padding: "36px",
            background: "linear-gradient(135deg, rgba(13, 22, 45, 0.9), rgba(6, 11, 28, 0.9))",
            border: "1px solid var(--border-glow)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 0 30px var(--primary-glow)",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
            Evaluating Candidates for an Upcoming Internship?
          </h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 24px auto" }}>
            I am ready to interview and demonstrate live code repositories, architectural diagrams, and smart contracts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="#contact" className="btn btn-primary">
              <Send size={16} />
              <span>Contact for Internship</span>
            </a>
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              download
            >
              <span>Review Resume PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
