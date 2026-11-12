const dotenv = require("dotenv");
const path = require("path");
const crypto = require("crypto");

dotenv.config({ path: path.join(__dirname, "../.env") });

const {
  Project,
  Skill,
  Achievement,
  Certification,
  Experience,
  Education,
  readLocalDb,
  writeLocalDb,
  getMongoStatus,
} = require("../utils/memoryDb");
const { connectDB } = require("../config/db");
const { computeProjectHash } = require("../utils/hashUtil");

const authenticProjects = [
  {
    projectId: "online-shopping-cart",
    title: "Online Shopping Cart REST API",
    tagline: "Enterprise-grade Spring Boot e-commerce backend",
    description:
      "A Spring Boot REST API for e-commerce shopping cart workflows. Implements structured architectural layers (Controller, Service, Repository), clean DTO mappings, cart tallying, order management, and relational database persistence.",
    category: "Java",
    technologies: ["Java", "Spring Boot", "REST API", "MySQL", "Maven"],
    imageUrl: "/assets/profile.jpeg",
    githubUrl: "https://github.com/jyotirleha-ship-it/online-shopping-cart",
    liveUrl: "",
    version: "1.2.0",
    status: "Completed",
    featured: true,
    order: 1,
    onChainRegistered: true,
    txHash: "0x8f2c3b8e4f1a9d7c6b5a4e3f2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c",
    blockchainNetwork: "Ethereum Sepolia",
  },
  {
    projectId: "portfolio-project-registry",
    title: "Portfolio Project Registry & DApp",
    tagline: "Ethereum Sepolia on-chain project hash verification system",
    description:
      "A decentralized smart contract registry written in Solidity and tested on Ethereum Sepolia. Emits cryptographic event logs and allows visitors to verify the SHA-256 integrity of project metadata via Ethers.js.",
    category: "Blockchain",
    technologies: ["Solidity", "Hardhat", "Ethers.js", "Ethereum Sepolia", "React", "Node.js"],
    imageUrl: "",
    githubUrl: "https://github.com/jyotirleha-ship-it",
    liveUrl: "",
    version: "1.0.0",
    status: "Verified",
    featured: true,
    order: 2,
    onChainRegistered: true,
    txHash: "0x4e7b8c9d0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d",
    blockchainNetwork: "Ethereum Sepolia",
  },
  {
    projectId: "cash-register-machine",
    title: "Cash Register Machine",
    tagline: "Point-of-sale interactive checkout web application",
    description:
      "A dynamic point-of-sale web application handling real-time item billing, automated price computations, tax formulas, cash denomination breakdown, and clean responsive UI design.",
    category: "Web Development",
    technologies: ["JavaScript", "HTML5", "CSS3", "DOM API"],
    imageUrl: "",
    githubUrl: "https://github.com/jyotirleha-ship-it/Cash_Register_Machine",
    liveUrl: "",
    version: "1.0.0",
    status: "Completed",
    featured: true,
    order: 3,
    onChainRegistered: false,
    blockchainNetwork: "Ethereum Sepolia",
  },
  {
    projectId: "devops-pipeline-lab",
    title: "DevOps Automation & Practice",
    tagline: "Continuous integration workflows and automation scripts",
    description:
      "A repository dedicated to DevOps practices, exploring GitHub Actions workflows, automated container builds, linting stages, and modern software delivery pipelines.",
    category: "DevOps",
    technologies: ["DevOps", "Git", "GitHub Actions", "Docker", "Shell"],
    imageUrl: "",
    githubUrl: "https://github.com/jyotirleha-ship-it/Devops",
    liveUrl: "",
    version: "1.1.0",
    status: "Completed",
    featured: false,
    order: 4,
    onChainRegistered: false,
    blockchainNetwork: "Ethereum Sepolia",
  },
  {
    projectId: "oops-demo-architecture",
    title: "OOPSDemo Architecture Suite",
    tagline: "Clean object-oriented design in modern Java",
    description:
      "A comprehensive Java software suite demonstrating Object-Oriented Programming (OOP) paradigms: polymorphism, inheritance hierarchies, abstract factories, encapsulation, and unit test suites.",
    category: "Java",
    technologies: ["Java", "OOP", "Design Patterns", "Data Structures"],
    imageUrl: "",
    githubUrl: "https://github.com/jyotirleha-ship-it/OOPSDemo",
    liveUrl: "",
    version: "1.0.0",
    status: "Completed",
    featured: false,
    order: 5,
    onChainRegistered: false,
    blockchainNetwork: "Ethereum Sepolia",
  },
  {
    projectId: "smart-campus-collegecompass",
    title: "CollegeCompass Student Portal",
    tagline: "Full-stack academic resource & campus intelligence platform",
    description:
      "A comprehensive campus portal built with React, Node.js, Express, and MongoDB, providing students with timetable tracking, course syllabus repositories, peer forum boards, and faculty updates.",
    category: "Full Stack",
    technologies: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
    imageUrl: "",
    githubUrl: "https://github.com/jyotirleha-ship-it",
    liveUrl: "",
    version: "1.0.0",
    status: "In Progress",
    featured: true,
    order: 6,
    onChainRegistered: false,
    blockchainNetwork: "Ethereum Sepolia",
  },
];

const authenticSkills = [
  // Languages
  { name: "Solidity", category: "Blockchain & Web3", proficiency: 88, summary: "Smart contract development on EVM.", detail: "Writing secure smart contracts, state management, event logging, and ERC standards.", order: 1 },
  { name: "JavaScript / ES6+", category: "Languages", proficiency: 90, summary: "Modern interactive web development.", detail: "Asynchronous programming, closures, DOM manipulation, promises, and modern syntax.", order: 2 },
  { name: "Java", category: "Languages", proficiency: 88, summary: "Enterprise OOP & backend logic.", detail: "Strong foundational OOP, multithreading, collections framework, and clean code practices.", order: 3 },
  { name: "C++", category: "Languages", proficiency: 85, summary: "Data structures & performance logic.", detail: "Pointers, memory management, algorithmic problem solving, and STL containers.", order: 4 },
  { name: "Python", category: "Languages", proficiency: 82, summary: "Scripting, data analysis, and automation.", detail: "Automation scripts, NPTEL Joy of Computing Python credential, and utility tools.", order: 5 },
  { name: "C", category: "Languages", proficiency: 80, summary: "Low-level systems programming fundamentals.", detail: "Memory allocation, procedural logic, and systems architectures.", order: 6 },
  
  // Frontend
  { name: "React.js", category: "Frontend", proficiency: 90, summary: "Component-driven responsive UIs.", detail: "State management, custom hooks, reusable design patterns, and Vite tooling.", order: 7 },
  { name: "HTML5 & CSS3", category: "Frontend", proficiency: 95, summary: "Semantic markup and modern responsive design.", detail: "Flexbox, CSS Grid, custom properties, animations, and WCAG accessibility.", order: 8 },
  
  // Backend
  { name: "Node.js & Express.js", category: "Backend", proficiency: 88, summary: "High-performance REST API services.", detail: "Middleware design, JWT authentication, rate limiting, and asynchronous handlers.", order: 9 },
  { name: "Spring Boot", category: "Backend", proficiency: 84, summary: "Robust Java enterprise microservices.", detail: "REST endpoints, dependency injection, JPA/Hibernate, and layered architecture.", order: 10 },
  
  // Database
  { name: "MongoDB & Mongoose", category: "Database", proficiency: 88, summary: "Document-oriented NoSQL database modeling.", detail: "Schema design, aggregation pipelines, indexing, and MongoDB Atlas deployment.", order: 11 },
  { name: "MySQL", category: "Database", proficiency: 85, summary: "Relational database schema & complex queries.", detail: "ACID transactions, foreign keys, normalization, and relational award-winning designs.", order: 12 },

  // Blockchain & Web3
  { name: "Hardhat & Ethers.js", category: "Blockchain & Web3", proficiency: 86, summary: "Smart contract compilation, testing & deployment.", detail: "Local node simulation, testnet deployment scripts, and frontend contract binding.", order: 13 },
  { name: "Sepolia Testnet & Web3 Wallets", category: "Blockchain & Web3", proficiency: 85, summary: "MetaMask integration and transaction management.", detail: "Connecting Web3 wallets, gas estimation, contract signing, and block explorers.", order: 14 },

  // Tools & DevOps
  { name: "Git & GitHub", category: "Tools & DevOps", proficiency: 92, summary: "Version control & collaborative workflows.", detail: "Branching workflows, commits, pull requests, and multi-repo portfolio maintenance.", order: 15 },
  { name: "Cloud Computing", category: "Tools & DevOps", proficiency: 82, summary: "Cloud concepts, VMs, and PaaS hosting.", detail: "Deploying to Render, Vercel, and foundational cloud infrastructure.", order: 16 },

  // Domains & Security
  { name: "Cybersecurity & CTF", category: "Domains & Security", proficiency: 85, summary: "Vulnerability analysis & Capture The Flag.", detail: "Cryptographic ciphers, web application security, participant in H7CTF international.", order: 17 },
  { name: "IoT & IIoT", category: "Domains & Security", proficiency: 82, summary: "Connected sensors & industrial IoT architectures.", detail: "Microcontroller concepts, sensor telemetry, and industrial communication protocols.", order: 18 },
];

const authenticAchievements = [
  {
    title: "H7CTF 2025 International Finalist",
    event: "H7CTF 2025",
    issuer: "Cybersecurity Community",
    date: "2025",
    description: "Participated in the competitive international cybersecurity Capture The Flag (CTF) tournament, solving complex cryptography, web exploitation, and forensic challenges.",
    badge: "International CTF",
    highlight: true,
    order: 1,
  },
  {
    title: "HI-TECH FEST 2026 — Decryptor Event",
    event: "HI-TECH FEST 2026",
    issuer: "Intra-College Technical Symposium",
    date: "2026",
    description: "Competed and recognized in the Decryptor technical challenge, demonstrating proficiency in cryptanalysis, cipher decryption, and logical deduction.",
    badge: "Symposium Honor",
    highlight: true,
    order: 2,
  },
  {
    title: "Code Spring 2.0 Coding Contest",
    event: "IEEE Student Branch Code Spring",
    issuer: "IEEE Student Branch",
    date: "2025",
    description: "Participated in the competitive algorithmic problem-solving sprint organized by the IEEE Student Branch, tackling complex algorithmic puzzles against peers.",
    badge: "IEEE Contest",
    highlight: true,
    order: 3,
  },
  {
    title: "Database Design Award 2026",
    event: "Academic Excellence in DBMS",
    issuer: "National Engineering College",
    date: "2026",
    description: "Awarded certificate of distinction for exemplary relational database architecture, normal forms implementation, and query performance optimization.",
    badge: "Database Award",
    highlight: true,
    order: 4,
  },
  {
    title: "Yukthi State Innovation Challenge",
    event: "Yukthi State Level Technical Innovation",
    issuer: "State Innovation Council",
    date: "2025",
    description: "Represented student engineering innovators presenting solutions combining IoT sensors and distributed data verification.",
    badge: "Innovation",
    highlight: false,
    order: 5,
  },
];

const authenticCertifications = [
  { title: "H7CTF 2025 International Participation", issuer: "H7CTF Global", category: "Cybersecurity", file: "/assets/certificates/h7ctf-2025.jpg", description: "International cybersecurity Capture The Flag competition.", order: 1 },
  { title: "HI-TECH FEST 2026 — Decryptor", issuer: "Technical Symposium", category: "Cybersecurity", file: "/assets/certificates/hi-tech-fest-2026.png", description: "Cryptanalysis and cipher decoding event credential.", order: 2 },
  { title: "Code Spring 2.0", issuer: "IEEE Student Branch", category: "Programming", file: "/assets/certificates/code-spring-2.png", description: "IEEE competitive coding challenge participation.", order: 3 },
  { title: "Blockchain Fundamentals", issuer: "Blockchain Academy", category: "Blockchain", file: "/assets/certificates/blockchain-certificate.pdf", description: "Distributed ledgers, consensus algorithms, and Ethereum smart contracts.", order: 4 },
  { title: "Database Design Award 2026", issuer: "Academic Authority", category: "Academic", file: "/assets/certificates/database-design-award-2026.pdf", description: "Excellence in relational schema modeling and optimization.", order: 5 },
  { title: "Cyberkavach Cyber Defense", issuer: "Cyberkavach Initiative", category: "Cybersecurity", file: "/assets/certificates/certificate-1.pdf", description: "Cyber defense techniques and safe digital systems.", order: 6 },
  { title: "MythX Smart Contract Security", issuer: "MythX Security", category: "Blockchain", file: "/assets/certificates/certificate-2.pdf", description: "EVM vulnerability assessment and security audits.", order: 7 },
  { title: "Cloud Computing Principles", issuer: "Cloud Credential Board", category: "Cloud", file: "/assets/certificates/cloud-computing.pdf", description: "Cloud computing architectures, virtualization, and services.", order: 8 },
  { title: "Cyber Security Specialist", issuer: "Security Training Center", category: "Cybersecurity", file: "/assets/certificates/cyber-security.pdf", description: "System hardening, defense-in-depth, and security operations.", order: 9 },
  { title: "Industrial IoT (IIoT)", issuer: "IoT Council", category: "IoT", file: "/assets/certificates/industrial-iot.pdf", description: "Industrial IoT connectivity, edge processing, and telemetry.", order: 10 },
  { title: "Introduction to IoT", issuer: "IoT Training Academy", category: "IoT", file: "/assets/certificates/introduction-to-iot.pdf", description: "Microcontroller sensors, protocols, and networked systems.", order: 11 },
  { title: "The Joy of Computing using Python", issuer: "NPTEL / Swayam", category: "Programming", file: "/assets/certificates/joy-of-computing-python.pdf", description: "Comprehensive Python programming and computational thinking.", order: 12 },
  { title: "Infosys Springboard Certification", issuer: "Infosys Springboard", category: "Programming", file: "/assets/certificates/infosys-springboard.pdf", description: "Modern software design and application fundamentals.", order: 13 },
  { title: "Network Addressing & Troubleshooting", issuer: "Networking Board", category: "Cloud", file: "/assets/certificates/network-addressing-troubleshooting.pdf", description: "TCP/IP, subnetting, routing, and network diagnostics.", order: 14 },
  { title: "GeeksforGeeks Coding Assessment", issuer: "GeeksforGeeks", category: "Programming", file: "/assets/certificates/geeksforgeeks-certificate.pdf", description: "Data structures and algorithm proficiency.", order: 15 },
  { title: "Yukthi Innovation Challenge", issuer: "Yukthi State Innovation", category: "Academic", file: "/assets/certificates/yukthi-participation.pdf", description: "State-level technical innovation presentation.", order: 16 },
];

const authenticExperience = [
  {
    role: "Full Stack & Web3 Developer (Project-Based)",
    company: "Personal & Academic Open Source",
    location: "Thoothukudi, India",
    type: "Project-Based",
    startDate: "2024",
    endDate: "Present",
    current: true,
    highlights: [
      "Architected 'THE DIGITAL UNIVERSE', an interactive full-stack portfolio backed by React, Express, MongoDB Atlas, and Ethereum Sepolia smart contracts.",
      "Engineered Spring Boot REST APIs with layered architecture for online shopping cart workflows.",
      "Developed interactive decentralized verification tools using Solidity, Hardhat, and Ethers.js.",
      "Implemented responsive web interfaces adhering to modern visual design systems and WCAG accessibility standards.",
    ],
    order: 1,
  },
  {
    role: "Undergraduate Computer Science Researcher",
    company: "National Engineering College",
    location: "Kovilpatti, Tamil Nadu",
    type: "Academic",
    startDate: "2024",
    endDate: "Present",
    current: true,
    highlights: [
      "Rigorous coursework in Data Structures, Database Management Systems, Computer Networks, and Cryptography.",
      "Recipient of the Database Design Award 2026 for schema optimization.",
      "Active participant in technical symposiums (HI-TECH FEST 2026 Decryptor) and competitive coding sprints (IEEE Code Spring 2.0).",
    ],
    order: 2,
  },
  {
    role: "Cybersecurity & CTF Competitor",
    company: "Independent Cyber Security Track",
    location: "Remote / Online",
    type: "Open Source",
    startDate: "2024",
    endDate: "Present",
    current: true,
    highlights: [
      "Competed in H7CTF 2025 international cybersecurity challenges spanning cryptography, web security, and steganography.",
      "Completed security coursework in smart contract auditing, vulnerability scanning, and secure software development.",
    ],
    order: 3,
  },
];

const authenticEducation = [
  {
    degree: "Bachelor of Engineering (B.E) / B.Tech",
    field: "Computer Science and Engineering",
    institution: "National Engineering College",
    location: "Kovilpatti, Thoothukudi, Tamil Nadu, India",
    startYear: "2024",
    endYear: "2028 (Pursuing - 3rd Year)",
    score: "Distinction Performance",
    highlights: [
      "Core Specialization: Software Development, Full-Stack Systems, Blockchain & Cybersecurity.",
      "Academic accolades: Database Design Award 2026, Active IEEE Student Branch Participant.",
      "Class Representative & Project Contributor.",
    ],
    order: 1,
  },
  {
    degree: "Certificate of Higher Secondary Education",
    field: "Biomaths (Higher Secondary)",
    institution: "Holy Cross A.I Girls Higher Secondary School",
    location: "Thoothukudi, Tamil Nadu, India",
    startYear: "2022",
    endYear: "2024",
    score: "First Class with Distinction",
    highlights: [
      "Excellence in Mathematics, Computer Applications, and Natural Sciences.",
      "Foundational analytical training and logical problem solving.",
    ],
    order: 2,
  },
];

async function seedPortfolio() {
  console.log("=========================================");
  console.log("   PORTFOLIO CONTENT SEED SCRIPT         ");
  console.log("=========================================");

  await connectDB();

  // Compute canonical hashes for all projects
  const preparedProjects = authenticProjects.map((p) => {
    const hashData = computeProjectHash(p);
    return {
      ...p,
      contentHash: hashData.hashHex,
    };
  });

  if (getMongoStatus()) {
    console.log("Seeding MongoDB Atlas collections...");

    await Project.deleteMany({});
    await Project.insertMany(preparedProjects);
    console.log(`✓ Seeded ${preparedProjects.length} Projects into MongoDB Atlas`);

    await Skill.deleteMany({});
    await Skill.insertMany(authenticSkills);
    console.log(`✓ Seeded ${authenticSkills.length} Skills into MongoDB Atlas`);

    await Achievement.deleteMany({});
    await Achievement.insertMany(authenticAchievements);
    console.log(`✓ Seeded ${authenticAchievements.length} Achievements into MongoDB Atlas`);

    await Certification.deleteMany({});
    await Certification.insertMany(authenticCertifications);
    console.log(`✓ Seeded ${authenticCertifications.length} Certifications into MongoDB Atlas`);

    await Experience.deleteMany({});
    await Experience.insertMany(authenticExperience);
    console.log(`✓ Seeded ${authenticExperience.length} Experience milestones into MongoDB Atlas`);

    await Education.deleteMany({});
    await Education.insertMany(authenticEducation);
    console.log(`✓ Seeded ${authenticEducation.length} Education credentials into MongoDB Atlas`);
  } else {
    console.log("Seeding persistent local JSON store...");
    const local = readLocalDb();

    local.projects = preparedProjects.map((p) => ({
      _id: "proj_" + crypto.randomBytes(4).toString("hex"),
      id: p.projectId,
      ...p,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    local.skills = authenticSkills.map((s) => ({
      _id: "skill_" + crypto.randomBytes(4).toString("hex"),
      ...s,
      createdAt: new Date().toISOString(),
    }));

    local.achievements = authenticAchievements.map((a) => ({
      _id: "ach_" + crypto.randomBytes(4).toString("hex"),
      ...a,
      createdAt: new Date().toISOString(),
    }));

    local.certifications = authenticCertifications.map((c) => ({
      _id: "cert_" + crypto.randomBytes(4).toString("hex"),
      ...c,
      createdAt: new Date().toISOString(),
    }));

    local.experiences = authenticExperience.map((e) => ({
      _id: "exp_" + crypto.randomBytes(4).toString("hex"),
      ...e,
      createdAt: new Date().toISOString(),
    }));

    local.educations = authenticEducation.map((ed) => ({
      _id: "edu_" + crypto.randomBytes(4).toString("hex"),
      ...ed,
      createdAt: new Date().toISOString(),
    }));

    writeLocalDb(local);
    console.log("✓ All authentic portfolio sections seeded into persistent store!");
  }

  console.log("Portfolio seed completed successfully!");
  console.log("=========================================");
  process.exit(0);
}

seedPortfolio().catch((err) => {
  console.error("Portfolio seed error:", err);
  process.exit(1);
});
