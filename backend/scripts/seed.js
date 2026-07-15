require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectmongodb=require("../connection/user");
const User = require("../model/User");
const Profile = require("../model/Profile");
const Project=require("../model/project");
const Work=require("../model/Work");

const adjectives = [
    "AI",
    "Smart",
    "Cloud",
    "Secure",
    "NextGen",
    "Quantum",
    "Collaborative"
];

const products = [
    "Task Manager",
    "Chatbot",
    "Learning Platform",
    "Resume Builder",
    "Research Hub",
    "Code Analyzer",
    "Project Tracker"
];
// Skills
const skills = [
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Redux",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "FastAPI",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "Firebase",
    "Supabase",
    "TensorFlow",
    "PyTorch",
    "Scikit-Learn",
    "OpenCV",
    "LangChain",
    "Hugging Face",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Git",
    "GitHub",
    "Linux"
];

// Domains
const domains = [
    "CLI Tools",
    "Web Frameworks",
    "Mobile Development",
    "AI/ML",
    "Backend Development",
    "Frontend Development",
    "DevOps",
    "Blockchain",
    "Data Science",
    "Cybersecurity",
    "Research",
    "Game Development",
    "IoT",
    "Computer Vision",
    "Natural Language Processing",
    "Full Stack"
];

async function seedDatabase() {

    
    await connectmongodb("mongodb://127.0.0.1:27017/CollabGenius");

    console.log("Deleting old data...");

    await User.deleteMany({});
    await Profile.deleteMany({});

    console.log("Generating fake users...");

    for (let i = 0; i < 500; i++) {

        // Create User
        const user = await User.create({

            name: faker.person.fullName(),

            email: faker.internet.email(),

            password: "Password@123"

        });

        // Create Profile
        await Profile.create({

            userId: user._id,

            name: user.name,

            Bio: faker.person.bio(),

            skillevel: faker.helpers.arrayElement([
                "Beginner",
                "Intermediate",
                "Advanced"
            ]),

            skills: faker.helpers.arrayElements(
                skills,
                faker.number.int({
                    min: 2,
                    max: 5
                })
            ),

            github_link:
                `https://github.com/${faker.internet.username()}`,

            domains: faker.helpers.arrayElements(
                domains,
                faker.number.int({
                    min: 1,
                    max: 3
                })
            ),

            photo: {
                url: faker.image.avatar(),
                public_id: faker.string.uuid()
            },

            friends: []

        });
        
        const project= await Project.create({
            title:faker.company.name(),
            description:faker.company.catchPhrase,
            ownerId:user._id,
            members:[user._id],
        });

        await Work.create({
            name: `${faker.helpers.arrayElement(adjectives)} ${
        faker.helpers.arrayElement(products)
    }`,
        owner:user._id,
        project:project._id,
        });
        console.log(`Generated User ${i + 1}`);
    }
    
    console.log("Seeding Completed ✅");

    process.exit();
}

seedDatabase();