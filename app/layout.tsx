import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CV Rizz - Create Professional Resumes",
    template: "%s | CV Rizz",
  },
  description:
    "Create professional, ATS-friendly resumes with AI assistance. Export to PDF in minutes.",
  keywords: ["resume", "cv", "builder", "job", "career", "ATS", "professional"],
  metadataBase: new URL("https://www.cvrizz.com"),
  openGraph: {
    title: "CV Rizz - Create Professional Resumes",
    description:
      "Create professional, ATS-friendly resumes with AI assistance. Export to PDF in minutes.",
    url: "https://www.cvrizz.com",
    siteName: "CV Rizz",
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Rizz - Create Professional Resumes",
    description:
      "Create professional, ATS-friendly resumes with AI assistance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Prevent flash of incorrect theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    // System preference
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.classList.add('light');
                      document.documentElement.classList.remove('dark');
                    } else {
                      document.documentElement.classList.add('dark');
                      document.documentElement.classList.remove('light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <Analytics />
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
