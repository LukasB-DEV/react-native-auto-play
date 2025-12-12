const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const patchesDir = 'patches';
const allPatches = fs.readdirSync(patchesDir).filter((f) => f.endsWith('.patch'));

// Extract package names from patch files (e.g. "expo-splash-screen+1.0.0.patch" → "expo-splash-screen")
const packageNames = allPatches.map((f) => f.split('+')[0]);
const uniquePackages = [...new Set(packageNames)];

const missingPackages = [];
const renamedPatches = [];

// Check which packages are missing
uniquePackages.forEach((pkg) => {
  if (!fs.existsSync(`node_modules/${pkg}`)) {
    missingPackages.push(pkg);
  }
});

console.log('ignoring patches for missing packages:', missingPackages);

// Rename patches for ALL missing packages
if (missingPackages.length > 0) {
  allPatches.forEach((patchFile) => {
    const pkgName = patchFile.split('+')[0];
    if (missingPackages.includes(pkgName)) {
      const oldPath = path.join(patchesDir, patchFile);
      const newPath = path.join(patchesDir, `${patchFile}.bak`);
      fs.renameSync(oldPath, newPath);
      renamedPatches.push(patchFile);
    }
  });
}

try {
  execSync('npx patch-package', { stdio: 'inherit' });
} finally {
  // Restore all renamed patches
  if (renamedPatches.length > 0) {
    renamedPatches.forEach((patchFile) => {
      const oldPath = path.join(patchesDir, `${patchFile}.bak`);
      const newPath = path.join(patchesDir, patchFile);
      fs.renameSync(oldPath, newPath);
    });
    console.log('Restored all skipped patches');
  }
}
