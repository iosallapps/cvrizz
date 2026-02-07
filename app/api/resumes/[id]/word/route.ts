import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateWordDocument, sanitizeFilename } from "@/lib/export/word";
import type { ResumeData } from "@/types/resume";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch resume with ownership check
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Convert DB data to ResumeData format
    const resumeData: ResumeData = {
      basics: resume.basics as unknown as ResumeData["basics"],
      work: (resume.work as unknown as ResumeData["work"]) || [],
      education: (resume.education as unknown as ResumeData["education"]) || [],
      skills: (resume.skills as unknown as ResumeData["skills"]) || [],
      languages: ((resume as any).languages as unknown as ResumeData["languages"]) || [],
      projects: ((resume as any).projects as unknown as ResumeData["projects"]) || [],
    };

    // Generate Word document
    const blob = await generateWordDocument(resumeData);

    // Create safe filename
    const filename = sanitizeFilename(resume.title || "resume") + ".docx";

    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Word export failed:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
