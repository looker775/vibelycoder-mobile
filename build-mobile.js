// build-mobile.js

require('dotenv').config(); // ✅ Load environment variables from .env at the top

const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

// === 📁 Environment Variables ===
const repoUrl = process.env.MOBILE_GITHUB_REPO_URL;
const repoName = process.env.MOBILE_REPO_NAME || 'vibelycoder-mobile';
const branch = process.env.MOBILE_GITHUB_BRANCH || 'main';

// === 🗂️ Temp folder to clone repo into
const localPath = path.join(__dirname, 'temp-mobile');

async function buildMobile() {
  const git = simpleGit();

  try {
    console.log("📦 Preparing mobile project...");

    // 🧹 Clean previous clone if exists
    await fs.remove(localPath);

    // ⬇️ Clone GitHub repo
    console.log("⬇️ Cloning mobile repo...");
    await git.clone(repoUrl, localPath, ['--branch', branch]);

    // ✍️ Inject new UI into index.tsx
    const targetFile = path.join(localPath, 'app', '(tabs)', 'index.tsx');
    const userCode = `
      import { Text, View } from 'react-native';

      export default function Page() {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Hello from AI-generated mobile UI 🎉</Text>
          </View>
        );
      }
    `;

    await fs.writeFile(targetFile, userCode.trim());
    console.log("✅ UI updated in index.tsx");

    // 💾 Commit and push changes
    const projectGit = simpleGit(localPath);
    await projectGit.add('.');
    await projectGit.commit('🤖 Auto-update mobile UI from VibelyCoder');
    await projectGit.push('origin', branch);
    console.log("🚀 Changes pushed to GitHub!");

  } catch (err) {
    console.error("❌ Mobile build failed:", err.message);
  }
}

buildMobile();
