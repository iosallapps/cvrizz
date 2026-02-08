"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TermsPage() {
  const { language } = useLanguage();

  if (language === "ro") {
    return <TermsRO />;
  }
  return <TermsEN />;
}

function TermsRO() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-ai/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Termeni și Condiții</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: 8 februarie 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptarea termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Prin accesarea și utilizarea serviciului CV Rizz (cvrizz.com), acceptați să fiți obligat de acești
              Termeni și Condiții. Dacă nu sunteți de acord cu oricare dintre acești termeni, nu utilizați serviciul nostru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Descrierea serviciului</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz este o platformă online de creare a CV-urilor care oferă:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Creare și editare de CV-uri profesionale</li>
              <li>Template-uri premium</li>
              <li>Asistență AI pentru generarea de conținut</li>
              <li>Export în format PDF și Word</li>
              <li>Linkuri publice pentru partajarea CV-urilor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Contul de utilizator</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sunteți responsabil pentru menținerea confidențialității contului și parolei dvs. Sunteți de acord
              să acceptați responsabilitatea pentru toate activitățile care au loc în contul dvs. Trebuie să ne
              notificați imediat cu privire la orice utilizare neautorizată a contului.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Planuri și plăți</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz oferă următoarele opțiuni de plată:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Probă gratuită:</strong> 14 zile de acces complet la toate funcțiile</li>
              <li><strong>Abonament lunar:</strong> 19.99 RON/lună</li>
              <li><strong>Abonament anual:</strong> 149.99 RON/an (economisești 37%)</li>
              <li><strong>Plată per CV:</strong> 9.99 RON per CV exportat</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Plățile sunt procesate securizat prin Stripe. Abonamentele se reînnoiesc automat la finalul
              fiecărei perioade de facturare, cu excepția cazului în care sunt anulate înainte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Anulare și rambursare</h2>
            <p className="text-muted-foreground leading-relaxed">
              Puteți anula abonamentul oricând din pagina de facturare. După anulare, veți avea acces până la
              finalul perioadei de facturare curente. Oferim rambursare completă în primele 7 zile de la
              activarea abonamentului dacă nu sunteți mulțumit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Proprietate intelectuală</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conținutul pe care îl creați folosind CV Rizz vă aparține. Noi păstrăm drepturile asupra platformei,
              design-ului, template-urilor și tehnologiei de bază. Nu aveți dreptul să copiați, modificați sau
              distribuiți codul sursă sau designul platformei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Utilizare acceptabilă</h2>
            <p className="text-muted-foreground leading-relaxed">Sunteți de acord să nu:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Utilizați serviciul în scopuri ilegale sau neautorizate</li>
              <li>Încercați să accesați neautorizat sistemele noastre</li>
              <li>Transmiteți viruși sau cod malițios</li>
              <li>Creați conturi false sau multiple pentru a abuza de proba gratuită</li>
              <li>Revândeți sau redistribuiți serviciul fără permisiune</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Limitarea răspunderii</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz este furnizat &ldquo;așa cum este&rdquo;. Nu garantăm că serviciul va fi neîntrerupt sau
              fără erori. Nu suntem responsabili pentru nicio daună directă, indirectă, incidentală sau
              consecventă rezultată din utilizarea serviciului, inclusiv, dar fără a se limita la, pierderea
              de date sau oportunități de angajare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Modificări ale termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a modifica acești termeni în orice moment. Vă vom notifica prin email
              sau prin anunț pe platformă despre modificările semnificative. Continuarea utilizării serviciului
              după modificări constituie acceptarea noilor termeni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre acești termeni, ne puteți contacta la:{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/privacy" className="text-sm text-primary hover:underline">
            Politica de Confidențialitate →
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}

function TermsEN() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-ai/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-8">Last updated: February 8, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using CV Rizz (cvrizz.com), you agree to be bound by these Terms of Service.
              If you do not agree with any of these terms, do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz is an online resume building platform that offers:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Professional resume creation and editing</li>
              <li>Premium templates</li>
              <li>AI-powered content generation assistance</li>
              <li>PDF and Word export</li>
              <li>Public links for sharing resumes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. User Account</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree
              to accept responsibility for all activities that occur under your account. You must notify us
              immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Plans and Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz offers the following payment options:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Free trial:</strong> 14 days of full access to all features</li>
              <li><strong>Monthly subscription:</strong> 19.99 RON/month</li>
              <li><strong>Annual subscription:</strong> 149.99 RON/year (save 37%)</li>
              <li><strong>Pay per resume:</strong> 9.99 RON per exported resume</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Payments are securely processed through Stripe. Subscriptions automatically renew at the end
              of each billing period unless cancelled beforehand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Cancellation and Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can cancel your subscription at any time from the billing page. After cancellation, you will
              retain access until the end of your current billing period. We offer a full refund within the
              first 7 days of subscription activation if you are not satisfied.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              Content you create using CV Rizz belongs to you. We retain rights to the platform, design,
              templates, and underlying technology. You may not copy, modify, or distribute the platform&apos;s
              source code or design.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Use the service for illegal or unauthorized purposes</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Transmit viruses or malicious code</li>
              <li>Create fake or multiple accounts to abuse the free trial</li>
              <li>Resell or redistribute the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz is provided &ldquo;as is&rdquo;. We do not guarantee that the service will be
              uninterrupted or error-free. We are not responsible for any direct, indirect, incidental, or
              consequential damages resulting from the use of the service, including but not limited to loss
              of data or employment opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify you by email or through
              a notice on the platform about significant changes. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, you can contact us at:{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/privacy" className="text-sm text-primary hover:underline">
            Privacy Policy →
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
