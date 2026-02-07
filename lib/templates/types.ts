// Template Categories based on industry research
export type TemplateCategory =
  | "professional" // Corporate, banking, consulting
  | "modern" // Tech, startups, digital
  | "creative" // Design, marketing, media
  | "minimalist" // Clean, simple, elegant
  | "executive" // C-level, senior management
  | "academic" // Research, education, science

export type TemplateLayout = "single-column" | "two-column" | "sidebar-left" | "sidebar-right";

export type TemplateColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
};

export interface Template {
  id: string;
  name: string;
  nameRo: string; // Romanian name
  category: TemplateCategory;
  description: string;
  descriptionRo: string;
  layout: TemplateLayout;
  colorScheme: TemplateColorScheme;
  atsScore: number; // 1-100, ATS compatibility score
  isPremium: boolean;
  previewImage: string;
  tags: string[];
}

// All category values
export const templateCategories: TemplateCategory[] = [
  "professional",
  "modern",
  "creative",
  "minimalist",
  "executive",
  "academic",
];

// Category metadata for filtering
export const categoryInfo: Record<TemplateCategory, {
  name: string;
  nameRo: string;
  icon: string;
  description: string;
  descriptionRo: string;
}> = {
  professional: {
    name: "Professional",
    nameRo: "Profesional",
    icon: "💼",
    description: "Traditional layouts perfect for corporate roles",
    descriptionRo: "Layout-uri tradiționale perfecte pentru roluri corporatiste",
  },
  modern: {
    name: "Modern",
    nameRo: "Modern",
    icon: "🚀",
    description: "Contemporary designs for tech and startups",
    descriptionRo: "Design-uri contemporane pentru tech și startup-uri",
  },
  creative: {
    name: "Creative",
    nameRo: "Creativ",
    icon: "🎨",
    description: "Bold designs for creative industries",
    descriptionRo: "Design-uri îndrăznețe pentru industrii creative",
  },
  minimalist: {
    name: "Minimalist",
    nameRo: "Minimalist",
    icon: "✨",
    description: "Clean and simple elegant layouts",
    descriptionRo: "Layout-uri curate și simple, elegante",
  },
  executive: {
    name: "Executive",
    nameRo: "Executiv",
    icon: "👔",
    description: "Sophisticated designs for senior roles",
    descriptionRo: "Design-uri sofisticate pentru roluri senior",
  },
  academic: {
    name: "Academic",
    nameRo: "Academic",
    icon: "📚",
    description: "Formal layouts for research and education",
    descriptionRo: "Layout-uri formale pentru cercetare și educație",
  },
};
