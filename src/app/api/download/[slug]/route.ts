import { getAllSkills } from "@/lib/skills";
import { notFound } from "next/navigation";
import jszip from "jszip";
import fs from "fs";
import path from "path";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skills = getAllSkills();
  const skill = skills.find((s) => s.slug === slug);

  if (!skill) {
    return new Response("Not found", { status: 404 });
  }

  const zip = new jszip();
  
  // Recursively add all files from the skill directory
  try {
    for (const relativePath of skill.files) {
      const absolutePath = path.join(skill.dirPath, relativePath);
      if (fs.existsSync(absolutePath)) {
        const fileData = fs.readFileSync(absolutePath);
        zip.file(relativePath, fileData);
      }
    }
    
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    
    return new Response(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${skill.slug}-skill.zip"`,
      },
    });
  } catch (error) {
    console.error("Zip generation error:", error);
    return new Response("Error generating zip", { status: 500 });
  }
}
