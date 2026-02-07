"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconDashboard, IconSettings, IconBilling, IconSparkles, IconClose, IconTemplates } from "@/components/icons";
import { useLanguage } from "@/lib/i18n";
import { useSidebar } from "@/lib/sidebar";
import type { TranslationKey } from "@/lib/i18n/translations";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isOpen, close } = useSidebar();

  const navigation: { nameKey: TranslationKey; href: string; icon: typeof IconDashboard }[] = [
    {
      nameKey: "dashboard",
      href: "/dashboard",
      icon: IconDashboard,
    },
    {
      nameKey: "templates",
      href: "/templates",
      icon: IconTemplates,
    },
    {
      nameKey: "settings",
      href: "/settings",
      icon: IconSettings,
    },
    {
      nameKey: "billing",
      href: "/billing",
      icon: IconBilling,
    },
  ];

  const handleLinkClick = () => {
    close();
  };

  return (
    <>
      {/* Overlay pentru mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50",
          "w-64 flex-col border-r border-border/50",
          "bg-surface/80 backdrop-blur-xl",
          "transform transition-transform duration-300 ease-in-out",
          // Mobile: show/hide based on isOpen
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "lg:translate-x-0 lg:flex"
        )}
      >
        {/* Close button pentru mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-bold text-lg text-foreground">Menu</span>
          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-hover transition-colors"
          >
            <IconClose className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {t(item.nameKey)}
              </Link>
            );
          })}

          {/* AI Assistant Link */}
          <div className="pt-4 mt-4 border-t border-border">
            <Link
              href="/editor/new"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ai hover:bg-ai/10 transition-colors min-h-[44px]"
            >
              <IconSparkles className="h-5 w-5" />
              {t("aiResumeBuilder")}
            </Link>
          </div>
        </nav>

        {/* Upgrade CTA */}
        <div className="p-4 border-t border-border">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-ai/10 border border-primary/20">
            <h4 className="font-medium text-foreground mb-1">{t("upgradeToPro")}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {t("unlockFeatures")}
            </p>
            <Link
              href="/billing"
              onClick={handleLinkClick}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              {t("viewPlans")} →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
