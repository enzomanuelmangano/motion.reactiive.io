const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceFile = path.join(__dirname, '..', 'public', 'canvaskit.wasm');
const destDir = path.join(__dirname, '..', 'dist', '_expo', 'static', 'js', 'web');
const destFile = path.join(destDir, 'canvaskit.wasm');

// Create destination directory if it doesn't exist
try {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created destination directory:', destDir);
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating directory:', err);
    process.exit(1);
  }
}

// Copy the file
try {
  fs.copyFileSync(sourceFile, destFile);
  console.log('Successfully copied canvaskit.wasm to:', destFile);
} catch (err) {
  console.error('Error copying file:', err);
  process.exit(1);
}
