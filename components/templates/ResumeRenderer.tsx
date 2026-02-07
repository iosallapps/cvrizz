"use client";

import { Template, TemplateLayout } from "@/lib/templates";
import { ResumeData } from "@/lib/resume";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Award } from "lucide-react";

interface ResumeRendererProps {
  template: Template;
  data: ResumeData;
  scale?: number;
  className?: string;
}

export function ResumeRenderer({ template, data, scale = 1, className }: ResumeRendererProps) {
  const { colorScheme, layout } = template;

  // Format date helper
  const formatDate = (date: string | null) => {
    if (!date) return "Present";
    const [year, month] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return month ? `${monthNames[parseInt(month) - 1]} ${year}` : year;
  };

  // Render based on layout type
  switch (layout) {
    case "sidebar-left":
      return (
        <SidebarLeftLayout
          template={template}
          data={data}
          formatDate={formatDate}
          className={className}
        />
      );
    case "sidebar-right":
      return (
        <SidebarRightLayout
          template={template}
          data={data}
          formatDate={formatDate}
          className={className}
        />
      );
    case "two-column":
      return (
        <TwoColumnLayout
          template={template}
          data={data}
          formatDate={formatDate}
          className={className}
        />
      );
    default:
      return (
        <SingleColumnLayout
          template={template}
          data={data}
          formatDate={formatDate}
          className={className}
        />
      );
  }
}

// Single Column Layout - Classic, clean, ATS-optimized
function SingleColumnLayout({
  template,
  data,
  formatDate,
  className,
}: {
  template: Template;
  data: ResumeData;
  formatDate: (date: string | null) => string;
  className?: string;
}) {
  const { colorScheme } = template;
  const { personalInfo, workExperience, education, skills } = data;

  return (
    <div
      className={cn("w-full h-full overflow-hidden text-[10px] leading-tight", className)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div className="p-4 text-center" style={{ borderBottom: `2px solid ${colorScheme.primary}` }}>
        <h1 className="text-lg font-bold mb-0.5" style={{ color: colorScheme.primary }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-xs font-medium mb-1" style={{ color: colorScheme.secondary }}>
          {personalInfo.jobTitle || "Job Title"}
        </p>
        <div className="flex items-center justify-center gap-3 text-[9px]" style={{ color: colorScheme.muted }}>
          {personalInfo.email && (
            <span className="flex items-center gap-0.5">
              <Mail className="w-2.5 h-2.5" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-0.5">
              <Phone className="w-2.5 h-2.5" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Summary */}
        {personalInfo.summary && (
          <Section title="Summary" color={colorScheme.primary}>
            <p className="text-[9px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </Section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <Section title="Experience" color={colorScheme.primary}>
            <div className="space-y-2">
              {workExperience.slice(0, 3).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-[10px]" style={{ color: colorScheme.text }}>
                        {exp.position}
                      </h4>
                      <p className="text-[9px]" style={{ color: colorScheme.secondary }}>
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <span className="text-[8px] flex-shrink-0" style={{ color: colorScheme.muted }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1 space-y-0.5 ml-2">
                      {exp.achievements.slice(0, 2).map((achievement, i) => (
                        <li
                          key={i}
                          className="text-[8px] flex items-start gap-1"
                          style={{ color: colorScheme.text }}
                        >
                          <span style={{ color: colorScheme.accent }}>•</span>
                          <span className="line-clamp-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" color={colorScheme.primary}>
            <div className="space-y-1.5">
              {education.slice(0, 2).map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[9px]" style={{ color: colorScheme.text }}>
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-[8px]" style={{ color: colorScheme.secondary }}>
                      {edu.institution}
                    </p>
                  </div>
                  <span className="text-[8px]" style={{ color: colorScheme.muted }}>
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills" color={colorScheme.primary}>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 8).map((skill) => (
                <span
                  key={skill.id}
                  className="px-1.5 py-0.5 rounded text-[8px]"
                  style={{
                    backgroundColor: colorScheme.accent + "20",
                    color: colorScheme.accent,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// Sidebar Left Layout
function SidebarLeftLayout({
  template,
  data,
  formatDate,
  className,
}: {
  template: Template;
  data: ResumeData;
  formatDate: (date: string | null) => string;
  className?: string;
}) {
  const { colorScheme } = template;
  const { personalInfo, workExperience, education, skills, languages } = data;

  return (
    <div
      className={cn("w-full h-full overflow-hidden text-[10px] leading-tight flex", className)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <div
        className="w-[35%] p-3 flex-shrink-0"
        style={{ backgroundColor: colorScheme.primary }}
      >
        {/* Name & Title */}
        <div className="mb-3 text-center">
          <h1 className="text-sm font-bold mb-0.5" style={{ color: colorScheme.background }}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-[9px] opacity-90" style={{ color: colorScheme.background }}>
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-1.5 mb-3">
          <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80" style={{ color: colorScheme.background }}>
            Contact
          </h3>
          <div className="space-y-1">
            {personalInfo.email && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <Mail className="w-2.5 h-2.5 opacity-70" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <Phone className="w-2.5 h-2.5 opacity-70" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <MapPin className="w-2.5 h-2.5 opacity-70" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-3">
            <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80 mb-1.5" style={{ color: colorScheme.background }}>
              Skills
            </h3>
            <div className="space-y-1">
              {skills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="text-[8px]" style={{ color: colorScheme.background }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div>
            <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80 mb-1.5" style={{ color: colorScheme.background }}>
              Languages
            </h3>
            <div className="space-y-0.5">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[8px]" style={{ color: colorScheme.background }}>
                  {lang.name} - {lang.level}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 space-y-2.5">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1 pb-0.5"
              style={{ color: colorScheme.primary, borderBottom: `1px solid ${colorScheme.primary}40` }}
            >
              Profile
            </h3>
            <p className="text-[8px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1 pb-0.5"
              style={{ color: colorScheme.primary, borderBottom: `1px solid ${colorScheme.primary}40` }}
            >
              Experience
            </h3>
            <div className="space-y-1.5">
              {workExperience.slice(0, 2).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-[9px]" style={{ color: colorScheme.text }}>
                      {exp.position}
                    </h4>
                    <span className="text-[7px]" style={{ color: colorScheme.muted }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-[8px]" style={{ color: colorScheme.secondary }}>
                    {exp.company}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-0.5 space-y-0.5">
                      {exp.achievements.slice(0, 2).map((achievement, i) => (
                        <li key={i} className="text-[7px] flex items-start gap-1">
                          <span style={{ color: colorScheme.accent }}>•</span>
                          <span className="line-clamp-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1 pb-0.5"
              style={{ color: colorScheme.primary, borderBottom: `1px solid ${colorScheme.primary}40` }}
            >
              Education
            </h3>
            {education.slice(0, 2).map((edu) => (
              <div key={edu.id}>
                <h4 className="font-semibold text-[8px]" style={{ color: colorScheme.text }}>
                  {edu.degree} in {edu.field}
                </h4>
                <p className="text-[7px]" style={{ color: colorScheme.secondary }}>
                  {edu.institution} • {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar Right Layout
function SidebarRightLayout({
  template,
  data,
  formatDate,
  className,
}: {
  template: Template;
  data: ResumeData;
  formatDate: (date: string | null) => string;
  className?: string;
}) {
  const { colorScheme } = template;
  const { personalInfo, workExperience, education, skills, languages } = data;

  return (
    <div
      className={cn("w-full h-full overflow-hidden text-[10px] leading-tight flex", className)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Main Content */}
      <div className="flex-1 p-3 space-y-2.5">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-base font-bold" style={{ color: colorScheme.primary }}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-[10px]" style={{ color: colorScheme.secondary }}>
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: colorScheme.primary }}
            >
              About Me
            </h3>
            <p className="text-[8px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: colorScheme.primary }}
            >
              Experience
            </h3>
            <div className="space-y-1.5">
              {workExperience.slice(0, 2).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-[9px]">{exp.position}</h4>
                    <span className="text-[7px]" style={{ color: colorScheme.muted }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-[8px]" style={{ color: colorScheme.secondary }}>
                    {exp.company}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-0.5 space-y-0.5">
                      {exp.achievements.slice(0, 2).map((achievement, i) => (
                        <li key={i} className="text-[7px] flex items-start gap-1">
                          <span style={{ color: colorScheme.accent }}>•</span>
                          <span className="line-clamp-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3
              className="text-[9px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: colorScheme.primary }}
            >
              Education
            </h3>
            {education.slice(0, 2).map((edu) => (
              <div key={edu.id}>
                <h4 className="font-semibold text-[8px]">{edu.degree} in {edu.field}</h4>
                <p className="text-[7px]" style={{ color: colorScheme.secondary }}>
                  {edu.institution} • {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className="w-[32%] p-3 flex-shrink-0"
        style={{ backgroundColor: colorScheme.primary }}
      >
        {/* Contact */}
        <div className="space-y-1.5 mb-3">
          <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80" style={{ color: colorScheme.background }}>
            Contact
          </h3>
          <div className="space-y-1">
            {personalInfo.email && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <Mail className="w-2.5 h-2.5 opacity-70" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <Phone className="w-2.5 h-2.5 opacity-70" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1 text-[8px]" style={{ color: colorScheme.background }}>
                <MapPin className="w-2.5 h-2.5 opacity-70" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-3">
            <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80 mb-1.5" style={{ color: colorScheme.background }}>
              Skills
            </h3>
            <div className="space-y-1">
              {skills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="text-[8px]" style={{ color: colorScheme.background }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div>
            <h3 className="text-[9px] font-semibold uppercase tracking-wider opacity-80 mb-1.5" style={{ color: colorScheme.background }}>
              Languages
            </h3>
            <div className="space-y-0.5">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[8px]" style={{ color: colorScheme.background }}>
                  {lang.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Two Column Layout
function TwoColumnLayout({
  template,
  data,
  formatDate,
  className,
}: {
  template: Template;
  data: ResumeData;
  formatDate: (date: string | null) => string;
  className?: string;
}) {
  const { colorScheme } = template;
  const { personalInfo, workExperience, education, skills } = data;

  return (
    <div
      className={cn("w-full h-full overflow-hidden text-[10px] leading-tight", className)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="p-3"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <h1 className="text-base font-bold" style={{ color: colorScheme.background }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-[10px] opacity-90" style={{ color: colorScheme.background }}>
          {personalInfo.jobTitle || "Job Title"}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-[8px]" style={{ color: colorScheme.background }}>
          {personalInfo.email && (
            <span className="flex items-center gap-0.5 opacity-80">
              <Mail className="w-2.5 h-2.5" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-0.5 opacity-80">
              <Phone className="w-2.5 h-2.5" />
              {personalInfo.phone}
            </span>
          )}
        </div>
      </div>

      {/* Two Columns */}
      <div className="flex p-3 gap-3">
        {/* Left Column */}
        <div className="flex-1 space-y-2.5">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h3
                className="text-[9px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: colorScheme.primary }}
              >
                Profile
              </h3>
              <p className="text-[8px] leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div>
              <h3
                className="text-[9px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: colorScheme.primary }}
              >
                Experience
              </h3>
              <div className="space-y-1.5">
                {workExperience.slice(0, 2).map((exp) => (
                  <div key={exp.id}>
                    <h4 className="font-semibold text-[9px]">{exp.position}</h4>
                    <p className="text-[8px]" style={{ color: colorScheme.secondary }}>
                      {exp.company} • {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-0.5 space-y-0.5">
                        {exp.achievements.slice(0, 2).map((achievement, i) => (
                          <li key={i} className="text-[7px] flex items-start gap-1">
                            <span style={{ color: colorScheme.accent }}>•</span>
                            <span className="line-clamp-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[40%] space-y-2.5">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3
                className="text-[9px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: colorScheme.primary }}
              >
                Education
              </h3>
              {education.slice(0, 2).map((edu) => (
                <div key={edu.id} className="mb-1">
                  <h4 className="font-semibold text-[8px]">{edu.degree}</h4>
                  <p className="text-[7px]" style={{ color: colorScheme.secondary }}>
                    {edu.institution}
                  </p>
                  <p className="text-[7px]" style={{ color: colorScheme.muted }}>
                    {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3
                className="text-[9px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: colorScheme.primary }}
              >
                Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill.id}
                    className="px-1 py-0.5 rounded text-[7px]"
                    style={{
                      backgroundColor: colorScheme.accent + "20",
                      color: colorScheme.accent,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Section helper component
function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-[9px] font-semibold uppercase tracking-wider mb-1.5 pb-0.5"
        style={{ color, borderBottom: `1px solid ${color}30` }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
