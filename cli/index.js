#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');

const skillName = process.argv[2];

if (!skillName) {
  console.error("❌ Error: Please provide a skill name!");
  console.error("📝 Example: npx @divyanshgoel/add-skill chief-of-staff");
  process.exit(1);
}

console.log(`✨ Fetching skill bundle: ${skillName}...`);

// Use the API route that streams the zip file dynamically
const API_URL = `https://skills-anthropic.vercel.app/api/download/${skillName}`;

// Core Logic Strategy: Check for existing .claude folder
const currentDir = process.cwd();
const hasClaudeFolder = fs.existsSync(path.join(currentDir, '.claude'));

// If .claude exists, put skills inside .claude/skills. Otherwise just put it in /skills.
const targetBaseDir = hasClaudeFolder 
  ? path.join(currentDir, '.claude', 'skills') 
  : path.join(currentDir, 'skills');

if (!fs.existsSync(targetBaseDir)) {
  fs.mkdirSync(targetBaseDir, { recursive: true });
}

// Ensure the specific skill directory name exists
const targetDir = path.join(targetBaseDir, skillName);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const tempZipPath = path.join(currentDir, `${skillName}-temp.zip`);

const request = https.get(API_URL, (response) => {
  if (response.statusCode === 404) {
    console.error(`❌ Skill '${skillName}' not found. Please verify the exact name on the directory.`);
    process.exit(1);
  }
  
  if (response.statusCode !== 200) {
    console.error(`❌ Failed to download skill. Server responded with status: ${response.statusCode}`);
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(tempZipPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    
    try {
      console.log(`📦 Unpacking files into: ${path.relative(currentDir, targetDir)}/ ...`);
      
      const zip = new AdmZip(tempZipPath);
      // Extract the payload directly into the target folder
      zip.extractAllTo(targetDir, true);
      
      // Delete temporary zip
      fs.unlinkSync(tempZipPath);
      
      console.log(`\n✅ Successfully installed '${skillName}'!`);
      console.log(`📂 Location: ${path.relative(currentDir, targetDir)}`);
      console.log(`💡 Tip: You can now review the SKILL.md and raw scripts locally.`);
    } catch (err) {
      console.error(`❌ Error extracting skill: ${err.message}`);
      if(fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
    }
  });
}).on('error', (err) => {
  console.error(`❌ Error connecting to server: ${err.message}`);
});
