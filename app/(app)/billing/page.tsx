"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  Sparkles,
  Shield,
  CreditCard,
  Clock,
  ChevronDown,
  Zap,
  Crown,
  FileText,
  BarChart,
  Link2,
  Loader2,
  Download,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "sonner";
import { useUserStats } from "@/hooks/useUserStats";

export default function BillingPage() {
  const { t, language } = useLanguage();
  const { stats: userStats, isLoading } = useUserStats();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly"); // Default to yearly (most popular)

  // Get real subscription data from user stats
  const trialDaysRemaining = userStats?.trialDaysRemaining ?? 14;
  const isTrialActive = userStats?.isTrialActive ?? true;
  const hasActiveSubscription = userStats?.hasActiveSubscription ?? false;
  const subscriptionStatus = userStats?.subscriptionStatus ?? "TRIAL";
  const trialProgress = ((14 - trialDaysRemaining) / 14) * 100;

  // Romanian market prices (in RON)
  const plans = [
    {
      id: "monthly",
      name: language === "ro" ? "Lunar" : "Monthly",
      price: "19.99",
      currency: "RON",
      period: language === "ro" ? "lună" : "month",
      description: language === "ro" ? "Perfect pentru căutătorii de job" : "Perfect for job seekers",
      features: [
        { text: language === "ro" ? "CV-uri nelimitate" : "Unlimited resumes", icon: FileText },
        { text: language === "ro" ? "Toate template-urile premium" : "All premium templates", icon: Crown },
        { text: language === "ro" ? "50 generări AI/lună" : "50 AI generations/month", icon: Sparkles },
        { text: language === "ro" ? "Export PDF & Word" : "PDF & Word export", icon: FileText },
        { text: language === "ro" ? "Suport prioritar" : "Priority support", icon: Zap },
      ],
    },
    {
      id: "yearly",
      name: language === "ro" ? "Anual" : "Yearly",
      price: "149.99",
      currency: "RON",
      period: language === "ro" ? "an" : "year",
      description: language === "ro" ? "Cea mai bună valoare" : "Best value",
      features: [
        { text: language === "ro" ? "Tot ce include Lunar" : "Everything in Monthly", icon: Check },
        { text: language === "ro" ? "100 generări AI/lună" : "100 AI generations/month", icon: Sparkles },
        { text: language === "ro" ? "Link-uri publice CV" : "Public resume links", icon: Link2 },
        { text: language === "ro" ? "Analiză CV-uri" : "Resume analytics", icon: BarChart },
        { text: language === "ro" ? "2 luni gratuite" : "2 months free", icon: Crown },
      ],
      popular: true,
      savings: "37%",
    },
  ];

  // Pay per CV option
  const perCvPrice = {
    price: "9.99",
    currency: "RON",
    description: language === "ro"
      ? "Plătește doar pentru CV-urile pe care le exporți"
      : "Pay only for the resumes you export",
  };

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType: planId }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(language === "ro" ? "A apărut o eroare" : "Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(language === "ro" ? "A apărut o eroare" : "Something went wrong");
    } finally {
      setLoadingPortal(false);
    }
  };

  const faqs = [
    {
      question: language === "ro" ? "Pot anula oricând?" : "Can I cancel anytime?",
      answer: language === "ro"
        ? "Da, poți anula abonamentul oricând. Vei avea acces până la sfârșitul perioadei plătite."
        : "Yes, you can cancel your subscription anytime. You'll have access until the end of your paid period.",
    },
    {
      question: language === "ro" ? "Ce se întâmplă cu CV-urile mele?" : "What happens to my resumes?",
      answer: language === "ro"
        ? "CV-urile tale rămân în cont, dar nu vei mai putea exporta sau edita fără un abonament activ sau plată per CV."
        : "Your resumes stay in your account, but you won't be able to export or edit without an active subscription or per-CV payment.",
    },
    {
      question: language === "ro" ? "Oferiti rambursări?" : "Do you offer refunds?",
      answer: language === "ro"
        ? "Da, oferim rambursare completă în primele 7 zile dacă nu ești mulțumit."
        : "Yes, we offer a full refund within the first 7 days if you're not satisfied.",
    },
    {
      question: language === "ro" ? "Cum funcționează plata per CV?" : "How does pay-per-CV work?",
      answer: language === "ro"
        ? "Poți plăti 9.99 RON pentru fiecare CV pe care dorești să-l exporți ca PDF sau Word. O singură plată, acces permanent la export pentru acel CV."
        : "You can pay 9.99 RON for each resume you want to export as PDF or Word. One payment, permanent export access for that resume.",
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-ai/20">
            <span className="text-2xl">💳</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {language === "ro" ? "Facturare" : "Billing"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {language === "ro" ? "Gestionează abonamentul și plățile" : "Manage your subscription and payments"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-surface via-surface to-ai/5 border-border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-ai/10 to-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-foreground text-xl">
                  {language === "ro" ? "Plan curent" : "Current Plan"}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  {isLoading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : hasActiveSubscription ? (
                    language === "ro" ? "Ești abonat Pro" : "You're a Pro subscriber"
                  ) : isTrialActive ? (
                    language === "ro" ? "Ești pe perioada de probă gratuită" : "You're on a free trial"
                  ) : (
                    language === "ro" ? "Perioada de probă a expirat" : "Your trial has expired"
                  )}
                </CardDescription>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <Badge className={cn(
                  "w-fit border-0 shadow-lg px-4 py-1.5",
                  hasActiveSubscription
                    ? "bg-gradient-to-r from-success to-emerald-500 text-white"
                    : isTrialActive
                    ? "bg-gradient-to-r from-ai to-purple-500 text-white"
                    : "bg-gradient-to-r from-warning to-orange-500 text-white"
                )}>
                  {hasActiveSubscription ? (
                    <>
                      <Crown className="h-3.5 w-3.5 mr-1.5" />
                      {language === "ro" ? "Pro" : "Pro"}
                    </>
                  ) : isTrialActive ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      {language === "ro" ? "Probă Gratuită" : "Free Trial"}
                    </>
                  ) : (
                    <>
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {language === "ro" ? "Expirat" : "Expired"}
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-10 w-36" />
              </div>
            ) : hasActiveSubscription ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {language === "ro"
                      ? "Bucură-te de toate funcțiile premium"
                      : "Enjoy all premium features"}
                  </p>
                </div>
                <Button
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                  variant="outline"
                  className="border-border hover:bg-hover"
                >
                  {loadingPortal ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {language === "ro" ? "Gestionează abonament" : "Manage Subscription"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {isTrialActive ? (
                          language === "ro"
                            ? `${trialDaysRemaining} zile rămase`
                            : `${trialDaysRemaining} days remaining`
                        ) : (
                          language === "ro"
                            ? "Abonează-te pentru acces complet"
                            : "Subscribe for full access"
                        )}
                      </span>
                    </div>
                    {isTrialActive && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(trialProgress)}%
                      </span>
                    )}
                  </div>
                  {isTrialActive && (
                    <div className="h-2 bg-hover rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trialProgress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-ai to-primary rounded-full"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                  className="bg-gradient-to-r from-primary to-ai hover:opacity-90 text-white shadow-lg"
                >
                  {loadingPortal ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
                  {language === "ro" ? "Upgrade la Pro" : "Upgrade to Pro"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pay Per CV Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {language === "ro" ? "Plătește per CV" : "Pay per Resume"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {perCvPrice.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-3xl font-bold text-foreground">{perCvPrice.price}</span>
                  <span className="text-muted-foreground ml-1">{perCvPrice.currency}</span>
                  <p className="text-xs text-muted-foreground">
                    {language === "ro" ? "per CV exportat" : "per exported resume"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          {language === "ro" ? "Sau alege un abonament" : "Or choose a subscription"}
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 gap-6"
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <motion.div key={plan.id} variants={staggerItem}>
                <Card
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "relative h-full flex flex-col transition-all duration-300 cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-br from-surface via-surface to-primary/5 border-primary/30 shadow-xl shadow-primary/10 -translate-y-1"
                      : "bg-surface/50 backdrop-blur-sm border-border hover:border-border-hover hover:-translate-y-1"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-ai text-white border-0 shadow-lg px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        {language === "ro" ? "Cel mai popular" : "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{plan.id === "monthly" ? "📅" : "🎯"}</span>
                      <CardTitle className="text-foreground text-xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="pt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground text-lg">{plan.currency}/{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-success mt-1 font-medium">
                          💰 {language === "ro" ? `Economisești ${plan.savings}` : `Save ${plan.savings}`}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <li key={feature.text} className="flex items-start gap-3">
                            <div className={cn(
                              "p-1.5 rounded-lg mt-0.5 transition-colors",
                              isSelected ? "bg-primary/10" : "bg-success/10"
                            )}>
                              <Icon className={cn(
                                "h-3.5 w-3.5 transition-colors",
                                isSelected ? "text-primary" : "text-success"
                              )} />
                            </div>
                            <span className="text-sm text-foreground">{feature.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckout(plan.id);
                      }}
                      disabled={loadingPlan !== null}
                      className={cn(
                        "w-full mt-6 transition-all",
                        isSelected
                          ? "bg-gradient-to-r from-primary to-ai hover:opacity-90 text-white shadow-lg"
                          : "bg-elevated border border-border hover:bg-hover text-foreground"
                      )}
                      size="lg"
                    >
                      {loadingPlan === plan.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      {language === "ro" ? `Abonează-te la ${plan.name}` : `Subscribe to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-center gap-3 py-4"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
          <Shield className="h-4 w-4 text-success" />
          <span className="text-sm text-muted-foreground">
            {language === "ro" ? "Checkout securizat cu Stripe" : "Secure checkout with Stripe"}
          </span>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="bg-surface/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <CardTitle className="text-foreground">
                {language === "ro" ? "Întrebări frecvente" : "FAQ"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-hover/50 transition-colors"
                >
                  <h3 className="font-medium text-foreground pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                      expandedFaq === index && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="bg-surface/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">
                  {language === "ro" ? "Metode de plată" : "Payment Methods"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {language === "ro" ? "Gestionează metodele de plată" : "Manage your payment methods"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-elevated border border-dashed border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow">
                  <span className="text-xs font-bold text-white tracking-wider">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {language === "ro" ? "Nicio metodă de plată" : "No payment method"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "ro" ? "Adaugă un card pentru a te abona" : "Add a card to subscribe"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleManageSubscription}
                disabled={loadingPortal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loadingPortal ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                {language === "ro" ? "Adaugă card" : "Add Card"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
