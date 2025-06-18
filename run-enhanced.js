/**
 * Enhanced Development Environment Runner
 * 
 * This script sets up and runs the enhanced development environment
 * for The GDevelopers Portal.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const config = {
  apps: ['main', 'blog', 'docs', 'projects', 'team', 'contact'],
  defaultApp: 'main',
  ports: {
    main: 3000,
    blog: 3001,
    docs: 3002,
    projects: 3003,
    team: 3004,
    contact: 3005
  }
};

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check if app directory exists
function appExists(app) {
  return fs.existsSync(path.join(__dirname, 'apps', app));
}

// Function to run a specific app
function runApp(app) {
  if (!appExists(app)) {
    console.log(`❌ App '${app}' does not exist.`);
    showAppOptions();
    return;
  }

  const port = config.ports[app] || 3000;
  console.log(`\n🚀 Starting ${app} app on port ${port}...\n`);
  
  try {
    execSync(`cd apps/${app} && npm run dev -- -p ${port}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Error starting ${app} app:`, error.message);
    process.exit(1);
  }
}

// Function to run all apps
function runAllApps() {
  console.log('\n🚀 Starting all available apps...\n');
  
  try {
    execSync('npm run dev:all', { stdio: 'inherit' });
  } catch (error) {
    console.error('\n❌ Error starting apps:', error.message);
    process.exit(1);
  }
}

// Function to check the project structure
function checkProjectStructure() {
  console.log('\n🔍 Checking project structure...\n');
  
  // Count how many apps exist
  const existingApps = config.apps.filter(app => appExists(app));
  console.log(`Found ${existingApps.length} app(s): ${existingApps.join(', ')}`);
  
  // Check for required packages
  const requiredPackages = ['ui', 'seo', 'accessibility', 'performance'];
  const existingPackages = requiredPackages.filter(pkg => 
    fs.existsSync(path.join(__dirname, 'packages', pkg))
  );
  
  console.log(`Found ${existingPackages.length}/${requiredPackages.length} required packages: ${existingPackages.join(', ')}`);
  
  const missingPackages = requiredPackages.filter(pkg => !existingPackages.includes(pkg));
  if (missingPackages.length > 0) {
    console.log(`\n⚠️ Missing packages: ${missingPackages.join(', ')}`);
    console.log('Some features may not work correctly.');
  }
  
  return {
    apps: existingApps,
    packages: existingPackages,
    missingPackages
  };
}

// Function to show app options
function showAppOptions() {
  console.log('\n📱 Available apps:');
  
  // Get existing apps
  const existingApps = config.apps.filter(app => appExists(app));
  
  existingApps.forEach((app, index) => {
    console.log(`${index + 1}. ${app} (port: ${config.ports[app]})`);
  });
  
  console.log('a. Run all apps');
  console.log('q. Quit');
  
  rl.question('\nSelect an option: ', (answer) => {
    if (answer.toLowerCase() === 'q') {
      console.log('\n👋 Goodbye!');
      rl.close();
      return;
    }
    
    if (answer.toLowerCase() === 'a') {
      rl.close();
      runAllApps();
      return;
    }
    
    const appIndex = parseInt(answer) - 1;
    if (isNaN(appIndex) || appIndex < 0 || appIndex >= existingApps.length) {
      console.log('\n❌ Invalid option. Please try again.');
      showAppOptions();
      return;
    }
    
    rl.close();
    runApp(existingApps[appIndex]);
  });
}

// Main function
function main() {
  console.log('🚀 Enhanced Development Environment\n');
  
  // Check project structure
  const structure = checkProjectStructure();
  
  if (structure.apps.length === 0) {
    console.log('\n❌ No apps found. Please check your project structure.');
    process.exit(1);
  }
  
  // Show options menu
  showAppOptions();
}

// Run the main function
main(); 