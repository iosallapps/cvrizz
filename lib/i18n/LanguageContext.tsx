"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKey } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect user's country from IP
async function detectCountry(): Promise<string | null> {
  try {
    // Using a free IP geolocation API
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.country_code || null;
  } catch {
    // Fallback: try another service
    try {
      const response = await fetch("https://ip-api.com/json/?fields=countryCode");
      if (response.ok) {
        const data = await response.json();
        return data.countryCode || null;
      }
    } catch {
      return null;
    }
    return null;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en"); // Default to English
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLanguage = async () => {
      // First check if user has a saved preference
      const savedLanguage = localStorage.getItem("language") as Language;

      if (savedLanguage && (savedLanguage === "ro" || savedLanguage === "en")) {
        setLanguageState(savedLanguage);
        setIsLoading(false);
        return;
      }

      // No saved preference - detect from location
      try {
        const countryCode = await detectCountry();

        if (countryCode === "RO") {
          // User is in Romania - use Romanian
          setLanguageState("ro");
          localStorage.setItem("language", "ro");
        } else {
          // User is outside Romania - use English
          setLanguageState("en");
          localStorage.setItem("language", "en");
        }
      } catch {
        // If detection fails, default to English
        setLanguageState("en");
      }

      setIsLoading(false);
    };

    initializeLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    // Update the HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = translations[language][key] || translations.en[key] || key;

    // Replace parameters like {days} with actual values
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
