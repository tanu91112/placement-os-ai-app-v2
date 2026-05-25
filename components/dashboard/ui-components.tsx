"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  delay?: number
}

export function GlassCard({ children, className, animate = true, delay = 0 }: GlassCardProps) {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ delay, duration: 0.5 }}
        className={cn("glass-card-premium rounded-xl card-lift", className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn("glass-card-premium rounded-xl", className)}>
      {children}
    </div>
  )
}

interface AgentStatusProps {
  name: string
  status: "active" | "processing" | "standby" | "idle"
  task?: string
  progress?: number
}

export function AgentStatus({ name, status, task, progress }: AgentStatusProps) {
  const statusConfig = {
    active: { color: "bg-emerald-500", label: "Active", pulse: true, glow: "shadow-emerald-500/50" },
    processing: { color: "bg-primary", label: "Processing", pulse: true, glow: "shadow-primary/50" },
    standby: { color: "bg-amber-500", label: "Standby", pulse: false, glow: "shadow-amber-500/50" },
    idle: { color: "bg-muted-foreground", label: "Idle", pulse: false, glow: "" },
  }

  const config = statusConfig[status]

  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 4 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
    >
      <div className="relative">
        <motion.div
          animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn("w-3 h-3 rounded-full", config.color, config.glow, "shadow-lg")}
        />
        {config.pulse && (
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn("absolute inset-0 rounded-full", config.color)}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium truncate">{name}</p>
          <span className="text-xs text-muted-foreground font-medium">{config.label}</span>
        </div>
        {task && (
          <p className="text-xs text-muted-foreground truncate">{task}</p>
        )}
        {progress !== undefined && (
          <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-primary to-accent rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  delay?: number
}

export function MetricCard({ label, value, change, icon, delay = 0 }: MetricCardProps) {
  return (
    <GlassCard className="p-4" delay={delay}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {icon && (
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 rounded-xl bg-primary/10"
          >
            {icon}
          </motion.div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-2xl font-bold text-gradient-premium"
        >
          {value}
        </motion.span>
        {change !== undefined && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={cn(
              "text-xs font-medium pb-1",
              change >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {change >= 0 ? "+" : ""}{change}%
          </motion.span>
        )}
      </div>
    </GlassCard>
  )
}

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ProgressRing({ value, size = 120, strokeWidth = 8, label }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
          className="filter drop-shadow-lg"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold text-gradient-premium"
        >
          {value}%
        </motion.span>
        {label && <span className="text-xs text-muted-foreground font-medium">{label}</span>}
      </div>
    </div>
  )
}

export function LoadingPulse() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}

export function AIThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
      />
      <span className="text-sm text-primary font-medium">AI Processing...</span>
    </div>
  )
}
