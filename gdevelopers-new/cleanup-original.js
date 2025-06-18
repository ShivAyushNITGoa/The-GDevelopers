/**
 * Cleanup script for The GDevelopers project
 * 
 * This script will delete the old project structure after migrating to the new structure.
 * Run with caution as it permanently deletes files.
 */

const fs = require('fs');
const path = require('path');

// Function to log with colors
const log = {
  info: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`),
};

// Ask for confirmation
log.warning('WARNING: This script will delete all original files from The GDevelopers project.');
log.warning('Please make sure you have backed up any important files before proceeding.');
log.info('The new project structure has been created in the gdevelopers-new directory.');
log.info('');
log.info('To proceed with cleanup, run: node cleanup-original.js --confirm');

// Only proceed if explicitly confirmed
if (process.argv.includes('--confirm')) {
  try {
    log.info('Starting cleanup process...');
    
    // Get the parent directory (The GDevelopers)
    const parentDir = path.resolve(__dirname, '..');
    
    // List of directories and files to delete (excluding the new directory)
    const excludeList = ['gdevelopers-new', 'node_modules', '.git'];
    
    // Read directory contents
    const items = fs.readdirSync(parentDir);
    
    // Delete each item except those in exclude list
    items.forEach(item => {
      if (!excludeList.includes(item)) {
        const itemPath = path.join(parentDir, item);
        try {
          const isDirectory = fs.statSync(itemPath).isDirectory();
          
          if (isDirectory) {
            log.info(`Deleting directory: ${item}`);
            fs.rmSync(itemPath, { recursive: true, force: true });
          } else {
            log.info(`Deleting file: ${item}`);
            fs.unlinkSync(itemPath);
          }
        } catch (err) {
          log.error(`Error processing ${item}: ${err.message}`);
        }
      }
    });
    
    log.success('Cleanup completed successfully!');
    log.info('The old GDevelopers project has been removed.');
    log.info('The new project structure is in the gdevelopers-new directory.');
    
  } catch (error) {
    log.error(`An error occurred during cleanup: ${error.message}`);
    process.exit(1);
  }
} else {
  log.warning('Cleanup aborted. Use --confirm flag to proceed with deletion.');
} 