"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCheck } from "@/components/icons";
import { cn } from "@/lib/utils";

const languages = [
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-10 min-h-[44px] px-3 text-muted-foreground hover:text-foreground"
        >
          <span>{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-elevated border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "cursor-pointer gap-2",
              language === lang.code
                ? "text-primary"
                : "text-foreground hover:text-foreground"
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.code && (
              <IconCheck className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
