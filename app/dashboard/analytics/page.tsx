"use client"

import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  Award,
  Zap,
  Brain,
  Clock
} from "lucide-react"
import { GlassCard, MetricCard, ProgressRing } from "@/components/dashboard/ui-components"
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

const weeklyData = [
  { week: "W1", score: 55, interviews: 2, missions: 8 },
  { week: "W2", score: 62, interviews: 3, missions: 12 },
  { week: "W3", score: 68, interviews: 4, missions: 15 },
  { week: "W4", score: 75, interviews: 3, missions: 18 },
  { week: "W5", score: 78, interviews: 5, missions: 20 },
  { week: "W6", score: 82, interviews: 4, missions: 22 },
]

const skillData = [
  { skill: "DSA", value: 85 },
  { skill: "System Design", value: 70 },
  { skill: "Communication", value: 90 },
  { skill: "Problem Solving", value: 80 },
  { skill: "Technical Knowledge", value: 75 },
  { skill: "Behavioral", value: 88 },
]

const interviewPerformance = [
  { type: "Technical", score: 78 },
  { type: "System Design", score: 65 },
  { type: "Behavioral", score: 88 },
  { type: "HR", score: 92 },
]

const timeDistribution = [
  { name: "Practice", value: 40, color: "#7c3aed" },
  { name: "Interviews", value: 25, color: "#38bdf8" },
  { name: "Learning", value: 20, color: "#10b981" },
  { name: "Review", value: 15, color: "#f59e0b" },
]

const companyReadiness = [
  { company: "Google", readiness: 85 },
  { company: "Amazon", readiness: 72 },
  { company: "Microsoft", readiness: 81 },
  { company: "Goldman Sachs", readiness: 78 },
  { company: "Meta", readiness: 68 },
]

const aiInsights = [
  {
    title: "Strong Communication Skills",
    description: "Your verbal responses show 90% clarity. This is your strongest area.",
    type: "strength"
  },
  {
    title: "System Design Gap",
    description: "Focus 30 minutes daily on system design patterns to improve by 15%.",
    type: "improvement"
  },
  {
    title: "Consistent Progress",
    description: "You've improved 27% over the last 6 weeks. Keep up the momentum!",
    type: "insight"
  },
  {
    title: "Interview Readiness",
    description: "Schedule 2 more mock interviews to reach 90% readiness for Google.",
    type: "action"
  },
]

export default function AnalyticsPage() {
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
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your progress with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm">Last 6 Weeks</span>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall Score"
          value="82%"
          change={27}
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          delay={0.1}
        />
        <MetricCard
          label="Interviews Done"
          value={21}
          change={40}
          icon={<Target className="w-4 h-4 text-primary" />}
          delay={0.2}
        />
        <MetricCard
          label="Missions Completed"
          value={95}
          change={35}
          icon={<Award className="w-4 h-4 text-primary" />}
          delay={0.3}
        />
        <MetricCard
          label="Study Hours"
          value="124h"
          change={22}
          icon={<Clock className="w-4 h-4 text-primary" />}
          delay={0.4}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <GlassCard className="p-6" delay={0.2}>
          <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Skills Radar */}
        <GlassCard className="p-6" delay={0.3}>
          <h2 className="text-lg font-semibold mb-4">Skills Distribution</h2>
          <div className="h-72">
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
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interview Performance */}
        <GlassCard className="p-6" delay={0.4}>
          <h2 className="text-lg font-semibold mb-4">Interview Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interviewPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis dataKey="type" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="#7c3aed" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Time Distribution */}
        <GlassCard className="p-6" delay={0.5}>
          <h2 className="text-lg font-semibold mb-4">Time Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {timeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Company Readiness */}
        <GlassCard className="p-6" delay={0.6}>
          <h2 className="text-lg font-semibold mb-4">Company Readiness</h2>
          <div className="space-y-4">
            {companyReadiness.map((item, i) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.company}</span>
                  <span className="text-sm font-medium text-primary">{item.readiness}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.readiness}%` }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Insights */}
      <GlassCard className="p-6" delay={0.7}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiInsights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`p-4 rounded-lg border ${
                insight.type === "strength" 
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : insight.type === "improvement"
                  ? "bg-amber-500/5 border-amber-500/20"
                  : insight.type === "action"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-accent/5 border-accent/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {insight.type === "strength" && <Zap className="w-4 h-4 text-emerald-500" />}
                {insight.type === "improvement" && <Target className="w-4 h-4 text-amber-500" />}
                {insight.type === "action" && <TrendingUp className="w-4 h-4 text-primary" />}
                {insight.type === "insight" && <Brain className="w-4 h-4 text-accent" />}
                <span className="text-sm font-medium">{insight.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
