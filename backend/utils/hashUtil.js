const crypto = require("crypto");

/**
 * Computes canonical SHA-256 content hash of a project.
 * Uses consistent ordering and normalization of fields.
 */
function computeProjectHash(project) {
  const normalized = {
    projectId: (project.projectId || "").trim().toLowerCase(),
    title: (project.title || "").trim(),
    description: (project.description || "").trim(),
    version: (project.version || "1.0.0").trim(),
    technologies: Array.isArray(project.technologies)
      ? [...project.technologies].map(t => t.trim().toLowerCase()).sort()
      : [],
    githubUrl: (project.githubUrl || "").trim()
  };

  const canonicalString = JSON.stringify(normalized);
  const hashHex = crypto.createHash("sha256").update(canonicalString).digest("hex");
  
  // Also provide 0x prefixed bytes32 form for Solidity
  const bytes32 = "0x" + hashHex;

  return {
    canonicalString,
    hashHex,
    bytes32
  };
}

module.exports = {
  computeProjectHash
};
