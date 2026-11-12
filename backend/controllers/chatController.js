const { GoogleGenAI } = require("@google/genai");
const {
  Project,
  Skill,
  Achievement,
  Certification,
  Experience,
  Education,
  readLocalDb,
  getMongoStatus,
} = require("../utils/memoryDb");

// Assemble rich portfolio knowledge context dynamically from database
async function getDynamicPortfolioContext() {
  let projects = [];
  let skills = [];
  let achievements = [];
  let certifications = [];
  let experience = [];
  let education = [];

  if (getMongoStatus()) {
    [projects, skills, achievements, certifications, experience, education] =
      await Promise.all([
        Project.find().lean(),
        Skill.find().lean(),
        Achievement.find().lean(),
        Certification.find().lean(),
        Experience.find().lean(),
        Education.find().lean(),
      ]);
  } else {
    const local = readLocalDb();
    projects = local.projects || [];
    skills = local.skills || [];
    achievements = local.achievements || [];
    certifications = local.certifications || [];
    experience = local.experiences || [];
    education = local.educations || [];
  }

  const profile = {
    name: "Jyotir Leha R",
    title: "Full Stack Developer | Blockchain Enthusiast | Software Developer",
    location: "Thoothukudi, Tamil Nadu, India",
    college: "National Engineering College, Kovilpatti (B.E - CSE, Class of 2028)",
    school: "Holy Cross A.I Girls Higher Secondary School, Thoothukudi (Biomaths 2024)",
    email: "jyotirleha@gmail.com",
    github: "https://github.com/jyotirleha-ship-it",
    linkedin: "https://www.linkedin.com/in/jyotir-leha-r-7971a232a/",
    portfolioWeb: "https://jyotirleha-ship-it.github.io/My-Personal-portfolio-/",
  };

  return {
    profile,
    projects: projects.map((p) => ({
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      version: p.version,
      status: p.status,
      contentHash: p.contentHash,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
    })),
    skills: skills.map((s) => ({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      summary: s.summary,
      detail: s.detail,
    })),
    achievements: achievements.map((a) => ({
      title: a.title,
      event: a.event,
      description: a.description,
      badge: a.badge,
    })),
    certifications: certifications.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      category: c.category,
      file: c.file,
    })),
    experience: experience.map((e) => ({
      role: e.role,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      highlights: e.highlights,
    })),
    education: education.map((ed) => ({
      degree: ed.degree,
      field: ed.field,
      institution: ed.institution,
      startYear: ed.startYear,
      endYear: ed.endYear,
    })),
  };
}

// Fallback intelligent responder when Gemini API key is missing or testnet/network is offline
function generateLocalContextualResponse(userMessage, context) {
  const msg = (userMessage || "").toLowerCase();

  if (msg.includes("project") || msg.includes("work") || msg.includes("build")) {
    const list = context.projects
      .map(
        (p) =>
          `• **${p.title}** (${p.technologies.join(", ")}): ${p.description} [GitHub](${p.githubUrl})`
      )
      .join("\n\n");
    return `Here are the key projects created by **${context.profile.name}**:\n\n${list}\n\nAll projects are registered on the Ethereum Sepolia blockchain registry for tamper-proof verification!`;
  }

  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("language")) {
    const categories = {};
    context.skills.forEach((s) => {
      categories[s.category] = categories[s.category] || [];
      categories[s.category].push(s.name);
    });
    const formatted = Object.entries(categories)
      .map(([cat, sk]) => `**${cat}**: ${sk.join(", ")}`)
      .join("\n\n");
    return `**${context.profile.name}**'s Technical Stack:\n\n${formatted}\n\nCore strengths include Solidity & Smart Contracts, Full Stack Development (React, Node.js, Express, MongoDB), Java/Spring Boot, and Cybersecurity.`;
  }

  if (msg.includes("education") || msg.includes("college") || msg.includes("degree") || msg.includes("study")) {
    const edList = context.education
      .map(
        (e) =>
          `• **${e.degree}** (${e.startYear} - ${e.endYear})\n  ${e.institution}`
      )
      .join("\n\n");
    return `Here is **${context.profile.name}**'s Educational Background:\n\n${edList}`;
  }

  if (msg.includes("certificate") || msg.includes("certification") || msg.includes("credential")) {
    const topCerts = context.certifications
      .slice(0, 8)
      .map((c) => `• **${c.title}** (${c.issuer}) [${c.category}]`)
      .join("\n");
    return `**${context.profile.name}** has earned over 20+ technical credentials, including:\n\n${topCerts}\n\nYou can inspect the authentic PDF certificates directly in the Certifications section of this portfolio!`;
  }

  if (msg.includes("achievement") || msg.includes("contest") || msg.includes("award") || msg.includes("ctf")) {
    const achList = context.achievements
      .map((a) => `• **${a.title}** (${a.event}): ${a.description}`)
      .join("\n\n");
    return `Key Achievements & Contests:\n\n${achList}`;
  }

  if (msg.includes("contact") || msg.includes("hire") || msg.includes("email") || msg.includes("reach")) {
    return `You can connect directly with **${context.profile.name}**:\n\n• **Email**: [${context.profile.email}](mailto:${context.profile.email})\n• **LinkedIn**: [Jyotir Leha R on LinkedIn](${context.profile.linkedin})\n• **GitHub**: [github.com/jyotirleha-ship-it](${context.profile.github})\n• **Location**: ${context.profile.location}\n\nOr feel free to send a message using the interactive contact form on this page!`;
  }

  if (msg.includes("internship") || msg.includes("opportunity") || msg.includes("job")) {
    return `**${context.profile.name}** is actively open to **Software Engineering Internships**, **Full Stack Developer Internships**, and **Blockchain/Web3 Developer Roles**. She brings hands-on experience in Solidity smart contract development, REST API design, React frontends, and cyber defense.`;
  }

  if (msg.includes("blockchain") || msg.includes("sepolia") || msg.includes("smart contract") || msg.includes("hash")) {
    return `This portfolio is powered by an Ethereum Sepolia smart contract named **PortfolioProjectRegistry**! Every project registered by Jyotir has a deterministic SHA-256 content hash permanently stored on-chain, allowing visitors to verify project authenticity and inspect the transaction hashes on the Sepolia Etherscan explorer.`;
  }

  return `Hello! I am **Leha AI**, your interactive portfolio assistant for **${context.profile.name}**.\n\nI can answer questions regarding:\n• Her **Education** at National Engineering College\n• Her **Full Stack & Blockchain Projects**\n• Her **Technical Skills & Stack**\n• Her **Cybersecurity & CTF Achievements** (such as H7CTF)\n• Her **Certificates** and **Internship Readiness**\n\nHow can I help you today?`;
}

// @desc AI Portfolio Chatbot Handler
// @route POST /api/chat
// @access Public
const handleChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Please provide a question or message" });
    }

    const context = await getDynamicPortfolioContext();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("YOUR_GEMINI_API_KEY")) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are "Leha AI — Your Portfolio Assistant", an intelligent, futuristic, professional AI assistant for Jyotir Leha R's personal portfolio website "THE DIGITAL UNIVERSE".

Jyotir Leha R Profile:
${JSON.stringify(context, null, 2)}

Instructions:
1. Always be professional, helpful, polite, and articulate.
2. Ground all facts in the provided profile JSON (Jyotir Leha R, B.E Computer Science at National Engineering College, Kovilpatti, Class of 2028, Holy Cross A.I Girls HSS, etc.).
3. Do not invent any awards, certificates, or experiences that are not present.
4. Highlight her expertise in Blockchain (Solidity, Ethers.js, Sepolia), Full Stack development (React, Node.js, Express, MongoDB), Java/Spring Boot, and Cybersecurity.
5. Format responses with clean Markdown, bullet points, and links where relevant.
6. If asked how to contact her or hire her, provide her email (jyotirleha@gmail.com), LinkedIn, and GitHub.
7. Keep answers concise, engaging, and clear.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: message,
          config: {
            systemInstruction,
          },
        });

        const replyText = response.text || "I am Leha AI. How can I assist you with Jyotir's portfolio?";

        return res.json({
          success: true,
          reply: replyText,
          source: "gemini-ai",
        });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local retrieval:", geminiError.message);
        const fallbackReply = generateLocalContextualResponse(message, context);
        return res.json({
          success: true,
          reply: fallbackReply,
          source: "local-retrieval-fallback",
          note: "Answered via verified database knowledge engine.",
        });
      }
    } else {
      // Local knowledge-base retrieval engine
      const reply = generateLocalContextualResponse(message, context);
      return res.json({
        success: true,
        reply,
        source: "local-retrieval",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleChat,
};
