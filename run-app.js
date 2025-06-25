const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting the GDevelopers web app...');
console.log('This might take a moment while dependencies are installed.');

// Change directory to the web app folder
const webAppDir = path.join(__dirname, 'apps', 'web');

// Run npm install if needed (in case node_modules doesn't exist)
if (!require('fs').existsSync(path.join(webAppDir, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  require('child_process').execSync('npm install', {
    cwd: webAppDir,
    stdio: 'inherit'
  });
}

// Run the Next.js development server
const nextDev = spawn('npx', ['next', 'dev'], {
  cwd: webAppDir,
  shell: true,
  stdio: 'inherit'
});

console.log('⚡ Server started! Access your app at http://localhost:3000');

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
});