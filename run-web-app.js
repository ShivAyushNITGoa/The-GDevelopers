const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting the GDevelopers web app...');

// Path to the web app
const webAppDir = path.join(__dirname, 'gdevelopers-new', 'apps', 'web');

// Run the Next.js development server
console.log(`Starting Next.js dev server in ${webAppDir}`);
const nextDev = spawn('npx', ['next', 'dev'], {
  cwd: webAppDir,
  shell: true,
  stdio: 'inherit'
});

console.log('⚡ Server starting! You will be able to access your app at http://localhost:3000');

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
}); 