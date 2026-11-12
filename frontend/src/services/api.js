const API_BASE = "/api";

function getAuthHeader() {
  const token = localStorage.getItem("leha_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPortfolioBundle() {
  const res = await fetch(`${API_BASE}/portfolio/bundle`);
  if (!res.ok) throw new Error("Failed to load portfolio bundle");
  return res.json();
}

export async function fetchProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/projects${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(projectData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create project");
  return data;
}

export async function updateProject(projectId, updates) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update project");
  return data;
}

export async function deleteProject(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete project");
  return data;
}

export async function submitContact(contactData) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send message");
  return data;
}

export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Chat service error");
  return data;
}

export async function verifyProjectOnChain(projectId, testHash) {
  const res = await fetch(`${API_BASE}/blockchain/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, testHash }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification check failed");
  return data;
}

export async function registerProjectOnChain(projectId) {
  const res = await fetch(`${API_BASE}/blockchain/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ projectId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function fetchVerificationHistory() {
  const res = await fetch(`${API_BASE}/blockchain/history`);
  if (!res.ok) throw new Error("Failed to load verification history");
  return res.json();
}

export async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid credentials");
  if (data.data?.token) {
    localStorage.setItem("leha_admin_token", data.data.token);
  }
  return data;
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/portfolio/analytics`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load analytics");
  return data;
}

export async function fetchContactMessages() {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load messages");
  return data;
}

export async function markMessageRead(id) {
  const res = await fetch(`${API_BASE}/contact/${id}/read`, {
    method: "PATCH",
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  return res.json();
}
