import { NextResponse } from "next/server"

// Interview question types
type QuestionType = "technical" | "system-design" | "behavioral" | "hr"
type Company = "Google" | "Amazon" | "Goldman Sachs" | "Microsoft"

interface InterviewRequest {
  company: Company
  type: QuestionType
  difficulty?: "easy" | "medium" | "hard"
  context?: string
}

// Mock question bank
const questionBank: Record<QuestionType, Record<Company, string[]>> = {
  technical: {
    "Google": [
      "Given an array of integers, find two numbers that add up to a target sum. What's the most efficient approach?",
      "How would you implement an LRU cache? Walk me through your design decisions.",
      "Explain the difference between BFS and DFS. When would you use each?",
      "Design an algorithm to find the longest palindromic substring in a given string."
    ],
    "Amazon": [
      "Tell me about a time you had to make a decision with incomplete data. How did you approach it?",
      "Design a URL shortening service like bit.ly. What are the key components?",
      "How would you implement a function to detect a cycle in a linked list?",
      "Describe how you would design an inventory management system."
    ],
    "Goldman Sachs": [
      "Explain the concept of time complexity and space complexity with examples.",
      "How would you implement a thread-safe singleton pattern?",
      "Design a system to calculate real-time stock prices.",
      "What data structures would you use to implement a trading order book?"
    ],
    "Microsoft": [
      "How would you reverse a linked list? Can you do it iteratively and recursively?",
      "Design a file synchronization system like OneDrive.",
      "Explain the concept of virtual memory and how it works.",
      "Implement a function to serialize and deserialize a binary tree."
    ]
  },
  "system-design": {
    "Google": [
      "Design YouTube's video recommendation system. How would you handle millions of users?",
      "Architect Google Drive. How do you handle file versioning and synchronization?",
      "Design a distributed search engine. What are the key challenges?",
      "How would you design Google Maps' routing system?"
    ],
    "Amazon": [
      "Design Amazon's product recommendation engine. What ML approaches would you use?",
      "Architect a system like AWS Lambda. How do you handle cold starts?",
      "Design an e-commerce checkout system that handles Black Friday traffic.",
      "How would you build a real-time package tracking system?"
    ],
    "Goldman Sachs": [
      "Design a high-frequency trading platform. What are latency considerations?",
      "Architect a real-time risk management system for trading.",
      "Design a system to detect fraudulent transactions in real-time.",
      "How would you build a portfolio management system?"
    ],
    "Microsoft": [
      "Design Microsoft Teams. How do you handle real-time messaging at scale?",
      "Architect Azure Active Directory. What are the key security considerations?",
      "Design a cloud-based IDE like VS Code's remote development feature.",
      "How would you build a global CDN for Xbox Game Pass?"
    ]
  },
  behavioral: {
    "Google": [
      "Tell me about a time you disagreed with a team member. How did you resolve it?",
      "Describe a project where you had to learn a new technology quickly.",
      "How do you handle ambiguity in project requirements?",
      "Tell me about a failure and what you learned from it."
    ],
    "Amazon": [
      "Give me an example of when you took ownership of a problem outside your scope.",
      "Describe a time you had to deliver results under tight deadlines.",
      "Tell me about a time you received critical feedback. How did you respond?",
      "How do you prioritize when everything seems important?"
    ],
    "Goldman Sachs": [
      "Describe a situation where you had to work with a difficult stakeholder.",
      "Tell me about a time you identified a risk and how you mitigated it.",
      "How do you ensure accuracy in your work under pressure?",
      "Give an example of when you had to make an ethical decision at work."
    ],
    "Microsoft": [
      "Tell me about a time you helped a teammate succeed.",
      "Describe a situation where you had to advocate for a user.",
      "How do you stay current with technology trends?",
      "Give an example of when you simplified a complex problem."
    ]
  },
  hr: {
    "Google": [
      "Why do you want to work at Google?",
      "Where do you see yourself in 5 years?",
      "What's your greatest strength and weakness?",
      "How do you handle work-life balance?"
    ],
    "Amazon": [
      "Which Amazon Leadership Principle resonates most with you?",
      "Why Amazon over other tech companies?",
      "How do you handle constructive criticism?",
      "What motivates you in your career?"
    ],
    "Goldman Sachs": [
      "Why investment banking/technology at Goldman Sachs?",
      "How do you handle high-pressure situations?",
      "What do you know about our recent initiatives?",
      "How do you see technology shaping the future of finance?"
    ],
    "Microsoft": [
      "What does Microsoft's mission mean to you?",
      "How do you approach continuous learning?",
      "What product of ours would you improve and how?",
      "How do you contribute to inclusive team environments?"
    ]
  }
}

export async function POST(request: Request) {
  try {
    const body: InterviewRequest = await request.json()
    const { company, type, difficulty = "medium", context } = body

    if (!company || !type) {
      return NextResponse.json(
        { error: "Company and type are required" },
        { status: 400 }
      )
    }

    const questions = questionBank[type]?.[company] || []
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

    // Simulated processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = {
      question: randomQuestion || "Tell me about yourself and your experience.",
      company,
      type,
      difficulty,
      tips: [
        "Take a moment to structure your thoughts before answering",
        "Use specific examples from your experience",
        "Ask clarifying questions if needed",
        "Think out loud to show your reasoning process"
      ],
      followUpContext: context || null,
      estimatedTime: type === "technical" ? "15-20 minutes" : "5-10 minutes"
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Interview generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate interview question" },
      { status: 500 }
    )
  }
}
