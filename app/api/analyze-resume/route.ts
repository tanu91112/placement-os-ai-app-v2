import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      )
    }

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // For PDF files, we would need to extract text first
    // For now, we'll use a mock analysis with Gemini integration structure
    // In production, you would use a PDF parser like pdf-parse
    
    let resumeText = ""
    if (file.type === "application/pdf") {
      // TODO: Implement PDF text extraction
      // For now, use mock text
      resumeText = "Resume content would be extracted here"
    } else {
      resumeText = buffer.toString("utf-8")
    }

    // Use Gemini AI for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      Analyze this resume and provide a detailed assessment in JSON format with the following structure:
      {
        "readinessScore": number (0-100),
        "strengths": string[],
        "weaknesses": string[],
        "missingSkills": string[],
        "improvements": [{"skill": string, "priority": "high|medium|low", "time": string}],
        "companies": [{"name": string, "match": number, "logo": string}]
      }
      
      Resume content: ${resumeText}
      
      Focus on:
      1. Technical skills and their relevance to top tech companies
      2. Experience quality and depth
      3. Educational background
      4. Project portfolio
      5. Overall placement readiness
    `

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      const analysis = JSON.parse(text)
      
      return NextResponse.json(analysis)
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      
      // Fallback to mock analysis if Gemini fails
      const mockAnalysis = {
        readinessScore: 78,
        strengths: [
          "Strong technical background in React & TypeScript",
          "Excellent communication skills demonstrated",
          "Solid understanding of data structures",
          "Leadership experience in projects"
        ],
        weaknesses: [
          "Limited system design experience",
          "No cloud certifications mentioned",
          "Gaps in database optimization skills"
        ],
        missingSkills: [
          "System Design",
          "AWS Fundamentals",
          "SQL Optimization"
        ],
        improvements: [
          { skill: "System Design", priority: "high", time: "2-3 weeks" },
          { skill: "AWS Fundamentals", priority: "medium", time: "1-2 weeks" },
          { skill: "SQL Optimization", priority: "medium", time: "1 week" },
          { skill: "Behavioral Interview Prep", priority: "low", time: "3-5 days" }
        ],
        companies: [
          { name: "Google", match: 85, logo: "G" },
          { name: "Amazon", match: 72, logo: "A" },
          { name: "Goldman Sachs", match: 78, logo: "GS" },
          { name: "Microsoft", match: 81, logo: "M" }
        ]
      }
      
      return NextResponse.json(mockAnalysis)
    }
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    )
  }
}
