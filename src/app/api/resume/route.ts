import { TITLE_DATA } from "@/lib/data"
import { type NextRequest, NextResponse } from "next/server"

const jobRoleKeywords = {
    "MERN Stack Developer": [
        "mern", "mongodb", "express", "react", "node", "javascript", "typescript", "full stack", "api", "rest", "redux", "docker"
    ],
    "Software Engineer": [
        "software", "engineer", "developer", "programming", "coding", "development", "javascript", "typescript", "java", "cpp", "python",
        "ruby", "golang", "scala", "algorithm", "data structures", "oop", "software design", "agile", "scrum",
        "git", "version control", "testing", "debugging", "ci/cd", "docker", "microservices"
    ],
    "Data Scientist": [
        "data science", "machine learning", "tensorflow", "pytorch", "scikit-learn", "modeling", "deep learning", "data mining",
        "classification", "regression", "clustering", "feature engineering", "statistics", "python", "r", "pandas", "numpy",
        "visualization", "matplotlib", "seaborn", "sql", "big data", "spark", "hadoop"
    ],
    "Product Manager": [
        "product", "management", "strategy", "roadmap", "stakeholder", "agile", "scrum", "requirements", "manager",
        "prioritization", "user stories", "market research", "product lifecycle", "kpi", "business case", "launch", "ux"
    ],
    "UX Designer": [
        "design", "user experience", "ux", "ui", "figma", "sketch", "prototype", "wireframe", "designer",
        "usability", "interaction design", "user research", "persona", "accessibility", "heuristics", "information architecture",
        "adobe xd", "photoshop", "illustrator", "responsive design"
    ],
    "Marketing Manager": [
        "marketing", "campaign", "social media", "content", "seo", "analytics", "brand", "digital marketing",
        "ppc", "email marketing", "advertising", "market segmentation", "google analytics", "crm", "copywriting",
        "growth hacking", "branding", "lead generation"
    ],
    "Sales Representative": [
        "sales", "customer", "revenue", "lead", "crm", "negotiation", "relationship", "target",
        "prospecting", "closing", "pipeline", "account management", "quota", "cold calling", "b2b", "b2c", "salesforce"
    ],
    "DevOps Engineer": [
        "devops", "aws", "docker", "kubernetes", "ci/cd", "infrastructure", "cloud", "deployment",
        "terraform", "ansible", "jenkins", "monitoring", "scaling", "linux", "automation", "serverless",
        "gcp", "azure", "bash", "shell scripting", "infrastructure as code"
    ],
    "Business Analyst": [
        "business", "analysis", "requirements", "process", "stakeholder", "documentation", "analyst",
        "workflow", "gap analysis", "use cases", "data analysis", "uml", "scrum", "agile", "user stories",
        "process improvement", "reporting", "sql"
    ],
    "Machine Learning Engineer": [
        "machine learning", "model", "training", "python", "tensorflow", "pytorch", "neural network",
        "deep learning", "data", "algorithm", "classification", "regression", "clustering", "feature engineering",
        "scikit-learn", "big data", "spark", "hadoop"
    ],
    "Front End Developer": [
        "html", "css", "javascript", "typescript", "react", "vue", "angular", "frontend", "ui", "ux", "responsive",
        "webpack", "babel", "redux", "sass", "less", "styled-components", "cross-browser", "performance optimization"
    ],
    "Back End Developer": [
        "node", "express", "java", "spring", "python", "django", "flask", "database", "sql", "nosql", "api", "rest", "graphql",
        "microservices", "authentication", "authorization", "server", "cloud", "performance tuning"
    ],
    "Full Stack Developer": [
        "javascript", "node", "react", "python", "django", "express", "mongodb", "frontend", "backend", "api", "database", "css", "html",
        "typescript", "graphql", "rest", "redux", "webpack", "docker", "ci/cd"
    ],
    "QA Engineer": [
        "testing", "automation", "selenium", "manual testing", "test cases", "bug", "qa", "performance testing",
        "regression testing", "api testing", "cypress", "jest", "mocha", "test plan", "test automation", "postman"
    ],
    "Cybersecurity Analyst": [
        "security", "cybersecurity", "penetration testing", "firewall", "threat", "vulnerability", "incident response",
        "network security", "encryption", "risk assessment", "compliance", "audit", "siem", "ids", "ips", "ethical hacking"
    ],
    "Data Engineer": [
        "data pipeline", "etl", "sql", "spark", "hadoop", "airflow", "python", "data warehouse", "big data", "database",
        "scala", "java", "kafka", "streaming", "data modeling"
    ],
    "Cloud Engineer": [
        "aws", "azure", "gcp", "cloud", "infrastructure", "devops", "docker", "kubernetes", "serverless", "automation",
        "terraform", "ansible", "ci/cd", "monitoring", "scaling"
    ],
    "Graphic Designer": [
        "photoshop", "illustrator", "design", "branding", "layout", "typography", "adobe", "creative", "ui", "ux",
        "indesign", "sketch", "figma", "color theory", "print design"
    ],
    "Content Writer": [
        "content", "writing", "seo", "copywriting", "blog", "article", "editing", "research", "marketing", "creative",
        "technical writing", "proofreading", "storytelling", "social media"
    ],
    "Software Developer": [
        "software", "developer", "programming", "coding", "development", "javascript", "typescript", "python", "java", "ruby",
        "oop", "algorithm", "data structures", "debugging", "testing", "agile", "scrum", "git", "version control"
    ],
}



function analyzeResume(text: string): string[] {
    const textLower = text.toLowerCase()
    const roleScores: { [key: string]: number } = {}

    Object.entries(jobRoleKeywords).forEach(([role, keywords]) => {
        let score = 0
        keywords.forEach((keyword) => {
            const matches = (textLower.match(new RegExp(keyword, "g")) || []).length
            score += matches
        })
        if (score > 5) {
            roleScores[role] = score
        }
    })

    const sortedRoles = Object.entries(roleScores)
        .sort(([, a], [, b]) => b - a)
        .map(([role]) => role)

    return sortedRoles.length > 0 ? sortedRoles : []
}

function filterPredictedRoles(predictedRoles: string[]): string[] {
    return predictedRoles.filter((role) => TITLE_DATA.includes(role))
}

function findClosestTitle(text: string): string {
    const lowered = text.toLowerCase()
    for (const title of TITLE_DATA) {
        if (title.toLowerCase().includes(lowered) || lowered.includes(title.toLowerCase())) {
            return title
        }
    }
    return "Software Engineer"
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("resume") as File

        if (!file) {
            return NextResponse.json({ error: "No resume file provided" }, { status: 400 })
        }

        const text = await file.text()

        let predictedRoles = analyzeResume(text)
        predictedRoles = filterPredictedRoles(predictedRoles)


        if (predictedRoles.length === 0) {
            // Use first 5 words to guess closest title fallback
            const firstWords = text.split(/\s+/).slice(0, 5).join(" ")
            const closestTitle = findClosestTitle(firstWords)
            predictedRoles = [closestTitle]
        }

        return NextResponse.json({
            predictedRoles,
            message: "Resume analyzed successfully",
        })
    } catch (error) {
        console.error("Resume analysis error:", error)
        return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
    }
}
