import fs from 'fs';
import path from 'path';

// Get new version from first argument
const newVersion = process.argv[2];

if(!newVersion) {
  console.error('Please provide new version as first argument');
  process.exit(1);
}

// Root package.json
for (const pkg of ['./package.json', './packages/chain-list/package.json']) {
  const pkgContent = JSON.parse(fs.readFileSync(pkg, 'utf-8'));
  pkgContent.version = newVersion;
  fs.writeFileSync(pkg, JSON.stringify(pkgContent, null, 2));
}

// Rest same as previous script

console.log('Updated version to ' + newVersion);
