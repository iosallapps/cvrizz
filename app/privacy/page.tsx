"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const { language } = useLanguage();

  if (language === "ro") {
    return <PrivacyRO />;
  }
  return <PrivacyEN />;
}

function PrivacyRO() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Politica de Confidențialitate</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: 8 februarie 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introducere</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz (&ldquo;noi&rdquo;, &ldquo;al nostru&rdquo;) respectă confidențialitatea dvs. Această
              politică explică ce date colectăm, cum le folosim și ce drepturi aveți în legătură cu datele
              personale. Prin utilizarea cvrizz.com, sunteți de acord cu practicile descrise în această politică.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Date pe care le colectăm</h2>
            <p className="text-muted-foreground leading-relaxed">Colectăm următoarele tipuri de date:</p>

            <h3 className="text-lg font-medium text-foreground mt-4">2.1 Date furnizate de dvs.</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Date de cont:</strong> nume, adresă de email la înregistrare</li>
              <li><strong>Conținut CV:</strong> informații profesionale, educație, experiență, competențe pe care le introduceți în CV-uri</li>
              <li><strong>Date de plată:</strong> procesate securizat prin Stripe (nu stocăm datele cardului)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4">2.2 Date colectate automat</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Date de utilizare:</strong> paginile accesate, funcțiile utilizate, timpul petrecut</li>
              <li><strong>Date tehnice:</strong> adresă IP, tip browser, sistem de operare, dispozitiv</li>
              <li><strong>Cookie-uri:</strong> pentru autentificare și preferințe (limbă, temă)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Cum utilizăm datele</h2>
            <p className="text-muted-foreground leading-relaxed">Utilizăm datele dvs. pentru:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Furnizarea și îmbunătățirea serviciului</li>
              <li>Procesarea plăților și gestionarea abonamentelor</li>
              <li>Generarea de sugestii AI pentru conținutul CV-ului</li>
              <li>Comunicări legate de cont (confirmare plată, modificări serviciu)</li>
              <li>Analiză de utilizare pentru îmbunătățirea platformei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Procesare AI</h2>
            <p className="text-muted-foreground leading-relaxed">
              Folosim inteligență artificială pentru a genera sugestii de conținut pentru CV-uri. Conținutul dvs.
              poate fi trimis către furnizori terți de AI (cum ar fi OpenAI) pentru procesare. Nu folosim
              conținutul CV-urilor dvs. pentru antrenarea modelelor AI. Datele sunt trimise doar pentru a genera
              răspunsuri la solicitările dvs. specifice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Partajarea datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nu vindem datele dvs. personale. Partajăm date doar cu:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Stripe:</strong> pentru procesarea plăților</li>
              <li><strong>Supabase:</strong> pentru stocarea securizată a datelor</li>
              <li><strong>Vercel:</strong> pentru găzduirea și analytics-ul platformei</li>
              <li><strong>Furnizori AI:</strong> pentru generarea de conținut (doar la solicitarea dvs.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Securitatea datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dvs., inclusiv:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Criptare SSL/TLS pentru toate transferurile de date</li>
              <li>Stocarea parolelor folosind hash-uri securizate</li>
              <li>Acces restricționat la datele personale</li>
              <li>Backup-uri regulate ale bazei de date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Drepturile dvs. (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed">
              În conformitate cu Regulamentul General privind Protecția Datelor (GDPR), aveți dreptul:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Acces:</strong> să solicitați o copie a datelor dvs. personale</li>
              <li><strong>Rectificare:</strong> să corectați datele incorecte</li>
              <li><strong>Ștergere:</strong> să solicitați ștergerea datelor dvs. (&ldquo;dreptul de a fi uitat&rdquo;)</li>
              <li><strong>Portabilitate:</strong> să primiți datele dvs. într-un format structurat</li>
              <li><strong>Opoziție:</strong> să vă opuneți prelucrării datelor în anumite circumstanțe</li>
              <li><strong>Restricționare:</strong> să solicitați limitarea prelucrării datelor</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Pentru a exercita aceste drepturi, contactați-ne la{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>. Vom răspunde în termen de 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Cookie-uri</h2>
            <p className="text-muted-foreground leading-relaxed">Folosim următoarele tipuri de cookie-uri:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Esențiale:</strong> necesare pentru autentificare și funcționarea platformei</li>
              <li><strong>Preferințe:</strong> pentru a salva alegeri precum limba și tema</li>
              <li><strong>Analiză:</strong> pentru a înțelege cum este utilizată platforma (Vercel Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Păstrarea datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Păstrăm datele contului dvs. atât timp cât aveți un cont activ. Dacă vă ștergeți contul,
              vom elimina datele personale în termen de 30 de zile, cu excepția datelor pe care suntem
              obligați legal să le păstrăm (ex: înregistrări de facturare pentru 5 ani).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Modificări</h2>
            <p className="text-muted-foreground leading-relaxed">
              Putem actualiza această politică periodic. Vă vom notifica despre modificări semnificative
              prin email sau anunț pe platformă. Vă încurajăm să revizuiți periodic această pagină.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre confidențialitate sau datele dvs., contactați-ne la:{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/terms" className="text-sm text-primary hover:underline">
            ← Termeni și Condiții
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrivacyEN() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-8">Last updated: February 8, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              CV Rizz (&ldquo;we&rdquo;, &ldquo;our&rdquo;) respects your privacy. This policy explains what
              data we collect, how we use it, and what rights you have regarding your personal data. By using
              cvrizz.com, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Data We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">We collect the following types of data:</p>

            <h3 className="text-lg font-medium text-foreground mt-4">2.1 Data you provide</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Account data:</strong> name, email address at registration</li>
              <li><strong>Resume content:</strong> professional information, education, experience, skills you enter in your resumes</li>
              <li><strong>Payment data:</strong> securely processed through Stripe (we do not store card details)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4">2.2 Automatically collected data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Usage data:</strong> pages visited, features used, time spent</li>
              <li><strong>Technical data:</strong> IP address, browser type, operating system, device</li>
              <li><strong>Cookies:</strong> for authentication and preferences (language, theme)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Data</h2>
            <p className="text-muted-foreground leading-relaxed">We use your data to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Provide and improve the service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Generate AI suggestions for resume content</li>
              <li>Account-related communications (payment confirmation, service changes)</li>
              <li>Usage analysis to improve the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. AI Processing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use artificial intelligence to generate content suggestions for resumes. Your content may be
              sent to third-party AI providers (such as OpenAI) for processing. We do not use your resume
              content to train AI models. Data is sent only to generate responses to your specific requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Stripe:</strong> for payment processing</li>
              <li><strong>Supabase:</strong> for secure data storage</li>
              <li><strong>Vercel:</strong> for platform hosting and analytics</li>
              <li><strong>AI providers:</strong> for content generation (only at your request)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>SSL/TLS encryption for all data transfers</li>
              <li>Secure password hashing</li>
              <li>Restricted access to personal data</li>
              <li>Regular database backups</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Under the General Data Protection Regulation (GDPR), you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Access:</strong> request a copy of your personal data</li>
              <li><strong>Rectification:</strong> correct inaccurate data</li>
              <li><strong>Erasure:</strong> request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li><strong>Portability:</strong> receive your data in a structured format</li>
              <li><strong>Objection:</strong> object to data processing in certain circumstances</li>
              <li><strong>Restriction:</strong> request limitation of data processing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">We use the following types of cookies:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li><strong>Essential:</strong> necessary for authentication and platform functionality</li>
              <li><strong>Preferences:</strong> to save choices like language and theme</li>
              <li><strong>Analytics:</strong> to understand how the platform is used (Vercel Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your account data as long as you have an active account. If you delete your account,
              we will remove personal data within 30 days, except for data we are legally required to retain
              (e.g., billing records for 5 years).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy periodically. We will notify you of significant changes by email or
              through a notice on the platform. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about privacy or your data, contact us at:{" "}
              <a href="mailto:contact@cvrizz.com" className="text-primary hover:underline">
                contact@cvrizz.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/terms" className="text-sm text-primary hover:underline">
            ← Terms of Service
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
