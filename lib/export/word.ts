import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  HeadingLevel,
} from "docx";
import type { ResumeData, WorkExperience, Education, Skill } from "@/types/resume";

const FONT = "Calibri";
const MARGIN = convertInchesToTwip(0.75);

/**
 * Generate a Word document (.docx) from resume data
 * Uses single-column ATS-friendly layout
 */
export async function generateWordDocument(resume: ResumeData): Promise<Blob> {
  const children: Paragraph[] = [];

  // Header: Name (centered, large)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.basics.name || "Your Name",
          bold: true,
          size: 32,
          font: FONT,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  // Header: Job Title / Label (centered, italic)
  if (resume.basics.label?.trim()) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.basics.label,
            italics: true,
            size: 24,
            font: FONT,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Contact line (email, phone, location separated by bullets)
  const contactParts = [
    resume.basics.email,
    resume.basics.phone,
    [resume.basics.location?.city, resume.basics.location?.countryCode]
      .filter(Boolean)
      .join(", "),
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" • "),
            size: 20,
            font: FONT,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Professional Summary
  if (resume.basics.summary?.trim()) {
    children.push(createSectionHeader("Professional Summary"));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.basics.summary,
            size: 22,
            font: FONT,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Work Experience
  if (resume.work?.length > 0) {
    children.push(createSectionHeader("Work Experience"));
    resume.work.forEach((job) => {
      children.push(...createWorkEntry(job));
    });
  }

  // Education
  if (resume.education?.length > 0) {
    children.push(createSectionHeader("Education"));
    resume.education.forEach((edu) => {
      children.push(...createEducationEntry(edu));
    });
  }

  // Skills
  if (resume.skills?.length > 0) {
    children.push(createSectionHeader("Skills"));
    children.push(createSkillsList(resume.skills));
  }

  // Languages
  if (resume.languages?.length > 0) {
    children.push(createSectionHeader("Languages"));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.languages.map((l) => `${l.language} (${l.fluency})`).join(" • "),
            size: 22,
            font: FONT,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
              right: MARGIN,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 24,
        font: FONT,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },
    },
    spacing: { before: 300, after: 150 },
  });
}

function createWorkEntry(job: WorkExperience): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Position at Company
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: job.position,
          bold: true,
          size: 22,
          font: FONT,
        }),
        new TextRun({
          text: ` at ${job.company}`,
          size: 22,
          font: FONT,
        }),
      ],
    })
  );

  // Date range
  const dateRange = job.endDate
    ? `${formatDate(job.startDate)} - ${formatDate(job.endDate)}`
    : `${formatDate(job.startDate)} - Present`;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: dateRange,
          italics: true,
          size: 20,
          font: FONT,
          color: "666666",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  // Summary
  if (job.summary?.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: job.summary,
            size: 22,
            font: FONT,
          }),
        ],
        spacing: { after: 50 },
      })
    );
  }

  // Highlights (bullet points)
  if (job.highlights?.length > 0) {
    job.highlights.forEach((highlight) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${highlight}`,
              size: 22,
              font: FONT,
            }),
          ],
          indent: { left: convertInchesToTwip(0.25) },
        })
      );
    });
  }

  // Spacer after entry
  paragraphs.push(
    new Paragraph({
      spacing: { after: 150 },
    })
  );

  return paragraphs;
}

function createEducationEntry(edu: Education): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Degree in Field
  const degreeText = [edu.studyType, edu.area].filter(Boolean).join(" in ");
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: degreeText || "Degree",
          bold: true,
          size: 22,
          font: FONT,
        }),
      ],
    })
  );

  // Institution and dates
  const dateRange = edu.endDate
    ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
    : formatDate(edu.startDate);

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: edu.institution,
          size: 22,
          font: FONT,
        }),
        new TextRun({
          text: ` • ${dateRange}`,
          italics: true,
          size: 20,
          font: FONT,
          color: "666666",
        }),
        ...(edu.score
          ? [
              new TextRun({
                text: ` • GPA: ${edu.score}`,
                size: 20,
                font: FONT,
                color: "666666",
              }),
            ]
          : []),
      ],
      spacing: { after: 150 },
    })
  );

  return paragraphs;
}

function createSkillsList(skills: Skill[]): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: skills.map((s) => s.name).join(" • "),
        size: 22,
        font: FONT,
      }),
    ],
  });
}

/**
 * Format date string (YYYY-MM) to readable format (Jan 2024)
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  const [year, month] = dateStr.split("-");
  if (!year) return dateStr;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (month && months[parseInt(month) - 1]) {
    return `${months[parseInt(month) - 1]} ${year}`;
  }

  return year;
}

/**
 * Sanitize filename for safe download
 */
export function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50) || "resume"
  );
}
