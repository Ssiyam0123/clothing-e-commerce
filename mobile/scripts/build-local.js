const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.resolve(__dirname, '..');
const targetDir = 'D:\\clothing-mobile';

console.log('🔄 Syncing source changes to build directory...');
console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

function copyRecursive(src, dest) {
  const relative = path.relative(sourceDir, src);
  if (relative) {
    const parts = relative.split(path.sep);
    const excludeList = ['node_modules', 'android', '.expo', '.kotlin', 'build', '.git', '.gradle'];
    if (parts.some(part => excludeList.includes(part))) {
      return;
    }
  }

  let stats;
  try {
    stats = fs.lstatSync(src);
  } catch (err) {
    console.warn(`⚠️ Warning: Could not stat file/directory ${relative || 'root'}: ${err.message}`);
    return;
  }

  if (stats.isSymbolicLink()) {
    // Skip symbolic links to avoid link cycles or broken symlink errors
    return;
  }

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      try {
        fs.mkdirSync(dest, { recursive: true });
      } catch (err) {
        console.error(`❌ Failed to create directory ${dest}: ${err.message}`);
        return;
      }
    }
    let files;
    try {
      files = fs.readdirSync(src);
    } catch (err) {
      console.warn(`⚠️ Warning: Could not read directory ${relative}: ${err.message}`);
      return;
    }
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else if (stats.isFile()) {
    try {
      fs.copyFileSync(src, dest);
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to copy file ${relative}: ${err.message}`);
    }
  }
}

// Sync files recursively
copyRecursive(sourceDir, targetDir);
console.log('✅ Sync completed.');

// Check build type argument
const buildType = process.argv[2] || 'all'; // 'apk', 'aab', 'all'
const buildDir = path.join(targetDir, 'android');

if (!fs.existsSync(buildDir)) {
  console.log('🏗️ Android native folder not found. Re-generating using expo prebuild...');
  try {
    execSync('npx expo prebuild --platform android --no-install', {
      cwd: targetDir,
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('❌ Expo prebuild failed:', err.message);
    process.exit(1);
  }
}

// Compile
try {
  if (buildType === 'apk' || buildType === 'all') {
    console.log('🚀 Compiling APK (assembleRelease)...');
    execSync('.\\gradlew.bat assembleRelease', {
      cwd: buildDir,
      stdio: 'inherit'
    });
    console.log('✅ APK compiled successfully.');
    
    // Copy APK back to workspace
    const apkSource = path.join(buildDir, 'app/build/outputs/apk/release/app-release.apk');
    const apkDest = path.resolve(sourceDir, '../builds/app-release.apk');
    fs.mkdirSync(path.dirname(apkDest), { recursive: true });
    fs.copyFileSync(apkSource, apkDest);
    console.log(`💾 Saved APK to: ${apkDest}`);
  }

  if (buildType === 'aab' || buildType === 'all') {
    console.log('🚀 Compiling AAB Bundle (bundleRelease)...');
    execSync('.\\gradlew.bat bundleRelease', {
      cwd: buildDir,
      stdio: 'inherit'
    });
    console.log('✅ AAB Bundle compiled successfully.');
    
    // Copy AAB back to workspace
    const aabSource = path.join(buildDir, 'app/build/outputs/bundle/release/app-release.aab');
    const aabDest = path.resolve(sourceDir, '../builds/app-release.aab');
    fs.mkdirSync(path.dirname(aabDest), { recursive: true });
    fs.copyFileSync(aabSource, aabDest);
    console.log(`💾 Saved AAB to: ${aabDest}`);
  }
  
  console.log('\n🎉 Local build process finished successfully!');
} catch (err) {
  console.error('\n❌ Build execution failed. See output details above.');
  process.exit(1);
}
