import fs from 'fs';
import path from 'path';

// Usage: node scripts/bump_version.js [newVersion | patch | minor | major]
const arg = process.argv[2] || 'patch';

const packageJsonPath = path.resolve('package.json');
const tauriConfPath = path.resolve('src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve('src-tauri/Cargo.toml');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = pkg.version;

let newVersion = arg;

if (['patch', 'minor', 'major'].includes(arg)) {
  const parts = currentVersion.split('.').map(Number);
  if (arg === 'patch') parts[2] = (parts[2] || 0) + 1;
  if (arg === 'minor') { parts[1] = (parts[1] || 0) + 1; parts[2] = 0; }
  if (arg === 'major') { parts[0] = (parts[0] || 0) + 1; parts[1] = 0; parts[2] = 0; }
  newVersion = parts.join('.');
}

console.log(`Bumping version: ${currentVersion} -> ${newVersion}`);

// 1. Update package.json
pkg.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Updated package.json to ${newVersion}`);

// 2. Update src-tauri/tauri.conf.json
if (fs.existsSync(tauriConfPath)) {
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
  tauriConf.version = newVersion;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
  console.log(`Updated src-tauri/tauri.conf.json to ${newVersion}`);
}

// 3. Update src-tauri/Cargo.toml
if (fs.existsSync(cargoTomlPath)) {
  let cargoContent = fs.readFileSync(cargoTomlPath, 'utf8');
  cargoContent = cargoContent.replace(/^version\s*=\s*"[^"]+"/m, `version = "${newVersion}"`);
  fs.writeFileSync(cargoTomlPath, cargoContent);
  console.log(`Updated src-tauri/Cargo.toml to ${newVersion}`);
}

// 4. Update src/components/Header.tsx
const headerPath = path.resolve('src/components/Header.tsx');
if (fs.existsSync(headerPath)) {
  let headerContent = fs.readFileSync(headerPath, 'utf8');
  headerContent = headerContent.replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`);
  fs.writeFileSync(headerPath, headerContent);
  console.log(`Updated src/components/Header.tsx to v${newVersion}`);
}

console.log(`\nVersion successfully synchronized across all files: v${newVersion}`);
