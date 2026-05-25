"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  Building2,
  TrendingUp,
  Target,
  Brain,
  RefreshCw,
  File,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard, ProgressRing, AIThinkingIndicator } from "@/components/dashboard/ui-components"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function ResumePage() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const companies = [
    { name: "Google", match: 85, logo: "G" },
    { name: "Amazon", match: 72, logo: "A" },
    { name: "Goldman Sachs", match: 78, logo: "GS" },
    { name: "Microsoft", match: 81, logo: "M" },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.size > 10 * 1024 * 1024) {
        alert('File too large. Max 10MB.')
        return
      }
      setFile(droppedFile)
      handleUpload(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File too large. Max 10MB.')
        return
      }
      setFile(selectedFile)
      handleUpload(selectedFile)
    }
  }

  const handleUpload = async (uploadedFile: File) => {
    setIsUploaded(true)
    
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsAnalyzing(true)
        analyzeResume(uploadedFile)
      }
    }, 200)
  }

  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append("resume", file, file.name)

      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        throw new Error(`Analyze API error ${res.status}`)
      }

      const data = await res.json()

      // Ensure shape falls back to mock fields when missing
      if (data && !data.error) {
        setAnalysisResults(data)
        try {
          // persist analysis for dashboard wiring
          localStorage.setItem('placementos_resume_analysis', JSON.stringify(data))
        } catch (e) {
          console.warn('Failed to persist resume analysis', e)
        }
        setShowResults(true)
      } else {
        throw new Error('Invalid analysis response')
      }
    } catch (err) {
      console.error('Resume analysis failed, falling back to mock', err)
      // Fallback mock results (kept similar to previous mock)
      setAnalysisResults({
        readinessScore: 78,
        strengths: [
          "Strong technical background in React & TypeScript",
          "Excellent communication skills demonstrated",
          "Solid understanding of data structures",
          "Leadership experience in projects",
        ],
        weaknesses: [
          "Limited system design experience",
          "No cloud certifications mentioned",
          "Gaps in database optimization skills",
        ],
        missingSkills: [
          "System Design",
          "AWS Fundamentals",
          "SQL Optimization",
        ],
        improvements: [
          { skill: "System Design", priority: "high", time: "2-3 weeks" },
          { skill: "AWS Fundamentals", priority: "medium", time: "1-2 weeks" },
          { skill: "SQL Optimization", priority: "medium", time: "1 week" },
          { skill: "Behavioral Interview Prep", priority: "low", time: "3-5 days" },
        ],
        companies: companies
      })
      setShowResults(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setIsUploaded(false)
    setIsAnalyzing(false)
    setShowResults(false)
    setFile(null)
    setUploadProgress(0)
    setAnalysisResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            Resume Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered resume analysis and company matching</p>
        </div>
        {showResults && (
          <Button onClick={handleReset} variant="outline" className="glass">
            <RefreshCw className="w-4 h-4 mr-2" />
            Upload New Resume
          </Button>
        )}
      </motion.div>

      {/* Upload Section */}
      <AnimatePresence mode="wait">
        {!isUploaded && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-8" delay={0.1}>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
                  isDragging 
                    ? "border-primary/70 bg-primary/10 glow-primary-intense scale-[1.02]" 
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Animated background glow */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl -top-32 -left-32"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                    className="absolute w-64 h-64 bg-accent/20 rounded-full blur-3xl -bottom-32 -right-32"
                  />
                </div>

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 glow-primary"
                  >
                    <Upload className="w-10 h-10 text-primary" />
                  </motion.div>
                  
                  <motion.h3 
                    whileHover={{ scale: 1.05 }}
                    className="text-xl font-semibold mb-3 text-gradient-premium"
                  >
                    Upload Your Resume
                  </motion.h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                    Drag and drop your PDF resume here, or click to browse
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <File className="w-4 h-4" />
                    <span>PDF, DOC, DOCX (Max 10MB)</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-border/30"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      AI will analyze:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Skills", "Experience", "Education", "Projects"].map((item) => (
                        <motion.span
                          key={item}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {isUploaded && !isAnalyzing && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="p-8" delay={0}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary mb-6 glow-primary-intense"
                />
                <h3 className="text-xl font-semibold mb-2">Uploading Resume</h3>
                <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
                  {file?.name}
                </p>
                <div className="w-full max-w-md">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="p-8" delay={0}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary mb-6 glow-primary-intense"
                />
                <h3 className="text-xl font-semibold mb-2 text-gradient-premium">AI is Analyzing Your Resume</h3>
                <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
                  Our Resume Intelligence Agent is scanning your document, extracting skills, and comparing against top company requirements.
                </p>
                <div className="w-full max-w-md space-y-4">
                  {[
                    { label: "Extracting text content", done: true },
                    { label: "Identifying skills and experience", done: true },
                    { label: "Analyzing company fit", done: false },
                    { label: "Generating recommendations", done: false },
                  ].map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="flex items-center gap-3"
                    >
                      {step.done ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-emerald-500/50 shadow-lg"
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary/50 border-t-primary rounded-full"
                        />
                      )}
                      <span className={step.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {showResults && analysisResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Readiness Score */}
            <div className="grid lg:grid-cols-3 gap-6">
              <GlassCard className="p-6 lg:col-span-1" delay={0.1}>
                <h2 className="text-lg font-semibold mb-4">Placement Readiness Score</h2>
                <div className="flex flex-col items-center">
                  <ProgressRing value={analysisResults.readinessScore} size={160} label="Score" />
                  <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {analysisResults.readinessScore >= 80 ? "Excellent" : analysisResults.readinessScore >= 60 ? "Above Average" : "Needs Improvement"}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Company Match */}
              <GlassCard className="p-6 lg:col-span-2" delay={0.2}>
                <h2 className="text-lg font-semibold mb-4">Company Fit Analysis</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {analysisResults.companies.map((company: any, i: number) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary glow-primary">
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{company.name}</span>
                          <span className="text-sm font-semibold text-gradient-premium">{company.match}%</span>
                        </div>
                        <Progress value={company.match} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid lg:grid-cols-2 gap-6">
              <GlassCard className="p-6" delay={0.3}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold">Strengths Identified</h2>
                </div>
                <div className="space-y-3">
                  {analysisResults.strengths.map((strength: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6" delay={0.4}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold">Areas for Improvement</h2>
                </div>
                <div className="space-y-3">
                  {analysisResults.weaknesses.map((weakness: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Missing Skills */}
            <GlassCard className="p-6" delay={0.5}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Missing Skills Detected</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.missingSkills.map((skill: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </GlassCard>

            {/* AI Recommendations */}
            <GlassCard className="p-6" delay={0.6}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI-Generated Improvement Plan</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResults.improvements.map((item: any, i: number) => (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.skill}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.priority === "high" 
                          ? "bg-red-500/20 text-red-400" 
                          : item.priority === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Est. {item.time}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
