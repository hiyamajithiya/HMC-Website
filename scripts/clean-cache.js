/**
 * Cache Cleaning Utility for Next.js
 * Handles cache cleanup to prevent corruption issues
 * Works cross-platform (Windows/Linux/Mac)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');

// Directories to clean
const CACHE_DIRS = [
  '.next',                    // Next.js build cache
  'node_modules/.cache',      // Various package caches
  '.turbo',                   // Turbo cache (if using turborepo)
];

// Files to clean
const CACHE_FILES = [
  'tsconfig.tsbuildinfo',     // TypeScript incremental build info
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };

  const prefix = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗'
  };

  console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
}

function removeDir(dirPath) {
  const fullPath = path.join(ROOT_DIR, dirPath);

  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      log(`Removed: ${dirPath}`, 'success');
      return true;
    } catch (error) {
      // On Windows, sometimes files are locked - try alternative method
      if (process.platform === 'win32') {
        try {
          execSync(`rmdir /s /q "${fullPath}"`, { stdio: 'ignore' });
          log(`Removed: ${dirPath} (using rmdir)`, 'success');
          return true;
        } catch (e) {
          log(`Failed to remove: ${dirPath} - ${error.message}`, 'error');
          return false;
        }
      }
      log(`Failed to remove: ${dirPath} - ${error.message}`, 'error');
      return false;
    }
  } else {
    log(`Skipped: ${dirPath} (not found)`, 'info');
    return true;
  }
}

function removeFile(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      log(`Removed: ${filePath}`, 'success');
      return true;
    } catch (error) {
      log(`Failed to remove: ${filePath} - ${error.message}`, 'error');
      return false;
    }
  } else {
    log(`Skipped: ${filePath} (not found)`, 'info');
    return true;
  }
}

function regeneratePrisma() {
  log('Regenerating Prisma client...', 'info');
  try {
    execSync('npx prisma generate', {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
    log('Prisma client regenerated', 'success');
    return true;
  } catch (error) {
    log(`Failed to regenerate Prisma client: ${error.message}`, 'error');
    return false;
  }
}

async function main() {
  console.log('\n🧹 Next.js Cache Cleaner\n');
  console.log('─'.repeat(40));

  let success = true;

  // Clean directories
  log('Cleaning cache directories...', 'info');
  for (const dir of CACHE_DIRS) {
    if (!removeDir(dir)) {
      success = false;
    }
  }

  // Clean files
  log('Cleaning cache files...', 'info');
  for (const file of CACHE_FILES) {
    if (!removeFile(file)) {
      success = false;
    }
  }

  console.log('─'.repeat(40));

  // Check if --prisma flag is passed
  const shouldRegeneratePrisma = process.argv.includes('--prisma');

  if (shouldRegeneratePrisma) {
    if (!regeneratePrisma()) {
      success = false;
    }
  }

  console.log('─'.repeat(40));

  if (success) {
    log('Cache cleaned successfully!', 'success');
  } else {
    log('Cache cleaned with some errors', 'warning');
  }

  console.log('\n');

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

main();
