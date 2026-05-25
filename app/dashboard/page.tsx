"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  Target, 
  BarChart3, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard, AgentStatus, MetricCard, ProgressRing } from "@/components/dashboard/ui-components"
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

const defaultSkillData = [
  { skill: "DSA", value: 85, fullMark: 100 },
  { skill: "System Design", value: 70, fullMark: 100 },
  { skill: "Communication", value: 90, fullMark: 100 },
  { skill: "Problem Solving", value: 80, fullMark: 100 },
  { skill: "Technical", value: 75, fullMark: 100 },
  { skill: "Behavioral", value: 88, fullMark: 100 },
]

const defaultProgressData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 72 },
  { day: "Thu", score: 70 },
  { day: "Fri", score: 78 },
  { day: "Sat", score: 82 },
  { day: "Sun", score: 85 },
]

const defaultMissions = [
  { id: 1, title: "Complete DSA Practice", status: "completed", points: 50 },
  { id: 2, title: "Mock Interview Session", status: "in-progress", points: 100 },
  { id: 3, title: "Update Resume Skills", status: "pending", points: 30 },
  { id: 4, title: "System Design Study", status: "pending", points: 75 },
]

const defaultActivityFeed = [
  { id: 1, time: '2m ago', text: 'Resume Intelligence suggested adding "Distributed Systems" to skills.', type: 'insight' },
  { id: 2, time: '10m ago', text: 'Interview Agent queued a hard-system-design question.', type: 'agent' },
  { id: 3, time: '1h ago', text: 'Analytics Engine detected weakness in System Design.', type: 'warning' },
  { id: 4, time: '3h ago', text: 'Career Strategy created 7-day learning sprint for DSA.', type: 'mission' },
]

const timeline = [
  { id: 1, date: 'Mar 2026', title: 'Started PlacementOS', note: 'Initial setup & resume import' },
  { id: 2, date: 'Apr 2026', title: 'Completed 10 mock interviews', note: 'Avg. score 78%' },
  { id: 3, date: 'May 2026', title: 'Skill boost: Communication', note: 'Completed speaking course' },
]

export default function DashboardPage() {
  const [skillData, setSkillData] = useState(defaultSkillData)
  const [progressData, setProgressData] = useState(defaultProgressData)
  const [missions, setMissions] = useState(defaultMissions)
  const [activityFeed, setActivityFeed] = useState(defaultActivityFeed)
  const [readinessScore, setReadinessScore] = useState<number | null>(82)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('placementos_resume_analysis')
      if (raw) {
        const data = JSON.parse(raw)
        // map readiness
        if (typeof data.readinessScore === 'number') setReadinessScore(data.readinessScore)

        // adjust skills: lower for missingSkills, raise for strengths
        setSkillData((prev) => prev.map(s => {
          const delta = data.missingSkills && data.missingSkills.includes(s.skill) ? -12 : 0
          const inc = data.strengths && data.strengths.some((st: string) => st.toLowerCase().includes(s.skill.toLowerCase().split(' ')[0])) ? 6 : 0
          return { ...s, value: Math.max(20, Math.min(100, s.value + delta + inc)) }
        }))

        // add activity feed entry
        const insight = { id: Date.now(), time: 'just now', text: `Resume analyzed: readiness ${data.readinessScore}% — ${data.missingSkills?.slice(0,2).join(', ') || ''}`, type: 'insight' }
        setActivityFeed((prev) => [insight, ...prev].slice(0, 20))

        // update missions to mark Update Resume Skills as completed/suggested
        setMissions((prev) => prev.map(m => m.id === 3 ? { ...m, status: 'in-progress' } : m))
      }
    } catch (e) {
      // ignore
    }
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold"
          >
            Welcome back, <span className="text-gradient-premium">User</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Your AI agents are actively optimizing your placement journey.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card-premium text-emerald-500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500 shadow-emerald-500/50 shadow-lg"
            />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Readiness Score"
          value={`${readinessScore ?? 82}%`}
          change={5}
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          delay={0.1}
        />
        <MetricCard
          label="Interviews Completed"
          value={12}
          change={20}
          icon={<MessageSquare className="w-4 h-4 text-primary" />}
          delay={0.2}
        />
        <MetricCard
          label="Skills Improved"
          value={8}
          change={15}
          icon={<Target className="w-4 h-4 text-primary" />}
          delay={0.3}
        />
        <MetricCard
          label="Active Streak"
          value="7 days"
          icon={<Zap className="w-4 h-4 text-primary" />}
          delay={0.4}
        />
      </div>

      {/* Enhanced Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Activity Feed */}
        <GlassCard className="p-6" delay={0.7}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Activity Feed</h2>
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {activityFeed.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: e.id * 0.06 }}
                className={`p-3 rounded-lg flex items-start gap-3 transition-shadow hover:shadow-lg ${e.type === 'warning' ? 'bg-amber-900/10' : 'bg-secondary/30'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${e.type === 'insight' ? 'bg-primary/20' : e.type === 'agent' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{e.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Weak Area Detection / Skill Insights */}
        <GlassCard className="p-6" delay={0.8}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Weak Areas</h2>
            <span className="text-xs text-muted-foreground">AI prioritized</span>
          </div>
          <div className="space-y-3">
            {skillData
              .slice()
              .sort((a, b) => a.value - b.value)
              .slice(0, 3)
              .map((s) => (
                <div key={s.skill} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{s.skill}</p>
                    <p className="text-xs text-muted-foreground">Recommended mission: {s.skill} Sprint</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28">
                      <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: `${100 - s.value}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-amber-400">{s.value}%</span>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>

        {/* Career Progress Timeline */}
        <GlassCard className="p-6" delay={0.9}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Career Timeline</h2>
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          <div className="space-y-4">
            {timeline.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: t.id * 0.06 }} className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary/60 mt-1 shadow-[0_0_12px_rgba(59,130,246,0.18)]" />
                <div>
                  <p className="text-sm font-medium">{t.title} <span className="text-xs text-muted-foreground">— {t.date}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{t.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Agents Status */}
        <GlassCard className="p-6 lg:col-span-1" delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Agents</h2>
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-500"
              />
              <span className="text-xs text-muted-foreground">4 Active</span>
            </div>
          </div>
          <div className="space-y-3">
            <AgentStatus
              name="Resume Intelligence"
              status="active"
              task="Analyzing skill gaps for Google"
              progress={78}
            />
            <AgentStatus
              name="Interview Agent"
              status="processing"
              task="Generating practice questions"
              progress={45}
            />
            <AgentStatus
              name="Career Strategy"
              status="active"
              task="Updating daily missions"
            />
            <AgentStatus
              name="Analytics Engine"
              status="standby"
              task="Waiting for new data"
            />
          </div>
        </GlassCard>

        {/* Progress Chart */}
        <GlassCard className="p-6 lg:col-span-2" delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Weekly Progress</h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 35, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skills Radar */}
        <GlassCard className="p-6" delay={0.4}>
          <h2 className="text-lg font-semibold mb-4">Skills Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Daily Missions */}
        <GlassCard className="p-6" delay={0.5}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Daily Missions</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">+255 XP Available</span>
          </div>
          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {mission.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : mission.status === "in-progress" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full shrink-0"
                  />
                ) : (
                  <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{mission.title}</p>
                  <p className="text-xs text-muted-foreground">+{mission.points} XP</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Readiness Score */}
        <GlassCard className="p-6" delay={0.6}>
          <h2 className="text-lg font-semibold mb-4">Placement Readiness</h2>
            <div className="flex flex-col items-center">
            <ProgressRing value={readinessScore ?? 82} size={140} label="Ready" />
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Google</span>
                <span className="text-sm font-medium text-emerald-500">85% Match</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amazon</span>
                <span className="text-sm font-medium text-amber-500">72% Match</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Goldman Sachs</span>
                <span className="text-sm font-medium text-primary">78% Match</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/resume">
          <GlassCard className="p-4 hover:border-primary/30 transition-all cursor-pointer group" delay={0.7}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Analyze Resume</p>
                <p className="text-xs text-muted-foreground">Upload & get insights</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/dashboard/interview">
          <GlassCard className="p-4 hover:border-primary/30 transition-all cursor-pointer group" delay={0.8}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Start Interview</p>
                <p className="text-xs text-muted-foreground">Practice with AI</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/dashboard/analytics">
          <GlassCard className="p-4 hover:border-primary/30 transition-all cursor-pointer group" delay={0.9}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">View Analytics</p>
                <p className="text-xs text-muted-foreground">Track your progress</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>

        <GlassCard className="p-4 hover:border-primary/30 transition-all cursor-pointer group" delay={1.0}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Career Roadmap</p>
              <p className="text-xs text-muted-foreground">AI-generated path</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
