"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
  FileText,
  Zap,
  Download,
  Palette,
  Shield,
  Clock,
  CheckCircle2,
  Star,
  Play,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}


export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: language === "ro" ? "Scriere AI Avansată" : "Advanced AI Writing",
      desc: language === "ro"
        ? "Generează descrieri profesionale și bullet points optimizate pentru fiecare rol"
        : "Generate professional descriptions and optimized bullet points for each role",
      gradient: "from-violet-500 to-purple-500",
      delay: 0,
    },
    {
      icon: FileText,
      title: language === "ro" ? "Template-uri Premium" : "Premium Templates",
      desc: language === "ro"
        ? "Design-uri moderne, optimizate pentru ATS și testate cu recruiteri"
        : "Modern designs, ATS-optimized and tested with recruiters",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: language === "ro" ? "Preview în Timp Real" : "Real-time Preview",
      desc: language === "ro"
        ? "Vezi exact cum arată CV-ul tău în timp ce îl editezi"
        : "See exactly how your resume looks while you edit it",
      gradient: "from-amber-500 to-orange-500",
      delay: 0.2,
    },
    {
      icon: Download,
      title: language === "ro" ? "Export Profesional" : "Professional Export",
      desc: language === "ro"
        ? "Descarcă în PDF de înaltă calitate, gata pentru aplicare"
        : "Download in high-quality PDF, ready to apply",
      gradient: "from-emerald-500 to-green-500",
      delay: 0.3,
    },
  ];

  const words = language === "ro"
    ? ["CV-ul", "tău", "perfect,", "creat", "cu", "AI"]
    : ["Your", "perfect", "resume,", "crafted", "with", "AI"];

  return (
    <div className="min-h-screen bg-base relative overflow-x-hidden">
      {/* Static Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.3 280) 0%, transparent 70%)",
            top: "-15%",
            left: "-5%",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.25 200) 0%, transparent 70%)",
            bottom: "-10%",
            right: "-5%",
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="mx-4 lg:mx-8 mt-4">
          <div className="bg-surface/60 backdrop-blur-2xl border border-border/50 rounded-2xl px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-ai flex items-center justify-center shadow-lg shadow-primary/25">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">CV Rizz</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button variant="gradient" size="sm" className="shadow-lg shadow-primary/25" asChild>
                <Link href="/signup">
                  {t("getStarted")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="bg-surface/95 backdrop-blur-2xl border border-border/50 rounded-2xl p-4 flex flex-col gap-3">
              <Button variant="ghost" className="w-full justify-center" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{t("signIn")}</Link>
              </Button>
              <Button variant="gradient" className="w-full justify-center" asChild>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  {t("getStartedFree")}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-ai to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition" />
                <div className="relative inline-flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-border/50 px-5 py-2.5 rounded-full text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-foreground font-medium">
                    {language === "ro" ? "Nou: Generare AI îmbunătățită" : "New: Enhanced AI Generation"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-block mr-[0.25em]",
                      index >= (language === "ro" ? 4 : 4)
                        ? "bg-gradient-to-r from-primary via-ai to-purple-500 bg-clip-text text-transparent"
                        : "text-foreground"
                    )}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {language === "ro"
                ? "Editor intuitiv. Template-uri profesionale. AI care scrie pentru tine."
                : "Intuitive editor. Professional templates. AI that writes for you."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="gradient" size="xl" className="group shadow-2xl shadow-primary/30" asChild>
                <Link href="/signup">
                  {language === "ro" ? "Începe gratuit" : "Start for free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="group backdrop-blur-sm" asChild>
                <Link href="/templates">
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  {language === "ro" ? "Vezi demo" : "Watch demo"}
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {language === "ro" ? "CV-uri create" : "Resumes created"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={95} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {language === "ro" ? "Rată ATS" : "ATS Rate"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-1">
                  <AnimatedCounter value={4} />.9
                  <Star className="h-5 w-5 text-warning fill-warning" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {language === "ro" ? "Rating utilizatori" : "User rating"}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 max-w-6xl mx-auto relative">
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-ai/20 to-purple-500/20 blur-3xl scale-95" />

            {/* Main mockup */}
            <div className="relative">
              <div className="relative bg-surface/80 backdrop-blur-2xl rounded-2xl lg:rounded-3xl border border-border/50 p-2 md:p-3 shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-2 md:mb-3 px-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="flex-1 mx-4 hidden sm:block">
                    <div className="bg-elevated/80 rounded-lg px-4 py-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                      <Shield className="h-3 w-3 text-success" />
                      cvrizz.com/editor
                    </div>
                  </div>
                </div>

                {/* Editor mockup */}
                <div className="bg-base rounded-xl lg:rounded-2xl overflow-hidden border border-border/30">
                  <div className="grid lg:grid-cols-[300px_1fr_320px] min-h-[450px] lg:min-h-[550px]">
                    {/* Left Sidebar */}
                    <div className="hidden lg:flex flex-col border-r border-border/50 p-4">
                      <div className="space-y-2 mb-6">
                        {["Personal Info", "Experience", "Education", "Skills"].map((item, i) => (
                          <div
                            key={item}
                            className={cn(
                              "h-10 rounded-lg flex items-center px-3 gap-3 cursor-pointer transition-colors",
                              i === 0 ? "bg-primary/10 text-primary" : "hover:bg-hover text-muted-foreground"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center text-xs",
                              i === 0 ? "bg-primary/20" : "bg-muted"
                            )}>
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* AI Assistant Card */}
                      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-ai/10 via-purple-500/5 to-transparent border border-ai/20">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai to-purple-500 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
                            <p className="text-xs text-muted-foreground">Ready to help</p>
                          </div>
                        </div>
                        <div className="h-9 bg-ai/10 rounded-lg border border-ai/20 flex items-center px-3">
                          <span className="text-xs text-ai">Generate bullet points...</span>
                        </div>
                      </div>
                    </div>

                    {/* Center - Form Area */}
                    <div className="p-4 lg:p-6 border-r border-border/50 hidden md:block">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Personal Information</h3>
                            <p className="text-xs text-muted-foreground">Basic details about you</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-10 bg-elevated rounded-lg border border-border/50" />
                          <div className="h-10 bg-elevated rounded-lg border border-border/50" />
                        </div>
                        <div className="h-10 bg-elevated rounded-lg border border-border/50" />
                        <div className="h-24 bg-elevated rounded-lg border border-border/50" />
                      </div>
                    </div>

                    {/* Right - Preview */}
                    <div className="p-4 lg:p-6 bg-muted/30 flex items-center justify-center">
                      <div className="w-full max-w-[240px]">
                        <div className="aspect-[8.5/11] bg-white rounded-lg shadow-2xl p-5 space-y-3 relative overflow-hidden">
                          {/* Content */}
                          <div className="text-center pb-2 border-b border-gray-200">
                            <div className="h-3.5 bg-gray-800 rounded w-24 mx-auto mb-1.5" />
                            <div className="h-2 bg-primary/60 rounded w-16 mx-auto" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-200 rounded w-full" />
                            <div className="h-2 bg-gray-200 rounded w-5/6" />
                            <div className="h-2 bg-gray-200 rounded w-4/6" />
                          </div>
                          <div className="pt-2 space-y-1.5">
                            <div className="h-2.5 bg-gray-700 rounded w-16" />
                            <div className="h-1.5 bg-gray-200 rounded w-full" />
                            <div className="h-1.5 bg-gray-200 rounded w-11/12" />
                            <div className="h-1.5 bg-gray-200 rounded w-10/12" />
                          </div>
                          <div className="pt-2 space-y-1.5">
                            <div className="h-2.5 bg-gray-700 rounded w-14" />
                            <div className="h-1.5 bg-gray-200 rounded w-full" />
                            <div className="h-1.5 bg-gray-200 rounded w-9/12" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 lg:-right-12 hidden sm:block">
                <div className="bg-surface/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai to-purple-500 flex items-center justify-center shadow-lg shadow-ai/25">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">AI Generated</p>
                      <p className="text-xs text-muted-foreground">3 bullet points ready</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 lg:-left-12 hidden sm:block">
                <div className="bg-surface/95 backdrop-blur-xl border border-success/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">ATS Score</p>
                      <p className="text-xs text-success font-bold">95% Compatible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {language === "ro" ? "Tot ce ai nevoie" : "Everything you need"}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ro"
                ? "Instrumente puternice pentru CV-ul perfect"
                : "Powerful tools for the perfect resume"}
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className={cn(
                  "absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                  `bg-gradient-to-r ${feature.gradient}`
                )} />

                <div className="relative bg-surface/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 h-full group-hover:border-border transition-colors">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg",
                    feature.gradient
                  )}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-ai/20 to-purple-500/20 rounded-[2.5rem] blur-3xl" />

            <div className="relative bg-surface/80 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 md:p-16 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary via-ai to-purple-500 flex items-center justify-center shadow-2xl shadow-primary/30"
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {language === "ro" ? "Gata să începi?" : "Ready to start?"}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                {language === "ro"
                  ? "Creează-ți CV-ul profesional în câteva minute. Gratuit 14 zile."
                  : "Create your professional resume in minutes. Free for 14 days."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="xl" className="shadow-2xl shadow-primary/30" asChild>
                  <Link href="/signup">
                    {language === "ro" ? "Creează CV-ul tău" : "Create your resume"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{language === "ro" ? "Fără card de credit" : "No credit card"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{language === "ro" ? "Setup în 2 minute" : "2-minute setup"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-ai" />
                  <span>{language === "ro" ? "Date securizate" : "Secure data"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-ai flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">CV Rizz</span>
            </div>

            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                {t("termsOfService")}
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CV Rizz
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
