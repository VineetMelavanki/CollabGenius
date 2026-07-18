require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectmongodb = require("../connection/user");
const User = require("../model/User");
const Profile = require("../model/Profile");
const Team = require("../model/Team");
const Work = require("../model/Work");

/**
 * ============================================================
 *  FIELD CONFIG
 * ------------------------------------------------------------
 *  Each key = one CS domain/field.
 *  Everything generated for a user (team name, project name,
 *  skills, description) is pulled from the SAME field's pool
 *  so a team + its project + the owner's skills all stay
 *  consistent with each other.
 *
 *  NOTE: every entry in every `skills` array below has been
 *  checked against the Profile model's enum. Only valid enum
 *  values are used here — this prevents ValidationErrors during
 *  seeding. If you add a new skill to the Profile schema enum,
 *  you can safely add it here too.
 * ============================================================
 */
const FIELD_CONFIG = {
    "AI/ML": {
        teamAdjs: ["Neural", "Cognitive", "DeepMind", "Synaptic", "Vector", "Inference"],
        teamNouns: ["Labs", "Forge", "Collective", "Works", "Studio", "Guild"],
        projectAdjs: ["Smart", "Neural", "Deep", "Predictive", "Autonomous", "Cognitive"],
        projectProducts: [
            "Chatbot", "Recommendation Engine", "Image Classifier",
            "NLP Toolkit", "Model Training Pipeline", "AI Research Assistant",
            "Fraud Detector", "Voice Assistant"
        ],
        skills: ["TensorFlow", "PyTorch", "Scikit-Learn", "Hugging Face", "LangChain", "Jupyter", "Pandas", "NumPy"]
    },
    "Computer Vision": {
        teamAdjs: ["Optic", "Visionary", "Pixel", "Retina", "Lens"],
        teamNouns: ["Labs", "Vision Co", "Systems", "Works", "Collective"],
        projectAdjs: ["Visual", "Real-Time", "Object-Aware", "Optical", "Adaptive"],
        projectProducts: [
            "Face Recognition System", "Object Detector", "OCR Tool",
            "Video Analytics Platform", "Gesture Recognition App", "Defect Inspection Tool"
        ],
        skills: ["OpenCV", "TensorFlow", "PyTorch", "Jupyter"]
    },
    "Natural Language Processing": {
        teamAdjs: ["Semantic", "Lexicon", "Contextual", "Linguo", "Verbal"],
        teamNouns: ["Labs", "AI", "Studio", "Collective", "Works"],
        projectAdjs: ["Conversational", "Semantic", "Contextual", "Multilingual"],
        projectProducts: [
            "Text Summarizer", "Sentiment Analyzer", "Language Translator",
            "Chatbot Framework", "Document Q&A System", "Speech-to-Text Engine"
        ],
        skills: ["LangChain", "Hugging Face", "Jupyter", "Pandas"]
    },
    "Frontend Development": {
        teamAdjs: ["Pixel", "Fluid", "Bright", "Modern", "Crisp"],
        teamNouns: ["Studio", "Interface Co", "Works", "Collective", "Design Guild"],
        projectAdjs: ["Responsive", "Dynamic", "Interactive", "Modern", "Sleek"],
        projectProducts: [
            "Portfolio Site", "Landing Page Builder", "Dashboard UI",
            "Component Library", "Design System", "E-commerce Storefront"
        ],
        skills: ["HTML", "CSS", "Tailwind CSS", "React", "Next.js", "Vue.js", "Angular", "Redux"]
    },
    "Backend Development": {
        teamAdjs: ["Core", "Foundry", "Server-Side", "Robust", "Backbone"],
        teamNouns: ["Systems", "Labs", "Works", "Engineering", "Collective"],
        projectAdjs: ["Scalable", "Robust", "Secure", "Distributed", "High-Performance"],
        projectProducts: [
            "API Gateway", "Auth Service", "Payment Processor",
            "Notification System", "Order Management System", "Rate Limiter"
        ],
        skills: ["Node.js", "Express.js", "Django", "Flask", "Spring Boot", "FastAPI", "MongoDB", "PostgreSQL", "Redis"]
    },
    "Full Stack": {
        teamAdjs: ["Fullstack", "End-to-End", "Unified", "Omni", "Integrated"],
        teamNouns: ["Collective", "Studio", "Labs", "Works", "Guild"],
        projectAdjs: ["Collaborative", "Full-Featured", "Integrated", "Seamless"],
        projectProducts: [
            "Task Manager", "Team Tracker", "Resume Builder",
            "Learning Platform", "Research Hub", "Project Management Tool"
        ],
        skills: ["React", "Node.js", "Express.js", "MongoDB", "Next.js", "PostgreSQL"]
    },
    "Mobile Development": {
        teamAdjs: ["Mobile-First", "Native", "Handheld", "OnTheGo", "Pocket"],
        teamNouns: ["Studio", "Apps Co", "Labs", "Collective", "Works"],
        projectAdjs: ["Cross-Platform", "Native", "Offline-First", "Lightweight"],
        projectProducts: [
            "Fitness Tracker App", "Food Delivery App", "Chat App",
            "Expense Tracker", "Ride Sharing App", "Habit Builder App"
        ],
        skills: ["React Native", "Flutter", "SwiftUI", "Kotlin", "Firebase", "Android Studio"]
    },
    "DevOps": {
        teamAdjs: ["Automated", "Continuous", "Resilient", "Pipeline", "Containerized"],
        teamNouns: ["Ops", "Systems", "Labs", "Collective", "Works"],
        projectAdjs: ["Automated", "Containerized", "Continuous", "Resilient"],
        projectProducts: [
            "CI/CD Pipeline", "Infra Monitoring Tool", "Deployment Orchestrator",
            "Log Aggregator", "Cluster Manager", "Config Management Tool"
        ],
        skills: ["Docker", "Kubernetes", "AWS", "Azure", "Git", "Linux", "Jenkins", "GitHub Actions"]
    },
    "Cybersecurity": {
        teamAdjs: ["Secure", "Zero-Trust", "Cipher", "Sentinel", "Threat-Aware"],
        teamNouns: ["Security Labs", "Defense Co", "Systems", "Collective", "Works"],
        projectAdjs: ["Secure", "Encrypted", "Zero-Trust", "Threat-Aware"],
        projectProducts: [
            "Vulnerability Scanner", "Intrusion Detection System", "Password Manager",
            "Phishing Detector", "Firewall Dashboard", "Security Audit Tool"
        ],
        skills: ["Linux", "Docker", "Git", "AWS", "Kali Linux", "Burp Suite", "Wireshark", "Metasploit"]
    },
    "Blockchain": {
        teamAdjs: ["Decentralized", "OnChain", "Trustless", "Tokenized", "Ledger"],
        teamNouns: ["Labs", "Chain Co", "Collective", "Works", "DAO"],
        projectAdjs: ["Decentralized", "Trustless", "Tokenized", "On-Chain"],
        projectProducts: [
            "NFT Marketplace", "Smart Contract Auditor", "DeFi Dashboard",
            "Crypto Wallet", "DAO Voting Platform", "Token Launchpad"
        ],
        skills: ["Git", "Node.js", "MongoDB", "AWS", "GitHub"]
    },
    "Data Science": {
        teamAdjs: ["Analytical", "Insight", "Statistical", "DataDriven", "Quant"],
        teamNouns: ["Labs", "Analytics Co", "Collective", "Works", "Studio"],
        projectAdjs: ["Predictive", "Statistical", "Insight-Driven", "Analytical"],
        projectProducts: [
            "Sales Forecasting Tool", "Customer Segmentation Dashboard", "A/B Testing Platform",
            "Data Pipeline", "Visualization Studio", "Churn Prediction Model"
        ],
        skills: ["Scikit-Learn", "MongoDB", "PostgreSQL", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Jupyter"]
    },
    "Game Development": {
        teamAdjs: ["Immersive", "Pixel", "Procedural", "Arcade", "NextLevel"],
        teamNouns: ["Studio", "Games Co", "Collective", "Works", "Interactive"],
        projectAdjs: ["Immersive", "Pixel", "Multiplayer", "Procedural"],
        projectProducts: [
            "2D Platformer", "Multiplayer Arena", "Game Engine Plugin",
            "AR Game", "Puzzle Game", "Procedural World Generator"
        ],
        skills: ["Git", "Linux", "Docker"]
    },
    "IoT": {
        teamAdjs: ["Connected", "Embedded", "Sensor-Driven", "SmartGrid", "Ambient"],
        teamNouns: ["Systems", "Labs", "Collective", "Works", "Devices Co"],
        projectAdjs: ["Connected", "Embedded", "Smart", "Sensor-Driven"],
        projectProducts: [
            "Home Automation Hub", "Weather Station", "Smart Irrigation System",
            "Wearable Health Monitor", "Fleet Tracker", "Smart Energy Meter"
        ],
        skills: ["Linux", "Node.js", "AWS", "Azure"]
    },
    "CLI Tools": {
        teamAdjs: ["Terminal", "Command-Line", "Fast", "Minimal", "Scriptable"],
        teamNouns: ["Tools Co", "Labs", "Collective", "Works", "Utilities"],
        projectAdjs: ["Fast", "Minimal", "Cross-Platform", "Developer-Friendly"],
        projectProducts: [
            "File Organizer CLI", "Git Helper Tool", "Log Parser",
            "Task Runner", "Package Scaffolder", "Dotfiles Manager"
        ],
        skills: ["Node.js", "Git", "Linux", "GitHub"]
    },
    "Research": {
        teamAdjs: ["Experimental", "Open", "Academic", "Applied", "Collaborative"],
        teamNouns: ["Research Lab", "Collective", "Institute", "Works", "Group"],
        projectAdjs: ["Experimental", "Open-Source", "Academic", "Collaborative"],
        projectProducts: [
            "Research Paper Repository", "Citation Manager", "Dataset Curator",
            "Peer Review Platform", "Literature Review Tool", "Reproducibility Toolkit"
        ],
        skills: ["Git", "GitHub", "Jupyter"]
    }
};

const FIELD_NAMES = Object.keys(FIELD_CONFIG);

// Helper: build a team title + project title + skills from ONE field
function generateForField(field) {
    const cfg = FIELD_CONFIG[field];

    const teamTitle = `${faker.helpers.arrayElement(cfg.teamAdjs)} ${faker.helpers.arrayElement(cfg.teamNouns)}`;

    const projectName = `${faker.helpers.arrayElement(cfg.projectAdjs)} ${faker.helpers.arrayElement(cfg.projectProducts)}`;

    const skillCount = faker.number.int({ min: 2, max: Math.min(5, cfg.skills.length) });
    const pickedSkills = faker.helpers.arrayElements(cfg.skills, skillCount);

    return { teamTitle, projectName, pickedSkills };
}

async function seedDatabase() {
    await connectmongodb("mongodb://127.0.0.1:27017/CollabGenius");

    console.log("Deleting old data...");
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Team.deleteMany({});
    await Work.deleteMany({});

    console.log("Generating fake users...");
    for (let i = 0; i < 500; i++) {
        // 1. Pick ONE field for this user — everything below stays inside it
        const field = faker.helpers.arrayElement(FIELD_NAMES);
        const { teamTitle, projectName, pickedSkills } = generateForField(field);

        // 2. Create User
        const user = await User.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: "Password@123"
        });

        // 3. Create Profile — skills + domain match the chosen field
        await Profile.create({
            userId: user._id,
            name: user.name,
            Bio: faker.person.bio(),
            skillevel: faker.helpers.arrayElement(["Beginner", "Intermediate", "Advanced"]),
            skills: pickedSkills,
            github_link: `https://github.com/${faker.internet.username()}`,
            domains: [field],
            photo: {
                url: faker.image.avatar(),
                public_id: faker.string.uuid()
            },
            friends: []
        });

        // 4. Create Team — name themed to the field, description mentions field
        const team = await Team.create({
            title: teamTitle,
            description: `${faker.company.catchPhrase()} — focused on ${field}.`,
            ownerId: user._id,
            members: [user._id]
        });

        // 5. Create Work/Project — belongs to same field as the team
        await Work.create({
            name: projectName,
            owner: user._id,
            Team: team._id
        });

        console.log(`Generated User ${i + 1}/500 -> [${field}] Team: "${teamTitle}" | Project: "${projectName}"`);
    }

    console.log("Seeding Completed ✅");
    process.exit();
}

seedDatabase();