"use client";

import Link from "next/link";
import { useState } from "react";
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
  Globe,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Globe,
      title: language === "ro" ? "Bilingv RO + EN" : "Bilingual RO + EN",
      desc: language === "ro"
        ? "Comutare instantă între română și engleză. Template-urile poartă ambele limbi, fără traduceri pe jumătate."
        : "Instant toggle between Romanian and English. Templates carry both languages, no half-translated buttons.",
      gradient: "from-primary to-ai",
      glow: "from-primary/40 to-ai/40",
      delay: 0,
    },
    {
      icon: FileText,
      title: language === "ro" ? "Template-uri Premium" : "Premium Templates",
      desc: language === "ro"
        ? "Design-uri moderne, optimizate pentru ATS și testate cu recruiteri"
        : "Modern designs, ATS-optimized and tested with recruiters",
      gradient: "from-ai to-primary",
      glow: "from-ai/40 to-primary/40",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: language === "ro" ? "Preview în Timp Real" : "Real-time Preview",
      desc: language === "ro"
        ? "Vezi exact cum arată CV-ul tău în timp ce îl editezi"
        : "See exactly how your resume looks while you edit it",
      gradient: "from-primary via-ai to-primary",
      glow: "from-primary/30 via-ai/40 to-primary/30",
      delay: 0.2,
    },
    {
      icon: Download,
      title: language === "ro" ? "Export Profesional" : "Professional Export",
      desc: language === "ro"
        ? "Descarcă în PDF de înaltă calitate, gata pentru aplicare"
        : "Download in high-quality PDF, ready to apply",
      gradient: "from-ai via-primary to-ai",
      glow: "from-ai/30 via-primary/40 to-ai/30",
      delay: 0.3,
    },
  ];

  const steps = [
    {
      num: "01",
      icon: Palette,
      title: language === "ro" ? "Alege un template" : "Pick a template",
      desc: language === "ro"
        ? "10+ design-uri editoriale, toate testate ATS. Patru layout-uri: o coloană, două coloane, sidebar stânga, sidebar dreapta."
        : "10+ editorial designs, all ATS-tested. Four layouts: single column, two columns, sidebar left, sidebar right.",
      meta: language === "ro" ? "10+ template-uri · 4 layout-uri" : "10+ templates · 4 layouts",
    },
    {
      num: "02",
      icon: Zap,
      title: language === "ro" ? "Construiește-ți CV-ul" : "Build your CV",
      desc: language === "ro"
        ? "Editor live cu preview în timp real. Reordonezi secțiuni cu drag-and-drop. Auto-save la fiecare tastă, fără să apeși vreodată „Salvează\"."
        : "Live editor with real-time preview. Reorder sections with drag-and-drop. Auto-saves on every keystroke. You never click \"Save\".",
      meta: language === "ro" ? "Preview live · Auto-save" : "Live preview · Auto-save",
    },
    {
      num: "03",
      icon: Download,
      title: language === "ro" ? "Aplică" : "Apply",
      desc: language === "ro"
        ? "Export în PDF de înaltă calitate sau Word, fără watermark. Sau partajează cu un link public custom. Recruiterul îl deschide direct în browser."
        : "Export to high-quality PDF or Word, no watermark. Or share with a custom public link. Recruiters open it straight in their browser.",
      meta: language === "ro" ? "PDF · Word · Link public" : "PDF · Word · Public link",
    },
  ];

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
        {/* Mid accent blob — adds depth between the corners */}
        <div
          className="absolute w-[420px] h-[420px] rounded-full opacity-10 blur-[110px]"
          style={{
            background: "radial-gradient(circle, oklch(0.63 0.23 295) 0%, transparent 70%)",
            top: "40%",
            left: "55%",
          }}
        />
      </div>

      {/* Grain overlay — subtle premium depth */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

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
                    {language === "ro" ? "Nou: 14 zile gratuit, fără card" : "New: 14-day trial, no card"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-foreground px-2">
                {language === "ro" ? (
                  <>
                    CV-ul tău perfect,
                    <br className="hidden sm:inline" />{" "}
                    cu{" "}
                    <span className="text-gradient italic inline-block pr-[0.12em]">rizz</span>.
                  </>
                ) : (
                  <>
                    Your perfect resume,
                    <br className="hidden sm:inline" />{" "}
                    with{" "}
                    <span className="text-gradient italic inline-block pr-[0.12em]">rizz</span>.
                  </>
                )}
              </h1>
            </motion.div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {language === "ro"
                ? "Editor live. Template-uri editoriale. Export într-o secundă, în română și engleză."
                : "Live editor. Editorial templates. Export in a second, in Romanian and English."}
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
                  {language === "ro" ? "Vezi template-urile" : "Browse templates"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            {/* Specs Row — real, verifiable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-12 max-w-3xl mx-auto pt-2">
              {[
                {
                  value: "10+",
                  label: language === "ro" ? "Template-uri editoriale" : "Editorial templates",
                },
                {
                  value: "98",
                  unit: "/100",
                  label: language === "ro" ? "Scor ATS maxim" : "Max ATS score",
                },
                {
                  value: "PDF",
                  unit: " · Word",
                  label: language === "ro" ? "Formate de export" : "Export formats",
                },
                {
                  value: "14",
                  unit: language === "ro" ? " zile" : " days",
                  label: language === "ro" ? "Gratuit · fără card" : "Free · no card",
                },
              ].map((spec) => (
                <div key={spec.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight flex items-baseline justify-center">
                    <span>{spec.value}</span>
                    {spec.unit && (
                      <span className="text-xl md:text-2xl text-muted-foreground font-medium">
                        {spec.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1.5 tracking-wide">
                    {spec.label}
                  </div>
                </div>
              ))}
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

                      {/* Save status card — real auto-save indicator */}
                      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-success/10 via-success/5 to-transparent border border-success/20">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {language === "ro" ? "Toate salvate" : "All saved"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {language === "ro" ? "Auto-save activ" : "Auto-save on"}
                            </p>
                          </div>
                        </div>
                        <div className="h-9 bg-elevated rounded-lg border border-border/50 flex items-center justify-between px-3">
                          <span className="text-xs text-muted-foreground">
                            {language === "ro" ? "Ultima modificare" : "Last edit"}
                          </span>
                          <span className="text-xs text-success font-medium">
                            {language === "ro" ? "acum 1s" : "1s ago"}
                          </span>
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
                        <div className="aspect-[8.5/11] bg-white rounded-lg shadow-2xl p-5 relative overflow-hidden text-gray-900">
                          {/* Header */}
                          <div className="text-center pb-2.5 border-b border-gray-200">
                            <div className="text-[11px] font-bold tracking-tight text-gray-900 leading-tight">
                              Alexandra Popa
                            </div>
                            <div className="text-[7px] uppercase tracking-[0.18em] text-primary font-semibold mt-1">
                              Senior Product Designer
                            </div>
                            <div className="text-[6px] text-gray-500 mt-1 flex justify-center gap-1.5">
                              <span>alex@email.com</span>
                              <span>·</span>
                              <span>București</span>
                            </div>
                          </div>

                          {/* Summary */}
                          <p className="text-[6.5px] leading-[1.5] text-gray-700 mt-2.5">
                            Product designer with 7+ years shipping consumer and B2B SaaS. Led design at two early-stage startups.
                          </p>

                          {/* Experience */}
                          <div className="mt-2.5">
                            <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-gray-900 pb-0.5 border-b border-gray-300">
                              Experience
                            </div>
                            <div className="mt-1.5">
                              <div className="flex justify-between items-baseline">
                                <div className="text-[7px] font-semibold text-gray-900">Lead Designer · Nordic</div>
                                <div className="text-[5.5px] text-gray-500">2022-Now</div>
                              </div>
                              <ul className="mt-1 space-y-0.5 text-[6px] leading-snug text-gray-700">
                                <li className="flex gap-1"><span className="text-primary">•</span>Redesigned onboarding, lifted activation +34%.</li>
                                <li className="flex gap-1"><span className="text-primary">•</span>Built design system across 4 product lines.</li>
                              </ul>
                            </div>
                            <div className="mt-1.5">
                              <div className="flex justify-between items-baseline">
                                <div className="text-[7px] font-semibold text-gray-900">Senior Designer · Pixel</div>
                                <div className="text-[5.5px] text-gray-500">2019-2022</div>
                              </div>
                              <ul className="mt-1 space-y-0.5 text-[6px] leading-snug text-gray-700">
                                <li className="flex gap-1"><span className="text-primary">•</span>Owned checkout flow for 2M+ monthly users.</li>
                              </ul>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mt-2.5">
                            <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-gray-900 pb-0.5 border-b border-gray-300">
                              Skills
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {["Figma", "Design Systems", "Research", "Prototyping"].map((s) => (
                                <span key={s} className="text-[5.5px] px-1 py-[1px] rounded-sm bg-gray-100 text-gray-700">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards — real product features */}
              <div className="absolute -top-6 -right-6 lg:-right-12 hidden sm:block">
                <div className="bg-surface/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ai flex items-center justify-center shadow-lg shadow-primary/25">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {language === "ro" ? "Auto-save" : "Auto-save"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === "ro" ? "La fiecare tastă" : "Every keystroke"}
                      </p>
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
                      <p className="text-sm font-semibold text-foreground">
                        {language === "ro" ? "Scor ATS" : "ATS Score"}
                      </p>
                      <p className="text-xs text-success font-bold">98/100</p>
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
                  "absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-r",
                  feature.glow
                )} />

                <div className="relative bg-surface/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 h-full group-hover:border-border transition-colors overflow-hidden">
                  {/* Top edge highlight */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg shadow-primary/20",
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

      {/* How it works — three steps */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                {language === "ro" ? "Cum funcționează" : "How it works"}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              {language === "ro" ? "De la zero la aplicare" : "From blank to applied"}
              <br className="hidden md:inline" />
              <span className="text-muted-foreground">
                {language === "ro" ? " în trei pași." : " in three steps."}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ro"
                ? "Fără cont premium ca să încerci. Fără watermark pe export. Fără chestii ascunse după paywall."
                : "No premium account to try it. No watermark on export. Nothing hidden behind a paywall."}
            </p>
          </motion.div>

          {/* Connecting line on desktop */}
          <div className="relative max-w-6xl mx-auto">
            <div
              aria-hidden
              className="hidden md:block absolute top-[88px] left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-r from-primary/20 to-ai/20" />

                  <div className="relative bg-surface/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 h-full flex flex-col group-hover:border-border transition-colors overflow-hidden">
                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    {/* Step header: number + icon node on the connecting line */}
                    <div className="flex items-center justify-between mb-7">
                      <span className="text-5xl font-bold leading-none tracking-tighter text-gradient">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-ai flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-base">
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                      {step.desc}
                    </p>

                    {/* Meta footer */}
                    <div className="flex items-center gap-2 pt-5 border-t border-border/50 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {step.meta}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
