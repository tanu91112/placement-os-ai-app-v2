"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles, Target, FileText, MessageSquare, BarChart3, ChevronRight, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function AIAgentCard({ icon: Icon, title, description, status, delay }: {
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string,
  status: "active" | "standby" | "processing",
  delay: number
}) {
  const statusColors = {
    active: "bg-emerald-500",
    standby: "bg-amber-500",
    processing: "bg-primary"
  }

  const statusGlow = {
    active: "shadow-emerald-500/50",
    standby: "shadow-amber-500/50",
    processing: "shadow-primary/50"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card-premium rounded-xl p-6 group card-lift"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${statusColors[status]} ${statusGlow[status]} shadow-lg`}
          />
          <span className="text-xs text-muted-foreground capitalize font-medium">{status}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card-premium rounded-xl p-6 group card-lift"
    >
      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

function FloatingOrb({ className, delay = 0 }: { className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden grid-pattern">
      {/* Floating orbs for ambient effect */}
      <FloatingOrb className="w-96 h-96 bg-primary/20 -top-48 -left-48" delay={0} />
      <FloatingOrb className="w-96 h-96 bg-accent/20 top-1/3 -right-48" delay={0.3} />
      <FloatingOrb className="w-64 h-64 bg-primary/10 bottom-1/4 left-1/4" delay={0.6} />
      <FloatingOrb className="w-80 h-80 bg-accent/15 bottom-20 right-1/4" delay={0.9} />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 rounded-xl bg-primary/20 glow-primary-intense"
            >
              <Brain className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="font-bold text-lg group-hover:text-primary transition-colors">PlacementOS</span>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium glow-primary"
            >AI</motion.span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:text-primary relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#agents" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:text-primary relative group">
              AI Agents
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:text-primary relative group">
              Analytics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10 transition-colors">Sign In</Button>
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90 glow-primary-intense button-premium relative overflow-hidden">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-premium mb-6 cursor-default"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium">Autonomous AI Placement System</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Your Career.</span>
              <br />
              <span className="text-gradient-premium">Powered by AI.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              PlacementOS AI is an autonomous operating system that orchestrates multiple AI agents to manage your entire placement journey—from resume optimization to interview mastery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary-intense text-base px-8 button-premium relative overflow-hidden">
                    Launch Dashboard
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="glass-card-premium text-base px-8 hover:border-primary/50 transition-colors">
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto"
          >
            {[
              { value: "4", label: "AI Agents" },
              { value: "500+", label: "Companies Analyzed" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "24/7", label: "Always Active" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card-premium rounded-xl p-4 text-center card-lift"
              >
                <div className="text-2xl sm:text-3xl font-bold text-gradient-premium mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Multi-Agent AI System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four autonomous AI agents work in parallel to optimize every aspect of your placement journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AIAgentCard
              icon={FileText}
              title="Resume Intelligence"
              description="Analyzes your resume against top company requirements. Identifies skill gaps and generates targeted improvements."
              status="active"
              delay={0.1}
            />
            <AIAgentCard
              icon={MessageSquare}
              title="Interview Agent"
              description="Conducts personalized mock interviews. Evaluates responses and provides real-time feedback on communication."
              status="processing"
              delay={0.2}
            />
            <AIAgentCard
              icon={Target}
              title="Career Strategy"
              description="Creates personalized daily missions and roadmaps. Tracks progress and adapts strategy based on your growth."
              status="active"
              delay={0.3}
            />
            <AIAgentCard
              icon={BarChart3}
              title="Analytics Engine"
              description="Generates comprehensive insights from all agent data. Visualizes progress and predicts placement readiness."
              status="standby"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with the same technology stack trusted by leading AI companies.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={Brain}
              title="Advanced LLM Integration"
              description="Powered by state-of-the-art language models for human-like understanding and response generation."
            />
            <FeatureCard
              icon={Zap}
              title="Real-Time Processing"
              description="Instant feedback and analysis with sub-second response times for seamless interaction."
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Bank-grade encryption and privacy controls keep your data safe and confidential."
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Company Analysis"
              description="Pre-trained on hiring patterns from Google, Amazon, Goldman Sachs, and 500+ top employers."
            />
            <FeatureCard
              icon={Target}
              title="Personalized Roadmaps"
              description="AI-generated learning paths that adapt to your progress and target companies."
            />
            <FeatureCard
              icon={BarChart3}
              title="Predictive Analytics"
              description="Data-driven insights that forecast your placement readiness and success probability."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card-premium rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden magnetic-border"
          >
            <div className="absolute inset-0 animated-gradient-premium opacity-30" />
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Ready to Transform Your Career?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-xl mx-auto mb-8"
              >
                Join thousands of students who have accelerated their placement journey with PlacementOS AI.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary-intense text-base px-8 button-premium relative overflow-hidden">
                    Start Free Trial
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">PlacementOS AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 PlacementOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
