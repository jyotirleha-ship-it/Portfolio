import React, { useState, useEffect } from "react";
import {
  Layers,
  FolderGit2,
  Cpu,
  Trophy,
  Award,
  Mail,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  fetchAnalytics,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  registerProjectOnChain,
  fetchContactMessages,
  markMessageRead,
  deleteMessage,
  fetchVerificationHistory,
} from "../services/api";
import { showToast } from "../components/ToastContainer";

export default function AdminDashboardPage({ onLogout, onBackToHome }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Project Modal State (Add / Edit)
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    projectId: "",
    title: "",
    tagline: "",
    description: "",
    category: "Full Stack",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    version: "1.0.0",
    status: "Completed",
    featured: false,
  });

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes, messagesRes, historyRes] = await Promise.all([
        fetchAnalytics(),
        fetchProjects(),
        fetchContactMessages(),
        fetchVerificationHistory(),
      ]);

      setAnalytics(analyticsRes.data);
      setProjects(projectsRes.data || []);
      setMessages(messagesRes.data || []);
      setHistory(historyRes.data || []);
    } catch (err) {
      showToast(err.message || "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      projectId: "",
      title: "",
      tagline: "",
      description: "",
      category: "Full Stack",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      version: "1.0.0",
      status: "Completed",
      featured: false,
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      projectId: proj.projectId,
      title: proj.title,
      tagline: proj.tagline || "",
      description: proj.description,
      category: proj.category || "Full Stack",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies,
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      version: proj.version || "1.0.0",
      status: proj.status || "Completed",
      featured: Boolean(proj.featured),
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.projectId, projectForm);
        showToast(`Project '${projectForm.title}' updated & SHA-256 recomputed!`, "success");
      } else {
        await createProject(projectForm);
        showToast(`Project '${projectForm.title}' added to database!`, "success");
      }
      setProjectModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      showToast(err.message || "Failed to save project", "error");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm(`Delete project '${projectId}' permanently?`)) return;
    try {
      await deleteProject(projectId);
      showToast("Project deleted", "success");
      loadAllAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRegisterBlockchain = async (projectId) => {
    try {
      showToast("Submitting project hash to Ethereum Sepolia...", "success");
      const res = await registerProjectOnChain(projectId);
      showToast(`Success: Project hash recorded on Sepolia! Tx: ${res.data.txHash.slice(0, 10)}...`, "success");
      loadAllAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleMarkMessageRead = async (id) => {
    try {
      await markMessageRead(id);
      loadAllAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessage(id);
      showToast("Message deleted", "success");
      loadAllAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="admin-page-wrap">
      <div className="container">
        {/* Top Bar */}
        <div className="admin-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={onBackToHome} className="btn btn-ghost btn-sm" style={{ padding: "6px" }}>
                <ArrowLeft size={16} />
              </button>
              <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>Control Center</h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
              Dynamic Content & Blockchain Registry Administrator
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={loadAllAdminData} className="btn btn-outline btn-sm" title="Refresh Data">
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button onClick={onLogout} className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Analytics Top Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Total Projects</span>
            <span className="admin-stat-num">{analytics?.totalProjects || projects.length}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>MongoDB Atlas Active</span>
          </div>

          <div className="admin-stat-card">
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>On-Chain Verified</span>
            <span className="admin-stat-num" style={{ color: "#34d399" }}>
              {analytics?.verifiedProjects || projects.filter((p) => p.onChainRegistered).length}
            </span>
            <span style={{ fontSize: "0.78rem", color: "#34d399" }}>Ethereum Sepolia Registry</span>
          </div>

          <div className="admin-stat-card">
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Unread Messages</span>
            <span className="admin-stat-num" style={{ color: "#38bdf8" }}>
              {analytics?.unreadMessages || messages.filter((m) => !m.read).length}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total: {messages.length}</span>
          </div>

          <div className="admin-stat-card">
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>System Engine</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)", marginTop: "10px" }}>
              {analytics?.dbMode || "MongoDB / Local"}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>SHA-256 + Ethers.js</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            Project Management ({projects.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Contact Inquiries ({messages.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "blockchain" ? "active" : ""}`}
            onClick={() => setActiveTab("blockchain")}
          >
            Blockchain Audit History ({history.length})
          </button>
        </div>

        {/* Tab 1: Project Management */}
        {activeTab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#fff" }}>Portfolio Projects</h3>
              <button onClick={openAddProjectModal} className="btn btn-primary btn-sm">
                <Plus size={16} />
                <span>Add Project</span>
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Version</th>
                    <th>SHA-256 Hash</th>
                    <th>On-Chain Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.projectId || p._id}>
                      <td>
                        <strong style={{ color: "#fff", display: "block" }}>{p.title}</strong>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                          id: {p.projectId}
                        </span>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>v{p.version || "1.0.0"}</span>
                      </td>
                      <td>
                        <code style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {p.contentHash ? `${p.contentHash.slice(0, 10)}...` : "None"}
                        </code>
                      </td>
                      <td>
                        {p.onChainRegistered ? (
                          <span style={{ color: "#34d399", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={14} /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRegisterBlockchain(p.projectId)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                          >
                            <ShieldCheck size={12} /> Record On-Chain
                          </button>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => openEditProjectModal(p)} className="icon-btn" title="Edit Project">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.projectId)}
                            className="icon-btn"
                            style={{ color: "#ef4444" }}
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Messages */}
        {activeTab === "messages" && (
          <div>
            <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "20px" }}>Contact Submissions</h3>
            {messages.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No incoming messages yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.map((m) => (
                  <div
                    key={m.id || m._id}
                    style={{
                      padding: "20px",
                      background: "var(--bg-card)",
                      border: `1px solid ${m.read ? "var(--border-subtle)" : "var(--border-glow)"}`,
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <strong style={{ color: "#fff", fontSize: "1.1rem" }}>{m.name}</strong>
                        <span style={{ color: "var(--text-dim)", marginLeft: "10px", fontSize: "0.85rem" }}>
                          &lt;{m.email}&gt;
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {!m.read && (
                          <button
                            onClick={() => handleMarkMessageRead(m.id || m._id)}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: "0.78rem" }}
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(m.id || m._id)}
                          className="icon-btn"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h5 style={{ color: "var(--primary)", fontSize: "0.95rem", marginBottom: "6px" }}>
                      Subject: {m.subject}
                    </h5>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Blockchain Audit History */}
        {activeTab === "blockchain" && (
          <div>
            <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "20px" }}>On-Chain Verification Ledger</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Network</th>
                    <th>Transaction Hash</th>
                    <th>Recorded Content Hash</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                        No on-chain records logged yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((h, i) => (
                      <tr key={i}>
                        <td style={{ color: "#fff", fontWeight: 600 }}>{h.projectId}</td>
                        <td style={{ fontFamily: "var(--font-mono)", color: "#c084fc" }}>{h.network}</td>
                        <td>
                          <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                            {h.txHash ? `${h.txHash.slice(0, 16)}...` : "Simulated/Pending"}
                          </code>
                        </td>
                        <td>
                          <code style={{ fontSize: "0.75rem" }}>
                            {h.contentHash ? `${h.contentHash.slice(0, 14)}...` : ""}
                          </code>
                        </td>
                        <td>
                          <span style={{ color: "#34d399" }}>{h.status || "Confirmed"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {projectModalOpen && (
        <div className="modal-backdrop" onClick={() => setProjectModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.2rem", color: "#fff" }}>
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button onClick={() => setProjectModalOpen(false)} className="icon-btn" style={{ width: "32px", height: "32px" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label>Project ID (Slug) *</label>
                  <input
                    type="text"
                    value={projectForm.projectId}
                    onChange={(e) => setProjectForm({ ...projectForm, projectId: e.target.value })}
                    className="form-control"
                    placeholder="e.g. smart-contract-lottery"
                    required
                    disabled={!!editingProject}
                  />
                </div>

                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Smart Contract Lottery DApp"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tagline</label>
                  <input
                    type="text"
                    value={projectForm.tagline}
                    onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                    className="form-control"
                    placeholder="Decentralized verifiable random lottery"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Java">Java</option>
                    <option value="Web Development">Web Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="IoT">IoT</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    className="form-control"
                    placeholder="Solidity, React, Ethers.js, Hardhat"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="form-control"
                    placeholder="Detailed overview of what the project does..."
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="form-control"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Live URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="form-control"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Version</label>
                    <input
                      type="text"
                      value={projectForm.version}
                      onChange={(e) => setProjectForm({ ...projectForm, version: e.target.value })}
                      className="form-control"
                      placeholder="1.0.0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="form-control"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    id="featuredProj"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  />
                  <label htmlFor="featuredProj" style={{ color: "#fff", cursor: "pointer", fontSize: "0.9rem" }}>
                    Mark as Featured Project
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setProjectModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
