"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-elevated border-border">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              "cursor-pointer gap-2",
              theme === t.value
                ? "text-primary bg-primary/10"
                : "text-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
            {theme === t.value && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
