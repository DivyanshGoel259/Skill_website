import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const skillsDirectory = path.join(process.cwd(), 'skills');

export interface SkillData {
  slug: string;
  title: string;
  description: string;
  category: string;
  installCommand?: string;
  content: string;
  files: string[];
  dirPath: string;
}

function getFilesInDirectory(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFilesInDirectory(fullPath, baseDir));
    } else {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

export function getAllSkills(): SkillData[] {
  if (!fs.existsSync(skillsDirectory)) {
    return [];
  }
  
  const filePaths = fs.readdirSync(skillsDirectory, { recursive: true }) as string[];
  
  const allSkillsData = filePaths
    .filter((filePath) => filePath.endsWith('.md'))
    // Identify just the main SKILL.md or top level files as the primary skill entry
    .filter((filePath) => filePath.endsWith('SKILL.md') || (!filePath.includes('/') && !filePath.includes('\\')))
    .filter((filePath) => !filePath.toUpperCase().includes('AGENT-SKILL-MAP'))
    .map((filePath) => {
      const fullPath = path.join(skillsDirectory, filePath);
      const normalizedPath = filePath.replace(/\\/g, '/');
      const pathParts = normalizedPath.split('/');
      
      const fileName = pathParts[pathParts.length - 1];
      const categoryFromFolder = pathParts.length > 1 ? pathParts[0] : 'Uncategorized';
      
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      let matterResult: { data: { [key: string]: any }, content: string };
      try {
        matterResult = matter(fileContents);
      } catch (err) {
        console.warn(`[Skipping Frontmatter] Invalid YAML in ${fullPath}`);
        matterResult = { data: {}, content: fileContents };
      }
      
      const frontmatterName = matterResult.data.name || matterResult.data.title;
      
      const defaultSlug = fileName === 'SKILL.md' && pathParts.length >= 2
        ? pathParts[pathParts.length - 2]
        : fileName.replace(/\.md$/, '');
        
      const slug = frontmatterName 
        ? frontmatterName.toLowerCase().replace(/\s+/g, '-') 
        : defaultSlug;

      const parentDir = path.dirname(fullPath);
      let skillFiles: string[] = [];
      try {
        skillFiles = getFilesInDirectory(parentDir);
      } catch (e) {
        skillFiles = [fileName];
      }

      return {
        slug,
        title: frontmatterName || defaultSlug,
        description: matterResult.data.description || 'No description provided.',
        category: matterResult.data.category || categoryFromFolder.charAt(0).toUpperCase() + categoryFromFolder.slice(1),
        installCommand: matterResult.data.installCommand || `npx @cutdnoise/add-skill ${slug}`,
        content: matterResult.content,
        files: skillFiles,
        dirPath: parentDir.replace(/\\/g, '/'),
      };
    })
    .filter(skill => skill.slug !== 'agent-skill-map' && skill.slug !== 'readme' && skill.content.trim().length > 0);

  const uniqueSkillsMap = new Map();
  for (const skill of allSkillsData) {
    if (!uniqueSkillsMap.has(skill.slug)) {
      uniqueSkillsMap.set(skill.slug, skill);
    }
  }

  return Array.from(uniqueSkillsMap.values());
}
