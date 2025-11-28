#!/bin/bash
# Helper script to copy videos from cyberpunk-tests to venice-ai-video-testing-lab structure
# This maps the cyberpunk scene directories to the config.json structure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="../new-vid-generation/cyberpunk-tests"
TARGET_DIR="$SCRIPT_DIR/videos"

echo "🎬 Copying videos from cyberpunk-tests to venice-ai-video-testing-lab..."
echo ""

# Create target scene directories
mkdir -p "$TARGET_DIR/01-smoke"
mkdir -p "$TARGET_DIR/02-office"
mkdir -p "$TARGET_DIR/03-walking"

# Copy Scene 1: Cigarette Smoke
echo "📁 Scene 1: Cigarette Smoke"
if [ -d "$SOURCE_DIR/1. Cigarette Smoke" ]; then
    cp "$SOURCE_DIR/1. Cigarette Smoke"/*.mp4 "$TARGET_DIR/01-smoke/" 2>/dev/null || true
    echo "   ✓ Copied $(ls -1 "$TARGET_DIR/01-smoke" | wc -l | tr -d ' ') videos"
else
    echo "   ⚠️  Source directory not found"
fi

# Copy Scene 2: Office Wideshot
echo "📁 Scene 2: Office Wideshot"
if [ -d "$SOURCE_DIR/2. Office Wideshot" ]; then
    cp "$SOURCE_DIR/2. Office Wideshot"/*.mp4 "$TARGET_DIR/02-office/" 2>/dev/null || true
    echo "   ✓ Copied $(ls -1 "$TARGET_DIR/02-office" | wc -l | tr -d ' ') videos"
else
    echo "   ⚠️  Source directory not found"
fi

# Copy Scene 3: Walking
echo "📁 Scene 3: Walking"
if [ -d "$SOURCE_DIR/3. Walking" ]; then
    cp "$SOURCE_DIR/3. Walking"/*.mp4 "$TARGET_DIR/03-walking/" 2>/dev/null || true
    echo "   ✓ Copied $(ls -1 "$TARGET_DIR/03-walking" | wc -l | tr -d ' ') videos"
else
    echo "   ⚠️  Source directory not found"
fi

echo ""
echo "✅ Video copy complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: node setup.js"
echo "   2. Open: site/index.html in your browser"
echo ""
