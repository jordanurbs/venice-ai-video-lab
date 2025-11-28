#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG_FILE = 'config.json';
const VIDEOS_DIR = 'videos';
const TEMPLATES_DIR = 'templates';
const OUTPUT_DIR = 'site';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to read ${filePath}: ${err.message}`);
  }
}

function readTemplate(templateName) {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!fileExists(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fileExists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyFile(source, dest) {
  const dir = path.dirname(dest);
  if (!fileExists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(source, dest);
}

// ============================================================================
// GENERATION TIME UTILITIES
// ============================================================================

function calculateAverageTime(sceneVideos) {
  const times = Object.values(sceneVideos)
    .map(v => v.generationTime)
    .filter(t => t !== null && t !== undefined);
  if (times.length === 0) return null;
  return times.reduce((sum, t) => sum + t, 0) / times.length;
}

function findFastestModel(sceneVideos) {
  let fastest = null;
  let minTime = Infinity;
  Object.entries(sceneVideos).forEach(([modelId, data]) => {
    if (data.generationTime && data.generationTime < minTime) {
      minTime = data.generationTime;
      fastest = modelId;
    }
  });
  return fastest;
}

function findSlowestModel(sceneVideos) {
  let slowest = null;
  let maxTime = -Infinity;
  Object.entries(sceneVideos).forEach(([modelId, data]) => {
    if (data.generationTime && data.generationTime > maxTime) {
      maxTime = data.generationTime;
      slowest = modelId;
    }
  });
  return slowest;
}

function calculateModelStats(config, videoData) {
  const stats = {};

  config.models.forEach(model => {
    const times = [];
    videoData.scenes.forEach(scene => {
      const videoInfo = scene.videos[model.id];
      if (videoInfo && videoInfo.generationTime) {
        times.push(videoInfo.generationTime);
      }
    });

    stats[model.id] = {
      name: model.name,
      avgTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null,
      minTime: times.length > 0 ? Math.min(...times) : null,
      maxTime: times.length > 0 ? Math.max(...times) : null,
      scenesCompleted: times.length,
      totalScenes: config.scenes.length
    };
  });

  return stats;
}

// ============================================================================
// VIDEO SCANNING
// ============================================================================

function scanVideosDirectory(config) {
  log('Scanning videos directory...', 'info');

  const videoData = {
    scenes: [],
    warnings: [],
    totalVideos: 0
  };

  // Check if videos directory exists
  if (!fileExists(VIDEOS_DIR)) {
    throw new Error(`Videos directory not found: ${VIDEOS_DIR}`);
  }

  // Process each scene from config
  config.scenes.forEach((scene, index) => {
    const sceneFolder = path.join(VIDEOS_DIR, scene.folder);

    // Check if scene folder exists
    if (!fileExists(sceneFolder)) {
      videoData.warnings.push(`Scene folder not found: ${scene.folder}`);
      return;
    }

    // Find videos in scene folder
    const files = fs.readdirSync(sceneFolder);

    // FIX: Use actual filenames from disk instead of modifying them in memory
    // Venice exports videos without .mp4 extensions (e.g., "Wan 2.5 Preview  136.68s")
    // Previously, code appended .mp4 in memory, but files on disk had no extension → 404 errors
    // Now: Accept files AS-IS whether they have .mp4/.mov or no extension
    const videoFiles = files
      .filter(f => {
        // Skip system/hidden files
        if (f.startsWith('.') || f === 'README.md') return false;

        // Accept files with video extensions
        if (f.match(/\.(mp4|mov)$/i)) return true;

        // Accept files with no extension (Venice downloads without .mp4)
        // Check: no extension means no dot, or ends with 's' (generation time format like "136.68s")
        if (!f.includes('.') || f.match(/\d+\.?\d*s$/i)) return true;

        return false;
      });

    if (videoFiles.length === 0) {
      videoData.warnings.push(`No video files found in: ${scene.folder}`);
      return;
    }

    // Debug logging: show detected videos
    log(`  Found ${videoFiles.length} video(s) in ${scene.folder}:`, 'info');
    videoFiles.forEach(f => {
      const hasExt = f.match(/\.(mp4|mov)$/i);
      log(`    ${hasExt ? '✓' : '○'} ${f}${hasExt ? '' : ' (no extension)'}`, 'info');
    });

    // Match videos to models
    const sceneVideos = {};
    const foundModels = new Set();

    config.models.forEach(model => {
      // Try to find video file for this model (enhanced fuzzy matching)
      const videoFile = videoFiles.find(file => {
        // Remove time pattern (e.g., "192.79s") and extension for matching
        // Handle both "136.68s.mp4" and "136.68s" (no extension)
        const nameWithoutExt = file
          .replace(/\s+\d+\.?\d*\s*s(?:\.(mp4|mov))?$/i, '')
          .toLowerCase();
        const modelId = model.id.toLowerCase();
        const modelName = model.name.toLowerCase();

        // Priority matching:
        // 1. Exact model ID match
        if (nameWithoutExt === modelId) return true;

        // 2. Model name substring match (handles full names like "Wan 2.5 Preview")
        if (nameWithoutExt.includes(modelName.replace(/\s+/g, ' '))) return true;

        // 3. Model ID substring match (fallback)
        if (nameWithoutExt.includes(modelId)) return true;

        return false;
      });

      if (videoFile) {
        // Parse generation time from filename
        // Handles both "192.79s.mp4" and "192.79s" (no extension)
        const timeMatch = videoFile.match(/\s+(\d+\.?\d*)\s*s(?:\.(mp4|mov))?$/i);
        const generationTime = timeMatch ? parseFloat(timeMatch[1]) : null;

        sceneVideos[model.id] = {
          filename: videoFile,
          generationTime: generationTime
        };
        foundModels.add(model.id);
        videoData.totalVideos++;
      }
    });

    // Warning if scene is missing models
    const missingModels = config.models.filter(m => !foundModels.has(m.id));
    if (missingModels.length > 0) {
      videoData.warnings.push(
        `Scene "${scene.title}" missing models: ${missingModels.map(m => m.name).join(', ')}`
      );
    }

    videoData.scenes.push({
      id: `scene-${index + 1}`,
      ...scene,
      sceneNumber: index + 1,
      videos: sceneVideos,
      modelCount: Object.keys(sceneVideos).length,
      avgGenerationTime: calculateAverageTime(sceneVideos),
      fastestModel: findFastestModel(sceneVideos),
      slowestModel: findSlowestModel(sceneVideos)
    });
  });

  return videoData;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateConfig(config) {
  log('Validating configuration...', 'info');

  const errors = [];

  // Check required fields
  if (!config.title) errors.push('Missing required field: title');
  if (!config.scenes || !Array.isArray(config.scenes)) errors.push('Missing or invalid field: scenes');
  if (!config.models || !Array.isArray(config.models)) errors.push('Missing or invalid field: models');

  // Validate scenes
  if (config.scenes) {
    config.scenes.forEach((scene, i) => {
      if (!scene.title) errors.push(`Scene ${i + 1}: missing title`);
      if (!scene.folder) errors.push(`Scene ${i + 1}: missing folder`);
    });
  }

  // Validate models
  if (config.models) {
    const modelIds = new Set();
    config.models.forEach((model, i) => {
      if (!model.id) errors.push(`Model ${i + 1}: missing id`);
      if (!model.name) errors.push(`Model ${i + 1}: missing name`);

      // Check for duplicate IDs
      if (model.id) {
        if (modelIds.has(model.id)) {
          errors.push(`Model ${i + 1}: duplicate id "${model.id}"`);
        }
        modelIds.add(model.id);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error('Configuration validation failed:\n  ' + errors.join('\n  '));
  }

  log(`Found ${config.scenes.length} scenes, ${config.models.length} models`, 'success');
}

// ============================================================================
// TEMPLATE PROCESSING
// ============================================================================

function generateVideoFileMapping(videoData) {
  const mapping = {};

  videoData.scenes.forEach(scene => {
    mapping[scene.id] = {};
    Object.entries(scene.videos).forEach(([modelId, videoInfo]) => {
      // Store the entire video object (filename + generationTime)
      mapping[scene.id][modelId] = videoInfo;
    });
  });

  return JSON.stringify(mapping, null, 2);
}

function generateSceneConfig(config, videoData) {
  const sceneConfig = {};

  videoData.scenes.forEach(scene => {
    sceneConfig[scene.id] = {
      id: scene.id,
      title: scene.title,
      folder: scene.folder,
      description: scene.description || '',
      sceneNumber: scene.sceneNumber,
      models: Object.keys(scene.videos)
    };
  });

  return JSON.stringify(sceneConfig, null, 2);
}

function generateModelNames(config) {
  const modelNames = {};
  config.models.forEach(model => {
    modelNames[model.id] = model.name;
  });
  return JSON.stringify(modelNames, null, 2);
}

function processTemplate(template, replacements) {
  let result = template;
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
}

// ============================================================================
// SITE GENERATION
// ============================================================================

function generateSite(config, videoData) {
  log('Generating site...', 'info');

  // Create output directory
  if (!fileExists(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Create grids subdirectory
  const gridsDir = path.join(OUTPUT_DIR, 'grids');
  if (!fileExists(gridsDir)) {
    fs.mkdirSync(gridsDir, { recursive: true });
  }

  // Generate shared replacements
  const sharedReplacements = {
    PROJECT_TITLE: config.title,
    SCENE_COUNT: videoData.scenes.length,
    MODEL_COUNT: config.models.length,
    TOTAL_VIDEOS: videoData.totalVideos,
    VIDEO_FILE_MAPPING: generateVideoFileMapping(videoData),
    SCENE_CONFIG: generateSceneConfig(config, videoData),
    MODEL_NAMES: generateModelNames(config)
  };

  // Generate index.html
  log('  Generating index.html...', 'info');
  const indexTemplate = readTemplate('index.html');

  // Generate scene cards HTML
  const sceneCards = videoData.scenes.map((scene, i) => `
          <a href="grids/${String(i + 1).padStart(2, '0')}-${scene.folder.replace(/\s+/g, '-')}-grid.html" class="scene-card">
            <div class="scene-number">${i + 1}</div>
            <h3>${scene.title}</h3>
            <p>${scene.description || ''}</p>
            <div class="scene-meta">${scene.modelCount} models</div>
          </a>`).join('\n');

  const indexHtml = processTemplate(indexTemplate, {
    ...sharedReplacements,
    SCENE_CARDS: sceneCards
  });
  writeFile(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

  // Generate grid pages
  log('  Generating scene grid pages...', 'info');
  const gridTemplate = readTemplate('grid.html');

  videoData.scenes.forEach((scene, i) => {
    const gridFilename = `${String(i + 1).padStart(2, '0')}-${scene.folder.replace(/\s+/g, '-')}-grid.html`;

    // Generate video grid HTML (3x3 layout)
    const modelIds = Object.keys(scene.videos);
    const gridHtml = modelIds.map(modelId => {
      const model = config.models.find(m => m.id === modelId);
      const videoInfo = scene.videos[modelId];
      const videoPath = `../../${VIDEOS_DIR}/${scene.folder}/${videoInfo.filename}`;

      return `
        <div class="video-cell" data-model="${modelId}"${videoInfo.generationTime ? ` data-gen-time="${videoInfo.generationTime}"` : ''}>
          <video loop muted playsinline>
            <source src="${videoPath}" type="video/mp4">
          </video>
          <div class="model-label" style="background-color: ${model.color || '#ccc'}">${model.name}</div>
          ${videoInfo.generationTime ? `<div class="gen-time-badge">${videoInfo.generationTime.toFixed(2)}s</div>` : ''}
        </div>`;
    }).join('\n');

    const gridPageHtml = processTemplate(gridTemplate, {
      ...sharedReplacements,
      SCENE_ID: scene.id,
      SCENE_TITLE: scene.title,
      SCENE_NUMBER: scene.sceneNumber,
      SCENE_DESCRIPTION: scene.description || '',
      VIDEO_GRID: gridHtml
    });

    writeFile(path.join(gridsDir, gridFilename), gridPageHtml);
  });

  // Generate dashboard
  log('  Generating master dashboard...', 'info');
  const dashboardTemplate = readTemplate('dashboard.html');
  const dashboardHtml = processTemplate(dashboardTemplate, sharedReplacements);
  writeFile(path.join(gridsDir, 'master-dashboard.html'), dashboardHtml);

  // Generate speed test page
  log('  Generating speed test page...', 'info');
  const speedTestTemplate = readTemplate('speed-test.html');
  const modelStats = calculateModelStats(config, videoData);
  const speedTestHtml = processTemplate(speedTestTemplate, {
    ...sharedReplacements,
    MODEL_STATS: JSON.stringify(modelStats, null, 2)
  });
  writeFile(path.join(OUTPUT_DIR, 'speed-test.html'), speedTestHtml);

  // Generate rating-system.js
  log('  Generating rating-system.js...', 'info');
  const ratingSystemTemplate = readTemplate('rating-system.js');
  const ratingSystemJs = processTemplate(ratingSystemTemplate, sharedReplacements);
  writeFile(path.join(gridsDir, 'rating-system.js'), ratingSystemJs);

  // Copy CSS
  log('  Copying styles.css...', 'info');
  copyFile(
    path.join(TEMPLATES_DIR, 'styles.css'),
    path.join(OUTPUT_DIR, 'styles.css')
  );
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('\n🎬 Venice AI Video Testing Lab - Setup\n');

  try {
    // Check if config exists
    if (!fileExists(CONFIG_FILE)) {
      throw new Error(`Configuration file not found: ${CONFIG_FILE}`);
    }

    // Read and validate config
    const config = readJsonFile(CONFIG_FILE);
    validateConfig(config);

    // Scan videos directory
    const videoData = scanVideosDirectory(config);

    // Show warnings
    if (videoData.warnings.length > 0) {
      log('Warnings:', 'warning');
      videoData.warnings.forEach(warning => {
        log(`  ${warning}`, 'warning');
      });
      console.log('');
    }

    // Generate site
    generateSite(config, videoData);

    // Success message
    console.log('');
    log('Setup complete!', 'success');
    log(`Found ${videoData.totalVideos} total videos`, 'success');
    log(`Generated ${videoData.scenes.length} scene comparison pages`, 'success');
    console.log('');
    log('Next steps:', 'info');
    log(`  1. Open ${OUTPUT_DIR}/index.html in your browser`, 'info');
    log(`  2. Click on scenes to compare models`, 'info');
    log(`  3. Select winners and export your results`, 'info');
    console.log('');

  } catch (err) {
    console.log('');
    log('Setup failed:', 'error');
    log(err.message, 'error');
    console.log('');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
