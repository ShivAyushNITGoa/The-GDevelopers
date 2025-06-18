/**
 * Cleanup script for The GDevelopers Portal
 * 
 * This script removes duplicate directories and streamlines the project structure.
 * It consolidates the best parts of each version into a single, coherent structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Utility functions to replace fs-extra functionality
const fsExtra = {
  // Recursive directory removal
  removeSync: function(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((file) => {
        const curPath = path.join(dirPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Recursive call
          this.removeSync(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  },
  
  // Recursive directory copy
  copySync: function(src, dest, options = {}) {
    const overwrite = options.overwrite || false;
    
    if (fs.existsSync(src)) {
      const stats = fs.statSync(src);
      
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const entries = fs.readdirSync(src);
        
        for (const entry of entries) {
          const srcPath = path.join(src, entry);
          const destPath = path.join(dest, entry);
          this.copySync(srcPath, destPath, options);
        }
      } else {
        // It's a file
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        if (!fs.existsSync(dest) || overwrite) {
          fs.copyFileSync(src, dest);
        }
      }
    }
  },
  
  // Ensure directory exists
  ensureDirSync: function(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
};

// Directories to be removed
const dirsToRemove = [
  'AlphaBetaGama',                 // Unnecessary directory
  'GDevelopers-Final',             // Will consolidate best parts
  'GDevelopers-New',               // Will consolidate best parts
  'src'                            // Old structure, migrated to apps/main
];

// Directories to be created if they don't exist
const dirsToCreate = [
  'docs',                          // Project documentation
  'scripts/cleanup'                // Cleanup scripts
];

// Files to keep from GDevelopers-New
const filesToKeepFromNew = [
  'apps/main/src/app/layout.tsx',
  'apps/main/src/app/page.tsx',
  'packages/ui/components/layout/Header.tsx',
  'packages/ui/components/layout/Footer.tsx',
  'packages/ui/components/ThemeToggle.tsx'
];

console.log('Starting cleanup process...');

// Function to safely remove directories
function removeDirectories() {
  console.log('Removing unnecessary directories...');
  
  dirsToRemove.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`Removing ${dir}...`);
      try {
        fsExtra.removeSync(dirPath);
        console.log(`✅ Successfully removed ${dir}`);
      } catch (err) {
        console.error(`❌ Error removing ${dir}:`, err);
      }
    } else {
      console.log(`Directory ${dir} does not exist, skipping...`);
    }
  });
}

// Function to create necessary directories
function createDirectories() {
  console.log('Creating necessary directories...');
  
  dirsToCreate.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating ${dir}...`);
      try {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Successfully created ${dir}`);
      } catch (err) {
        console.error(`❌ Error creating ${dir}:`, err);
      }
    } else {
      console.log(`Directory ${dir} already exists, skipping...`);
    }
  });
}

// Function to copy best components from GDevelopers-New
function copyBestComponents() {
  console.log('Copying best components from GDevelopers-New...');
  
  filesToKeepFromNew.forEach(file => {
    const sourcePath = path.join(__dirname, 'GDevelopers-New', file);
    const destPath = path.join(__dirname, file);
    
    // Ensure the destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(sourcePath)) {
      console.log(`Copying ${file}...`);
      try {
        fsExtra.copySync(sourcePath, destPath, { overwrite: true });
        console.log(`✅ Successfully copied ${file}`);
      } catch (err) {
        console.error(`❌ Error copying ${file}:`, err);
      }
    } else {
      console.error(`❌ Source file ${file} does not exist`);
    }
  });
}

// Function to integrate SEO components
function integrateSeoComponents() {
  console.log('Integrating SEO components...');
  
  // Check if layout-with-seo.tsx exists and rename it to layout.tsx
  const seoLayoutPath = path.join(__dirname, 'apps/main/src/app/layout-with-seo.tsx');
  const mainLayoutPath = path.join(__dirname, 'apps/main/src/app/layout.tsx');
  
  if (fs.existsSync(seoLayoutPath)) {
    console.log('Found layout-with-seo.tsx, using it as the main layout...');
    try {
      fsExtra.copySync(seoLayoutPath, mainLayoutPath, { overwrite: true });
      console.log('✅ Successfully integrated SEO layout');
    } catch (err) {
      console.error('❌ Error integrating SEO layout:', err);
    }
  }
}

// Function to cleanup package.json scripts
function cleanupPackageJson() {
  console.log('Cleaning up package.json...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  try {
    const packageJson = require(packageJsonPath);
    
    // Add missing scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      "cleanup": "node cleanup.js",
      "setup": "npm install && npm run build",
      "dev:all": "turbo dev",
      "build:all": "turbo build",
      "lint:all": "turbo lint"
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Successfully updated package.json');
  } catch (err) {
    console.error('❌ Error updating package.json:', err);
  }
}

// Main function to execute all cleanup steps
async function main() {
  try {
    // 1. Create backup
    console.log('Creating backup...');
    fsExtra.copySync(__dirname, path.join(__dirname, '../GDevelopers-Backup-' + Date.now()));
    
    // 2. Execute cleanup steps
    createDirectories();
    copyBestComponents();
    integrateSeoComponents();
    cleanupPackageJson();
    
    // 3. Remove directories at the end to avoid conflicts
    removeDirectories();
    
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run npm install to update dependencies');
    console.log('2. Run npm run dev:main to start the main app');
    console.log('3. Check that everything is working properly');
    
  } catch (err) {
    console.error('❌ An error occurred during cleanup:', err);
  }
}

// Execute main function
main(); 