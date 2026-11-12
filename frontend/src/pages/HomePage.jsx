import React, { useState, useEffect } from "react";
import ParticleBackground from "../components/ParticleBackground";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import InternshipsSection from "../components/InternshipsSection";
import AchievementsSection from "../components/AchievementsSection";
import CertificationsSection from "../components/CertificationsSection";
import EducationSection from "../components/EducationSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import BlockchainVerifierModal from "../components/BlockchainVerifierModal";
import ChatbotModal from "../components/ChatbotModal";
import ToastContainer, { showToast } from "../components/ToastContainer";
import { fetchPortfolioBundle } from "../services/api";

export default function HomePage({ onOpenAdmin }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingProject, setVerifyingProject] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const bundle = await fetchPortfolioBundle();
        setData(bundle.data);
      } catch (err) {
        showToast("Error loading portfolio data from backend.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <CustomCursor />
      <ParticleBackground />
      <ToastContainer />

      <Navbar onOpenAdmin={onOpenAdmin} />

      <main>
        <HeroSection
          profile={data?.profile}
          projectsCount={data?.projects?.length || 6}
          certsCount={data?.certifications?.length || 16}
        />
        <AboutSection profile={data?.profile} />
        <SkillsSection skills={data?.skills || []} />
        <ProjectsSection
          projects={data?.projects || []}
          onOpenVerifier={(project) => setVerifyingProject(project)}
        />
        <ExperienceSection experience={data?.experience || []} />
        <InternshipsSection />
        <AchievementsSection achievements={data?.achievements || []} />
        <CertificationsSection certifications={data?.certifications || []} />
        <EducationSection education={data?.education || []} />
        <ContactSection profile={data?.profile} />
      </main>

      <Footer />

      {/* Floating Modals */}
      <ChatbotModal />

      {verifyingProject && (
        <BlockchainVerifierModal
          project={verifyingProject}
          onClose={() => setVerifyingProject(null)}
        />
      )}
    </div>
  );
}
