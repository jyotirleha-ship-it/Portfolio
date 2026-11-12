import React, { useState, useEffect } from "react";
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Copy, Check, Hash, Cpu } from "lucide-react";
import { verifyProjectOnChain } from "../services/api";
import { computeClientProjectHash } from "../services/web3Service";
import { showToast } from "./ToastContainer";

export default function BlockchainVerifierModal({ project, onClose }) {
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [clientHash, setClientHash] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  useEffect(() => {
    if (!project) return;

    async function runVerification() {
      try {
        setLoading(true);
        // Compute client-side deterministic SHA-256 hash
        const clientRes = await computeClientProjectHash(project);
        setClientHash(clientRes.hashHex);

        // Query backend blockchain endpoint
        const serverRes = await verifyProjectOnChain(project.projectId, clientRes.hashHex);
        setVerificationData(serverRes.data);
      } catch (err) {
        showToast(err.message || "On-chain verification error", "error");
      } finally {
        setLoading(false);
      }
    }

    runVerification();
  }, [project]);

  if (!project) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <h3 style={{ fontSize: "1.2rem", color: "#fff" }}>
              Blockchain Project Verification
            </h3>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Cpu className="animate-spin" size={36} color="var(--primary)" style={{ margin: "0 auto 16px auto" }} />
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Computing SHA-256 hash & querying Sepolia Smart Contract...
              </p>
            </div>
          ) : (
            <div>
              {/* Status Header Box */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "var(--radius-md)",
                  background: verificationData?.onChainRegistered
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(245, 158, 11, 0.12)",
                  border: `1px solid ${
                    verificationData?.onChainRegistered ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {verificationData?.onChainRegistered ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <AlertTriangle size={24} color="#f59e0b" />
                )}
                <div>
                  <h4 style={{ fontSize: "1.05rem", color: "#fff" }}>
                    {verificationData?.onChainRegistered ? "On-Chain Record Verified" : "Pending On-Chain Registration"}
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {verificationData?.onChainRegistered
                      ? "Cryptographic content hash matches registered block state on Ethereum Sepolia."
                      : "Project content is ready; awaiting admin testnet registration."}
                  </p>
                </div>
              </div>

              {/* Project Metadata Table */}
              <div className="verifier-card-summary">
                <div className="verifier-row">
                  <span style={{ color: "var(--text-dim)" }}>Project Name</span>
                  <strong style={{ color: "#fff" }}>{project.title}</strong>
                </div>
                <div className="verifier-row">
                  <span style={{ color: "var(--text-dim)" }}>Project Version</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>v{project.version || "1.0.0"}</span>
                </div>
                <div className="verifier-row">
                  <span style={{ color: "var(--text-dim)" }}>Network</span>
                  <span style={{ color: "#c084fc", fontFamily: "var(--font-mono)" }}>
                    {verificationData?.network || "Ethereum Sepolia (ChainID: 11155111)"}
                  </span>
                </div>
                <div className="verifier-row">
                  <span style={{ color: "var(--text-dim)" }}>Content Match Status</span>
                  <span style={{ color: verificationData?.hashMatchesCurrentContent ? "#10b981" : "#ef4444" }}>
                    {verificationData?.hashMatchesCurrentContent ? "100% Deterministic Match" : "Hash Discrepancy"}
                  </span>
                </div>
              </div>

              {/* SHA-256 Hash Display */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    CANONICAL SHA-256 CONTENT HASH:
                  </label>
                  <button
                    onClick={() => copyToClipboard(clientHash, "hash")}
                    style={{ fontSize: "0.78rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    {copiedHash ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                  </button>
                </div>
                <div className="verifier-hash-display">{clientHash}</div>
              </div>

              {/* Transaction Hash */}
              {verificationData?.txHash && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                      TRANSACTION HASH:
                    </label>
                    <button
                      onClick={() => copyToClipboard(verificationData.txHash, "tx")}
                      style={{ fontSize: "0.78rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      {copiedTx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedTx ? "Copied" : "Copy Tx"}</span>
                    </button>
                  </div>
                  <div className="verifier-hash-display">{verificationData.txHash}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {verificationData?.explorerUrl ? (
            <a
              href={verificationData.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ gap: "6px" }}
            >
              <span>View on Sepolia Explorer</span>
              <ExternalLink size={14} />
            </a>
          ) : null}

          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
