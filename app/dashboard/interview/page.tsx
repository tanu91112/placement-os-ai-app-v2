"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Bot,
  User,
  Building2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard, ProgressRing } from "@/components/dashboard/ui-components"

const companies = [
  { name: "Google", logo: "G", role: "Software Engineer" },
  { name: "Amazon", logo: "A", role: "SDE-1" },
  { name: "Goldman Sachs", logo: "GS", role: "Technology Analyst" },
  { name: "Microsoft", logo: "M", role: "Software Developer" },
]

const interviewTypes = [
  { id: "technical", label: "Technical", description: "DSA & Problem Solving" },
  { id: "system-design", label: "System Design", description: "Architecture & Scalability" },
  { id: "behavioral", label: "Behavioral", description: "STAR Method Questions" },
  { id: "hr", label: "HR Round", description: "Culture Fit & Values" },
]

interface Message {
  id: number
  role: "ai" | "user"
  content: string
  feedback?: {
    score: number
    strengths: string[]
    improvements: string[]
  }
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "Hello! I'm your AI Interview Coach. I'll be conducting a technical interview for the Software Engineer position at Google today. Let's begin with a warm-up question. Can you tell me about a challenging project you've worked on recently?"
  }
]

export default function InterviewPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('placementos_interview_messages')
      return stored ? JSON.parse(stored) : initialMessages
    } catch (e) {
      return initialMessages
    }
  })
  const [input, setInput] = useState("")
  const [isMicOn, setIsMicOn] = useState(false)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleStartInterview = () => {
    if (selectedCompany && selectedType) {
      setIsInterviewStarted(true)

      // Fetch first question from API
      fetch('/api/generate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: selectedCompany, type: selectedType })
      })
      .then((res) => res.json())
      .then((data) => {
        const q = data.question || "Tell me about yourself and your experience."
        const newMessages: Message[] = [{ id: 1, role: 'ai', content: q }]
        setMessages(newMessages)
        try { localStorage.setItem('placementos_interview_messages', JSON.stringify(newMessages)) } catch {}
        try { localStorage.removeItem(`placementos_interview_session_${selectedCompany}_${selectedType}`) } catch {}
      })
      .catch(() => {
        const newMessages: Message[] = [{ id: 1, role: 'ai', content: "Let's begin. Tell me about a challenging project you've worked on recently." }]
        setMessages(newMessages)
        try { localStorage.setItem('placementos_interview_messages', JSON.stringify(newMessages)) } catch {}
        try { localStorage.removeItem(`placementos_interview_session_${selectedCompany}_${selectedType}`) } catch {}
      })
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Build user message and use its id to attach feedback reliably
    const answerText = input
    const userId = (messages.length ? messages[messages.length - 1].id : 0) + 1
    const userMessage: Message = { id: userId, role: 'user', content: answerText }

    setMessages((prev) => {
      const next = [...prev, userMessage]
      try { localStorage.setItem('placementos_interview_messages', JSON.stringify(next)) } catch {}
      return next
    })

    setInput("")
    setIsAIThinking(true)

    // Determine the latest AI question to send as context (scan previous messages)
    const lastAI = [...messages].slice().reverse().find(m => m.role === 'ai')
    const questionText = lastAI ? lastAI.content : ''

    // Session storage for follow-ups to avoid repeats
    const sessionKey = `placementos_interview_session_${selectedCompany || 'anon'}_${selectedType || 'technical'}`
    let session: { askedFollowUps?: string[] } = { askedFollowUps: [] }
    try {
      const raw = localStorage.getItem(sessionKey)
      if (raw) session = JSON.parse(raw)
    } catch {}

    // Call evaluation API
    fetch('/api/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: questionText, answer: answerText, type: selectedType || 'technical', company: selectedCompany || 'Google' })
    })
    .then((res) => res.json())
    .then((evalResp) => {
      setMessages((prev) => {
        // attach feedback by id
        const updated = prev.map((m) => {
          if (m.id === userId && m.role === 'user') {
            return {
              ...m,
              feedback: {
                score: evalResp.overallScore || 0,
                strengths: evalResp.strengths || [],
                improvements: evalResp.improvements || []
              }
            }
          }
          return m
        })

        // Decide follow-up text and avoid repeats
        const rawFollow = evalResp.followUpQuestion || ''
        let followToUse = rawFollow
        const alreadyAsked = session.askedFollowUps?.includes(rawFollow) || updated.some(msg => msg.content === rawFollow)
        if (!rawFollow || alreadyAsked) {
          followToUse = ''
        }

        const interviewerText = evalResp.interviewerText || 'I see.'
        const aiContent = followToUse ? `${interviewerText} ${followToUse}` : interviewerText

        const aiMessage: Message = {
          id: updated.length + 1,
          role: 'ai',
          content: aiContent
        }

        const next = [...updated, aiMessage]
        try { localStorage.setItem('placementos_interview_messages', JSON.stringify(next)) } catch {}

        // persist asked follow-ups
        if (followToUse) {
          session.askedFollowUps = session.askedFollowUps || []
          session.askedFollowUps.push(followToUse)
          try { localStorage.setItem(sessionKey, JSON.stringify(session)) } catch {}
        }

        return next
      })
    })
    .catch(() => {
      // on error, append a generic AI reply
      setMessages((prev) => {
        const aiReply: Message = { id: prev.length + 1, role: 'ai', content: "Thanks — could you expand a bit more?" }
        const next = [...prev, aiReply]
        try { localStorage.setItem('placementos_interview_messages', JSON.stringify(next)) } catch {}
        return next
      })
    })
    .finally(() => setIsAIThinking(false))
  }

  const handleEndInterview = () => {
    setShowFeedback(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            AI Interview Agent
          </h1>
          <p className="text-muted-foreground mt-1">Practice with company-specific AI interviewers</p>
        </div>
        {isInterviewStarted && !showFeedback && (
          <Button onClick={handleEndInterview} variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20">
            End Interview
          </Button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!isInterviewStarted && !showFeedback && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Company Selection */}
            <GlassCard className="p-6" delay={0.1}>
              <h2 className="text-lg font-semibold mb-4">Select Target Company</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {companies.map((company) => (
                  <motion.div
                    key={company.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCompany(company.name)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCompany === company.name
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-secondary/30 border-2 border-transparent hover:border-primary/30"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary mb-3">
                      {company.logo}
                    </div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.role}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Interview Type Selection */}
            <GlassCard className="p-6" delay={0.2}>
              <h2 className="text-lg font-semibold mb-4">Select Interview Type</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {interviewTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedType === type.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-secondary/30 border-2 border-transparent hover:border-primary/30"
                    }`}
                  >
                    <p className="font-medium mb-1">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                disabled={!selectedCompany || !selectedType}
                onClick={handleStartInterview}
                className="bg-primary hover:bg-primary/90 glow-primary px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Start AI Interview
              </Button>
            </motion.div>
          </motion.div>
        )}

        {isInterviewStarted && !showFeedback && (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Chat Area */}
              <GlassCard className="p-0 lg:col-span-2 flex flex-col h-150" delay={0}>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI Interviewer</p>
                    <p className="text-xs text-muted-foreground">{selectedCompany} • {selectedType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                  <span className="text-xs text-muted-foreground">Recording</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "ai" ? "bg-primary/20" : "bg-accent/20"
                    }`}>
                      {message.role === "ai" ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.role === "ai" 
                          ? "bg-secondary/50 text-left" 
                          : "bg-primary/20 text-left"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.feedback && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-500">Response Score: {message.feedback.score}%</span>
                          </div>
                          <div className="space-y-1">
                            {message.feedback.strengths.map((s, i) => (
                              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {s}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isAIThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={isMicOn ? "bg-red-500/20 border-red-500/50" : ""}
                  >
                    {isMicOn ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your response..."
                    className="flex-1 bg-secondary/30 border-border/50"
                  />
                  <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Side Panel */}
            <div className="space-y-4">
              <GlassCard className="p-4" delay={0.1}>
                <h3 className="font-medium mb-3">Interview Progress</h3>
                <div className="flex justify-center mb-4">
                  <ProgressRing value={35} size={100} label="Complete" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions Asked</span>
                    <span>3/8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Score</span>
                    <span className="text-emerald-500">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Elapsed</span>
                    <span>12:34</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4" delay={0.2}>
                <h3 className="font-medium mb-3">Quick Tips</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-primary/10 text-xs">
                    Use the STAR method for behavioral questions
                  </div>
                  <div className="p-2 rounded bg-primary/10 text-xs">
                    Think out loud to show your problem-solving process
                  </div>
                  <div className="p-2 rounded bg-primary/10 text-xs">
                    Ask clarifying questions when needed
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {showFeedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <GlassCard className="p-8 text-center" delay={0}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
              <p className="text-muted-foreground mb-6">Here&apos;s your performance summary</p>
              
              <div className="flex justify-center mb-8">
                <ProgressRing value={82} size={160} label="Overall Score" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-sm text-muted-foreground">Technical</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-accent">90%</p>
                  <p className="text-sm text-muted-foreground">Communication</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-emerald-500">78%</p>
                  <p className="text-sm text-muted-foreground">Problem Solving</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => {
                  // reset interview and clear persisted session
                  setShowFeedback(false);
                  setIsInterviewStarted(false);
                  setSelectedCompany(null);
                  setSelectedType(null);
                  setMessages(initialMessages);
                  try { localStorage.removeItem('placementos_interview_messages') } catch {}
                  try {
                    const sessionKey = `placementos_interview_session_${selectedCompany || 'anon'}_${selectedType || 'technical'}`
                    localStorage.removeItem(sessionKey)
                  } catch {}
                }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Interview
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  View Detailed Report
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
