/**
 * Documentation Generator for The GDevelopers Portal
 * 
 * This script generates documentation for all packages and apps in the monorepo.
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const config = {
  outputDir: 'docs/api',
  packages: [
    'ui',
    'accessibility',
    'seo',
    'performance',
    'i18n',
    'api',
    'caching',
    'ab-testing',
    'analytics'
  ],
  apps: [
    'main',
    'blog',
    'docs',
    'projects',
    'team',
    'contact',
    'auth'
  ]
};

// Create output directory if it doesn't exist
fs.ensureDirSync(path.join(__dirname, config.outputDir));

console.log('📚 Generating documentation for The GDevelopers Portal\n');

// Function to generate package documentation
function generatePackageDocs() {
  console.log('📦 Generating package documentation...\n');
  
  // Filter packages that exist
  const existingPackages = config.packages.filter(pkg => 
    fs.existsSync(path.join(__dirname, 'packages', pkg))
  );
  
  console.log(`Found ${existingPackages.length} packages to document: ${existingPackages.join(', ')}\n`);
  
  // Create output directory for packages
  const packagesOutputDir = path.join(__dirname, config.outputDir, 'packages');
  fs.ensureDirSync(packagesOutputDir);
  
  // Generate documentation for each package
  existingPackages.forEach(pkg => {
    console.log(`Generating documentation for ${pkg}...`);
    
    const packageDir = path.join(__dirname, 'packages', pkg);
    const outputDir = path.join(packagesOutputDir, pkg);
    fs.ensureDirSync(outputDir);
    
    try {
      execSync(`npx typedoc --out ${outputDir} --entryPointStrategy packages ${packageDir}/src/index.ts`, {
        stdio: 'inherit'
      });
      
      console.log(`✅ Documentation generated for ${pkg}`);
      
      // Copy README if it exists
      const readmePath = path.join(packageDir, 'README.md');
      if (fs.existsSync(readmePath)) {
        fs.copyFileSync(readmePath, path.join(outputDir, 'README.md'));
      }
    } catch (error) {
      console.error(`❌ Error generating documentation for ${pkg}:`, error.message);
    }
  });
}

// Function to generate app documentation
function generateAppDocs() {
  console.log('\n📱 Generating app documentation...\n');
  
  // Filter apps that exist
  const existingApps = config.apps.filter(app => 
    fs.existsSync(path.join(__dirname, 'apps', app))
  );
  
  console.log(`Found ${existingApps.length} apps to document: ${existingApps.join(', ')}\n`);
  
  // Create output directory for apps
  const appsOutputDir = path.join(__dirname, config.outputDir, 'apps');
  fs.ensureDirSync(appsOutputDir);
  
  // Generate documentation for each app
  existingApps.forEach(app => {
    console.log(`Generating documentation for ${app}...`);
    
    const appDir = path.join(__dirname, 'apps', app);
    const outputDir = path.join(appsOutputDir, app);
    fs.ensureDirSync(outputDir);
    
    try {
      // Create app documentation markdown
      const appDocPath = path.join(outputDir, 'README.md');
      
      // Get package.json for app info
      const packageJsonPath = path.join(appDir, 'package.json');
      let appName = app;
      let appDescription = '';
      let appDependencies = [];
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        appName = packageJson.name || app;
        appDescription = packageJson.description || '';
        appDependencies = Object.keys(packageJson.dependencies || {})
          .concat(Object.keys(packageJson.devDependencies || {}));
      }
      
      // Generate documentation content
      const docContent = `# ${appName}

${appDescription}

## Overview

This is the ${app} application in The GDevelopers Portal monorepo.

## Directory Structure

\`\`\`
${generateDirectoryTree(appDir, 2)}
\`\`\`

## Dependencies

${appDependencies.length > 0 ? appDependencies.map(dep => `- ${dep}`).join('\n') : 'No dependencies found.'}

## Running the App

\`\`\`bash
# From the root of the monorepo
npm run dev:${app}

# Or directly
cd apps/${app}
npm run dev
\`\`\`

## Building the App

\`\`\`bash
# From the root of the monorepo
npm run build -- --filter=${app}

# Or directly
cd apps/${app}
npm run build
\`\`\`
`;
      
      fs.writeFileSync(appDocPath, docContent);
      console.log(`✅ Documentation generated for ${app}`);
    } catch (error) {
      console.error(`❌ Error generating documentation for ${app}:`, error.message);
    }
  });
}

// Function to generate directory tree
function generateDirectoryTree(dir, depth = 2, currentDepth = 0) {
  if (currentDepth >= depth) return '';
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let tree = '';
  
  items.forEach(item => {
    // Skip node_modules and hidden files/folders
    if (item.name === 'node_modules' || item.name.startsWith('.')) return;
    
    const indent = '  '.repeat(currentDepth);
    
    if (item.isDirectory()) {
      tree += `${indent}${item.name}/\n`;
      
      const subTree = generateDirectoryTree(
        path.join(dir, item.name),
        depth,
        currentDepth + 1
      );
      
      if (subTree) {
        tree += subTree;
      }
    } else {
      tree += `${indent}${item.name}\n`;
    }
  });
  
  return tree;
}

// Function to generate main documentation
function generateMainDocs() {
  console.log('\n📄 Generating main documentation...\n');
  
  const outputPath = path.join(__dirname, config.outputDir, 'index.html');
  
  // Create index.html
  const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The GDevelopers Portal - Documentation</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">The GDevelopers Portal</h1>
      <p class="text-lg text-gray-600">API Documentation and Developer Resources</p>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Packages</h2>
        <ul class="space-y-2">
          ${config.packages.filter(pkg => 
            fs.existsSync(path.join(__dirname, 'packages', pkg))
          ).map(pkg => `
            <li>
              <a href="packages/${pkg}/index.html" class="text-blue-600 hover:underline">${pkg}</a>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Applications</h2>
        <ul class="space-y-2">
          ${config.apps.filter(app => 
            fs.existsSync(path.join(__dirname, 'apps', app))
          ).map(app => `
            <li>
              <a href="apps/${app}/README.md" class="text-blue-600 hover:underline">${app}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
      <p class="mb-4">The GDevelopers Portal is a monorepo containing multiple applications and shared packages.</p>
      
      <h3 class="text-lg font-bold text-gray-900 my-2">Running the Development Server</h3>
      <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">npm run dev</pre>
      
      <h3 class="text-lg font-bold text-gray-900 my-2">Building for Production</h3>
      <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">npm run build</pre>
    </div>
    
    <footer class="mt-12 text-center text-gray-600 text-sm">
      <p>Generated on ${new Date().toLocaleString()}</p>
    </footer>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(outputPath, indexContent);
  console.log('✅ Main documentation page generated');
}

// Main function
async function main() {
  try {
    // Generate documentation
    generatePackageDocs();
    generateAppDocs();
    generateMainDocs();
    
    console.log('\n✅ Documentation generation complete!');
    console.log(`Documentation is available at: ${path.join(__dirname, config.outputDir, 'index.html')}`);
  } catch (error) {
    console.error('\n❌ Error generating documentation:', error);
  }
}

// Run main function
main(); 