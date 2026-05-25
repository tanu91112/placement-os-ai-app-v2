"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Brain,
  ChevronRight,
  Save,
  Moon,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GlassCard } from "@/components/dashboard/ui-components"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false,
  })

  const [aiSettings, setAiSettings] = useState({
    voiceFeedback: true,
    detailedAnalysis: true,
    autoSuggestions: true,
    adaptiveDifficulty: true,
  })

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <GlassCard className="p-6" delay={0.1}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">JD</span>
            </div>
            <div>
              <Button variant="outline" size="sm" className="glass">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" className="bg-secondary/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" className="bg-secondary/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" defaultValue="MIT" className="bg-secondary/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduation">Expected Graduation</Label>
              <Input id="graduation" defaultValue="May 2025" className="bg-secondary/30 border-border/50" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* AI Preferences */}
      <GlassCard className="p-6" delay={0.2}>
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Agent Preferences</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "voiceFeedback", label: "Voice Feedback", description: "Enable AI voice responses during interviews" },
            { key: "detailedAnalysis", label: "Detailed Analysis", description: "Get comprehensive breakdowns of your performance" },
            { key: "autoSuggestions", label: "Auto Suggestions", description: "Receive proactive improvement recommendations" },
            { key: "adaptiveDifficulty", label: "Adaptive Difficulty", description: "AI adjusts question difficulty based on your level" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                checked={aiSettings[setting.key as keyof typeof aiSettings]}
                onCheckedChange={(checked) => setAiSettings({ ...aiSettings, [setting.key]: checked })}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Notification Settings */}
      <GlassCard className="p-6" delay={0.3}>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", description: "Receive updates via email" },
            { key: "push", label: "Push Notifications", description: "Get real-time browser notifications" },
            { key: "weekly", label: "Weekly Summary", description: "Receive weekly progress reports" },
            { key: "marketing", label: "Marketing Updates", description: "News about new features and tips" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                checked={notifications[setting.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [setting.key]: checked })}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard className="p-6" delay={0.4}>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 rounded-lg bg-primary/20 border-2 border-primary flex items-center gap-3">
            <Moon className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-secondary/30 border-2 border-transparent hover:border-primary/30 flex items-center gap-3 transition-colors">
            <Sun className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">Light Mode</p>
              <p className="text-xs text-muted-foreground">Click to enable</p>
            </div>
          </button>
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard className="p-6" delay={0.5}>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="text-left">
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="text-left">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="text-left">
              <p className="font-medium">Connected Devices</p>
              <p className="text-sm text-muted-foreground">Manage devices logged into your account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-6 border-red-500/20" delay={0.6}>
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <div>
            <p className="font-medium text-red-400">Delete Account</p>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            Delete
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
