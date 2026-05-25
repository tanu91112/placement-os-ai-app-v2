"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: FileText },
  { href: "/dashboard/interview", label: "AI Interview", icon: MessageSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="fixed left-0 top-0 bottom-0 z-40 glass border-r border-border/50 flex flex-col backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 rounded-xl bg-primary/20 glow-primary-intense"
          >
            <Brain className="w-5 h-5 text-primary" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                <span className="font-bold text-lg whitespace-nowrap group-hover:text-primary transition-colors">PlacementOS</span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium glow-primary"
                >AI</motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "bg-primary/20 text-primary glow-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full glow-primary-intense"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* AI Status */}
      <div className="px-3 py-4 border-t border-border/50">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 glass-card-premium",
            collapsed && "justify-center"
          )}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-emerald-500/50 shadow-lg"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-medium text-foreground whitespace-nowrap">AI Agents Active</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">4 agents running</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-border/50">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={cn(
            "flex items-center gap-3 px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-primary-intense"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium whitespace-nowrap">Pro User</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Unlimited Access</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  )
}
