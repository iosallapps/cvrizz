import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

interface ResumeData {
  basics: {
    name?: string;
    label?: string;
    email?: string;
    phone?: string;
    location?: {
      city?: string;
      country?: string;
    };
    summary?: string;
  };
  work: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education: Array<{
    institution?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: Array<{
    name?: string;
    level?: string;
    keywords?: string[];
  }>;
  languages?: Array<{
    language?: string;
    fluency?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

// Export to PDF using html2canvas
export async function exportToPDF(
  elementId: string,
  filename: string = "resume.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Create canvas from element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // Calculate dimensions for A4
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  const pdf = new jsPDF("p", "mm", "a4");
  let position = 0;

  // Add first page
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;

  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

// Export to Word document
export async function exportToWord(
  data: ResumeData,
  filename: string = "resume.docx"
): Promise<void> {
  const children: (Paragraph)[] = [];

  // Header - Name
  if (data.basics?.name) {
    children.push(
      new Paragraph({
        text: data.basics.name,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
  }

  // Header - Title/Label
  if (data.basics?.label) {
    children.push(
      new Paragraph({
        text: data.basics.label,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: data.basics.label,
            color: "666666",
            size: 24,
          }),
        ],
      })
    );
  }

  // Contact Info
  const contactParts: string[] = [];
  if (data.basics?.email) contactParts.push(data.basics.email);
  if (data.basics?.phone) contactParts.push(data.basics.phone);
  if (data.basics?.location?.city) {
    const loc = data.basics.location;
    contactParts.push([loc.city, loc.country].filter(Boolean).join(", "));
  }

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        text: contactParts.join(" | "),
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 20,
          }),
        ],
      })
    );
  }

  // Summary
  if (data.basics?.summary) {
    children.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { color: "auto", size: 6, style: BorderStyle.SINGLE },
        },
      })
    );
    children.push(
      new Paragraph({
        text: data.basics.summary,
        spacing: { after: 200 },
      })
    );
  }

  // Work Experience
  if (data.work && data.work.length > 0) {
    children.push(
      new Paragraph({
        text: "Work Experience",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { color: "auto", size: 6, style: BorderStyle.SINGLE },
        },
      })
    );

    for (const job of data.work) {
      // Company and Position
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.position || "Position",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ` at ${job.company || "Company"}`,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );

      // Dates
      const dateStr = [job.startDate, job.endDate || "Present"]
        .filter(Boolean)
        .join(" - ");
      if (dateStr) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateStr,
                italics: true,
                color: "666666",
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      // Description
      if (job.summary) {
        children.push(
          new Paragraph({
            text: job.summary,
            spacing: { after: 100 },
          })
        );
      }

      // Highlights/Bullet points
      if (job.highlights && job.highlights.length > 0) {
        for (const highlight of job.highlights) {
          children.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        }
      }
    }
  }

  // Education
  if (data.education && data.education.length > 0) {
    children.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { color: "auto", size: 6, style: BorderStyle.SINGLE },
        },
      })
    );

    for (const edu of data.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [edu.studyType, edu.area].filter(Boolean).join(" in ") || "Degree",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.institution || "Institution",
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );

      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateStr,
                italics: true,
                color: "666666",
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    children.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { color: "auto", size: 6, style: BorderStyle.SINGLE },
        },
      })
    );

    for (const skill of data.skills) {
      const skillText = skill.keywords?.length
        ? `${skill.name}: ${skill.keywords.join(", ")}`
        : skill.name || "";

      if (skillText) {
        children.push(
          new Paragraph({
            text: skillText,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      }
    }
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    children.push(
      new Paragraph({
        text: "Languages",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { color: "auto", size: 6, style: BorderStyle.SINGLE },
        },
      })
    );

    for (const lang of data.languages) {
      const langText = lang.fluency
        ? `${lang.language} - ${lang.fluency}`
        : lang.language || "";

      if (langText) {
        children.push(
          new Paragraph({
            text: langText,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      }
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

// Print function
export function printResume(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Could not open print window");
  }

  // Get styles from the current document
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch {
        return "";
      }
    })
    .join("");

  // Write content to print window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Resume</title>
        <style>
          ${styles}
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
              margin: 0.5in;
              size: A4;
            }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}
