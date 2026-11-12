import React from "react";
import { Code2, ShieldAlert, Cpu, GraduationCap, MapPin, Award } from "lucide-react";
import TiltCard from "./TiltCard";

export default function AboutSection({ profile }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">01 // Identity & Journey</span>
          <h2 className="section-title">Get to Know Me</h2>
          <p className="section-sub">
            Bridging theoretical computer science with distributed systems, smart contract architectures, and full-stack software.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", marginBottom: "40px" }}>
          <TiltCard style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                <Code2 size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem" }}>Full Stack & Software</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              I'm Jyotir Leha R, an undergraduate Computer Science Engineering student at National Engineering College, Kovilpatti.
              I craft clean web applications using React, Node.js, and Java Spring Boot, connecting intuitive user experiences with structured relational and NoSQL backends.
            </p>
          </TiltCard>

          <TiltCard style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc" }}>
                <ShieldAlert size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem" }}>Blockchain & Cyber Defense</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Deeply intrigued by cryptographic trust and decentralized architectures. I develop EVM smart contracts in Solidity,
              practice smart contract auditing, and actively participate in international Capture The Flag (CTF) security challenges such as H7CTF.
            </p>
          </TiltCard>

          <TiltCard style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: "1.25rem" }}>Cloud, IoT & Future Tech</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Expanding beyond the browser into Industrial IoT, sensor networks, cloud deployments, and automated delivery pipelines.
              Recognized with the Database Design Award 2026 for relational modeling excellence.
            </p>
          </TiltCard>
        </div>

        {/* Profile Details Strip */}
        <div
          style={{
            background: "rgba(13, 22, 45, 0.6)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px 32px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <GraduationCap size={20} color="var(--primary)" />
            <span style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "#fff" }}>Education:</strong> B.E - CSE (Class of 2028), National Engineering College
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <MapPin size={20} color="var(--primary)" />
            <span style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "#fff" }}>Base:</strong> Thoothukudi, Tamil Nadu, India
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Award size={20} color="var(--primary)" />
            <span style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "#fff" }}>Honors:</strong> Database Design Award 2026, Decryptor 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
