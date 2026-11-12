const { Project, readLocalDb, writeLocalDb, getMongoStatus } = require("../utils/memoryDb");
const { computeProjectHash } = require("../utils/hashUtil");
const crypto = require("crypto");

// @desc Get all projects (public)
// @route GET /api/projects
// @access Public
const getProjects = async (req, res) => {
  try {
    const { category, featured, status } = req.query;

    if (getMongoStatus()) {
      const query = {};
      if (category) query.category = category;
      if (featured !== undefined) query.featured = featured === "true";
      if (status) query.status = status;

      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: projects.length, data: projects });
    } else {
      const local = readLocalDb();
      let list = [...(local.projects || [])];

      if (category) list = list.filter((p) => p.category === category);
      if (featured !== undefined) list = list.filter((p) => String(p.featured) === featured);
      if (status) list = list.filter((p) => p.status === status);

      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single project by projectId
// @route GET /api/projects/:projectId
// @access Public
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (getMongoStatus()) {
      const project = await Project.findOne({ projectId: projectId.toLowerCase() });
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.json({ success: true, data: project });
    } else {
      const local = readLocalDb();
      const project = (local.projects || []).find(
        (p) => p.projectId.toLowerCase() === projectId.toLowerCase() || p.id === projectId || p._id === projectId
      );
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.json({ success: true, data: project });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new project
// @route POST /api/projects
// @access Private (Admin)
const createProject = async (req, res) => {
  try {
    const {
      projectId,
      title,
      tagline,
      description,
      category,
      technologies,
      imageUrl,
      githubUrl,
      liveUrl,
      version = "1.0.0",
      status = "Completed",
      featured = false,
      order = 0,
      completedAt,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const cleanId = (projectId || title.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    // Compute canonical SHA-256 hash
    const hashData = computeProjectHash({
      projectId: cleanId,
      title,
      description,
      version,
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(",").map(t => t.trim()) : []),
      githubUrl,
    });

    const projectData = {
      projectId: cleanId,
      title: title.trim(),
      tagline: tagline || "",
      description: description.trim(),
      category: category || "Full Stack",
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(",").map(t => t.trim()) : []),
      imageUrl: imageUrl || "",
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      version: version.trim(),
      status: status || "Completed",
      featured: Boolean(featured),
      order: Number(order) || 0,
      contentHash: hashData.hashHex,
      onChainRegistered: false,
      txHash: "",
      contractAddress: "",
      blockchainNetwork: "Ethereum Sepolia",
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    };

    if (getMongoStatus()) {
      const existing = await Project.findOne({ projectId: cleanId });
      if (existing) {
        return res.status(400).json({ success: false, message: "Project ID already exists" });
      }
      const newProject = await Project.create(projectData);
      return res.status(201).json({ success: true, data: newProject, contentHash: hashData });
    } else {
      const local = readLocalDb();
      if (!local.projects) local.projects = [];
      const exists = local.projects.some((p) => p.projectId === cleanId);
      if (exists) {
        return res.status(400).json({ success: false, message: "Project ID already exists" });
      }
      const id = "proj_" + crypto.randomBytes(4).toString("hex");
      const record = { _id: id, id, ...projectData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      local.projects.push(record);
      writeLocalDb(local);
      return res.status(201).json({ success: true, data: record, contentHash: hashData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update an existing project
// @route PUT /api/projects/:projectId
// @access Private (Admin)
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    if (updates.technologies && typeof updates.technologies === "string") {
      updates.technologies = updates.technologies.split(",").map((t) => t.trim());
    }

    if (getMongoStatus()) {
      const project = await Project.findOne({ projectId: projectId.toLowerCase() });
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      Object.assign(project, updates);

      // Recompute canonical SHA-256 hash whenever content, version, or links change
      const hashData = computeProjectHash(project);
      project.contentHash = hashData.hashHex;

      const saved = await project.save();
      return res.json({ success: true, data: saved, contentHash: hashData });
    } else {
      const local = readLocalDb();
      const idx = (local.projects || []).findIndex(
        (p) => p.projectId.toLowerCase() === projectId.toLowerCase() || p.id === projectId || p._id === projectId
      );

      if (idx === -1) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      const merged = { ...local.projects[idx], ...updates, updatedAt: new Date().toISOString() };
      const hashData = computeProjectHash(merged);
      merged.contentHash = hashData.hashHex;

      local.projects[idx] = merged;
      writeLocalDb(local);
      return res.json({ success: true, data: merged, contentHash: hashData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a project
// @route DELETE /api/projects/:projectId
// @access Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (getMongoStatus()) {
      const result = await Project.findOneAndDelete({ projectId: projectId.toLowerCase() });
      if (!result) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.json({ success: true, message: "Project deleted successfully" });
    } else {
      const local = readLocalDb();
      const prevCount = (local.projects || []).length;
      local.projects = (local.projects || []).filter(
        (p) => p.projectId.toLowerCase() !== projectId.toLowerCase() && p.id !== projectId && p._id !== projectId
      );
      if (local.projects.length === prevCount) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      writeLocalDb(local);
      return res.json({ success: true, message: "Project deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
