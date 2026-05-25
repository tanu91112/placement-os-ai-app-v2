import { NextResponse } from "next/server"

interface EvaluationRequest {
  question: string
  answer: string
  type: "technical" | "system-design" | "behavioral" | "hr"
  company: string
}

export async function POST(request: Request) {
  try {
    const body: EvaluationRequest = await request.json()
    const { question, answer, type, company } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    // Simulated evaluation delay (human-like thinking)
    await new Promise(resolve => setTimeout(resolve, 900 + Math.floor(Math.random() * 1200)))

    // Basic signals extracted from answer
    const wordCount = answer.trim().length === 0 ? 0 : answer.split(/\s+/).length
    const hasStructure = /\b(first|then|next|finally|steps|approach)\b/i.test(answer)
    const hasExamples = /\b(example|for instance|in my project|we used|implemented)\b/i.test(answer)
    const mentionsComplexity = /\b(O\(|time complexity|space complexity|\bcomplexit)\b/i.test(answer)
    const usesMetrics = /\b(%|ms|seconds|minutes|GB|MB|requests|throughput)\b/i.test(answer)

    // Company-specific strictness to mimic different interviewers
    const companyStrictness: Record<string, number> = {
      Google: 8,
      Amazon: 6,
      "Goldman Sachs": 9,
      Microsoft: 5,
    }

    const strictness = companyStrictness[company] ?? 6

    // Base scoring influenced by length, structure, examples, and complexity mentions
    let baseScore = 60 + Math.min(25, Math.floor(wordCount / 6))
    if (hasStructure) baseScore += 6
    if (hasExamples) baseScore += 6
    if (mentionsComplexity) baseScore += 4
    if (usesMetrics) baseScore += 3

    // Slight random drift and strictness penalty (mimics tougher interviewers)
    const drift = Math.floor(Math.random() * 13 - 6) // -6..+6
    const finalScore = Math.max(50, Math.min(100, baseScore + drift - Math.floor(strictness / 2)))

    // Dynamic breakdown with variance
    const communication = Math.max(40, Math.min(100, finalScore + Math.floor(Math.random() * 14 - 4)))
    const technicalAccuracy = type === "technical" ? Math.max(40, Math.min(100, finalScore + Math.floor(Math.random() * 12 - 2))) : null
    const problemSolving = (type === "technical" || type === "system-design") ? Math.max(40, Math.min(100, finalScore + Math.floor(Math.random() * 10 - 3))) : null

    // Select human-like interviewer reaction
    const encouraging = [
      "Nice — you explained that clearly.",
      "Good intuition; that's a sensible approach.",
      "That shows solid understanding."
    ]
    const neutral = [
      "I see. Can you expand on that part?",
      "Okay — walk me through how you'd handle edge cases.",
      "That's reasonable, but I'd like more detail on trade-offs."
    ]
    const critical = [
      "That answer is incomplete — can you justify that choice?",
      "I don't think that handles the worst case; can you revisit it?",
      "That approach has a scalability issue — where might it break?"
    ]

    // Choose reaction style based on score and randomness
    let reactionPool = neutral
    if (finalScore >= 85) reactionPool = encouraging
    else if (finalScore < 70) reactionPool = critical
    const interviewerReaction = reactionPool[Math.floor(Math.random() * reactionPool.length)]

    // Decide whether to ask a follow-up, probe deeper, or challenge
    const roll = Math.random()
    const willFollowUp = roll < 0.65 // 65% chance to follow up
    const willChallenge = roll >= 0.65 && roll < 0.9 // 25% chance to challenge
    const willMoveOn = roll >= 0.9

    const followUpsByType: Record<string, string[]> = {
      technical: [
        "How would you modify this solution to reduce memory usage?",
        "What are the trade-offs if we choose a different data structure here?",
        "How would your approach change if inputs were streaming instead of in-memory?",
        "If we had to parallelize this, what synchronization concerns arise?"
      ],
      "system-design": [
        "How would your architecture change if traffic increases by 10x?",
        "Where are the single points of failure, and how would you mitigate them?",
        "How would you handle data partitioning and consistency?",
        "What monitoring and alerting would you add for this system?"
      ],
      behavioral: [
        "Can you provide a concrete metric that shows the impact of your action?",
        "What would you do differently if you did the project again?",
        "How did you influence others to adopt your approach?",
        "What was the hardest trade-off you made during the project?"
      ],
      hr: [
        "Which of our company values best aligns with that example?",
        "How would you handle a conflict with a manager?",
        "Tell me about a time you adapted to a major change at work.",
        "How do you prioritize learning new skills on the job?"
      ]
    }

    // Pick a follow-up that avoids repeating an obvious optimization prompt
    let followUpQuestion: string | null = null
    if (willFollowUp) {
      const list = followUpsByType[type] || followUpsByType.technical
      followUpQuestion = list[Math.floor(Math.random() * list.length)]
    } else if (willChallenge) {
      followUpQuestion = "Can you defend that choice when given a pathological input (e.g., very large skewed data)?"
    }

    // Build strengths and improvements dynamically
    const strengthsPool = [] as string[]
    if (wordCount > 80) strengthsPool.push("Comprehensive and detailed response")
    if (hasStructure) strengthsPool.push("Well-structured explanation")
    if (hasExamples) strengthsPool.push("Concrete examples from experience")
    if (mentionsComplexity) strengthsPool.push("Consideration of algorithmic complexity")
    if (usesMetrics) strengthsPool.push("Use of quantitative metrics")
    if (strengthsPool.length === 0) strengthsPool.push("Shows understanding of the problem")

    const improvementsPool = [] as string[]
    if (!hasStructure) improvementsPool.push("Use a clear step-by-step structure (e.g., outline first)")
    if (!hasExamples) improvementsPool.push("Add a concrete example or short snippet to illustrate")
    if (!mentionsComplexity && (type === "technical" || type === "system-design")) improvementsPool.push("Discuss time/space complexity and trade-offs")
    if (!usesMetrics) improvementsPool.push("Where possible, mention metrics or constraints to justify choices")
    if (finalScore < 70) improvementsPool.push("Clarify assumptions and think out loud to show reasoning")

    const evaluation = {
      overallScore: finalScore,
      breakdown: {
        technicalAccuracy,
        communication,
        problemSolving,
        structure: hasStructure ? Math.min(100, finalScore + 8) : Math.max(40, finalScore - 8),
        relevance: Math.max(40, Math.min(100, finalScore + Math.floor(Math.random() * 6 - 2)))
      },
      strengths: shuffleArray(strengthsPool).slice(0, 3),
      improvements: shuffleArray(improvementsPool).slice(0, 4),
      modelAnswer: generateModelAnswer(type, question),
      interviewerText: interviewerReaction,
      followUpQuestion,
      suggestedAction: willMoveOn ? "Move to next topic" : (willChallenge ? "Please defend your choice" : "Please expand on the point above"),
      confidence: {
        high: finalScore >= 85,
        areas: finalScore >= 85 ? ["Clear communication", "Strong technical depth"] : ["Needs more concrete examples", "Consider structuring answers"]
      }
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Answer evaluation error:", error)
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    )
  }
}

function generateModelAnswer(type: string, question: string): string {
  const modelAnswers: Record<string, string> = {
    technical: "A strong technical answer would include: 1) Clarifying the problem constraints, 2) Discussing multiple approaches with trade-offs, 3) Walking through your chosen solution step-by-step, 4) Analyzing time and space complexity, and 5) Considering edge cases.",
    "system-design": "A comprehensive system design answer should cover: 1) Requirements clarification (functional & non-functional), 2) High-level architecture, 3) Database design, 4) API design, 5) Scalability considerations, and 6) Potential bottlenecks and solutions.",
    behavioral: "Using the STAR method: 1) Situation - Set the context, 2) Task - Describe your responsibility, 3) Action - Explain what you did specifically, 4) Result - Share the outcome with metrics if possible.",
    hr: "A good HR answer should: 1) Be authentic and genuine, 2) Show self-awareness, 3) Align with company values, 4) Demonstrate growth mindset, and 5) Connect your goals with the role."
  }

  return modelAnswers[type] || modelAnswers.behavioral
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}
