import React, { useState } from "react";
import { Github, ExternalLink, ShieldCheck, Copy, Check, Sparkles, Filter } from "lucide-react";
import TiltCard from "./TiltCard";
import { showToast } from "./ToastContainer";

export default function ProjectsSection({ projects = [], onOpenVerifier }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  const categories = ["All", "Full Stack", "Blockchain", "Java", "Web Development", "DevOps"];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const copyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    showToast("Canonical SHA-256 hash copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">03 // Cryptographically Verified Work</span>
          <h2 className="section-title">Dynamic Project Portfolio</h2>
          <p className="section-sub">
            Real full-stack architectures, Java microservices, and EVM decentralized applications, backed by on-chain SHA-256 integrity registries.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skill-category-tab ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <TiltCard key={project.projectId || project._id} className="project-card">
              <div className="project-top">
                <span className="project-category">{project.category}</span>
                <span
                  className={`project-status-badge ${
                    project.onChainRegistered
                      ? "status-verified"
                      : project.status === "In Progress"
                      ? "status-inprogress"
                      : "status-completed"
                  }`}
                >
                  {project.onChainRegistered ? (
                    <>
                      <ShieldCheck size={13} />
                      <span>On-Chain Verified</span>
                    </>
                  ) : (
                    <span>{project.status || "Completed"}</span>
                  )}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
                <h3 className="project-title">{project.title}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--primary)" }}>
                  v{project.version || "1.0.0"}
                </span>
              </div>

              {project.tagline && (
                <p style={{ color: "var(--text-highlight)", fontSize: "0.85rem", marginBottom: "12px", fontFamily: "var(--font-mono)" }}>
                  // {project.tagline}
                </p>
              )}

              <p className="project-desc">{project.description}</p>

              <div className="project-tech-tags">
                {(project.technologies || []).map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Canonical SHA-256 Content Hash Box */}
              {project.contentHash && (
                <div className="project-hash-box">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>SHA-256 HASH:</span>
                    <code>
                      {project.contentHash.substring(0, 14)}...{project.contentHash.substring(project.contentHash.length - 8)}
                    </code>
                  </div>
                  <button
                    onClick={() => copyHash(project.contentHash, project.projectId)}
                    className="icon-btn"
                    style={{ width: "30px", height: "30px" }}
                    title="Copy full cryptographic hash"
                  >
                    {copiedId === project.projectId ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="project-links-row">
                <button
                  onClick={() => onOpenVerifier(project)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: "6px", fontSize: "0.8rem", padding: "6px 14px" }}
                >
                  <ShieldCheck size={14} color="var(--primary)" />
                  <span>Verify On-Chain</span>
                </button>

                <div className="project-action-icons">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      title="View GitHub Repository"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      title="Open Live Preview"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
