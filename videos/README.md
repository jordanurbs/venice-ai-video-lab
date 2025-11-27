# Video File Organization Guide

This directory is where you place your AI-generated video files for comparison testing.

## Quick Reference

**Recommended (Venice Interface):** Copy exact text from Venice when saving videos:

```
videos/
├── 01-smoke/
│   ├── Wan 2.5 Preview  136.68s.mp4
│   ├── Veo 3 Fast  62.80s.mp4
│   ├── Sora 2  209.85s.mp4
│   └── Kling 2.0  98.45s.mp4
├── 02-office/
│   ├── Wan 2.5 Preview  142.33s.mp4
│   └── ...
└── 03-walking/
    └── ...
```

**Alternative (Legacy):** Simple model ID format:

```
videos/
├── 01-smoke/
│   ├── kling.mp4
│   ├── sora.mp4
│   ├── veo.mp4
│   └── runway.mp4
├── 02-office/
│   └── ...
└── 03-walking/
    └── ...
```

## Folder Naming Rules

### Format
`{number}-{name}`

### Examples
- ✅ `01-smoke`
- ✅ `02-office-wide`
- ✅ `03-walking-shot`
- ❌ `smoke` (missing number)
- ❌ `01 smoke` (space instead of hyphen)
- ❌ `1-smoke` (single digit instead of two)

### Requirements
- **Number prefix**: Two digits (01, 02, 03... 99)
- **Separator**: Single hyphen (-)
- **Name**: Letters, numbers, hyphens only (no spaces or special characters)
- **Purpose**: Numbers determine display order

## Recommended: Venice Interface Workflow

**Why this workflow?** Automatically track generation times and leverage fuzzy matching.

### Step-by-Step Process

**1. Generate video in Venice AI**
- Test your prompt across multiple models
- Venice displays generation time for each model (e.g., `136.68s`)

**2. Download and save with exact Venice text**
- Right-click video → "Save As..."
- Copy exact text from Venice interface
- **Example:** `Wan 2.5 Preview  136.68s`
- Paste as filename (don't add `.mp4` - it's auto-added)
- Save to appropriate scene folder in `videos/`

**3. What happens automatically:**
- ✅ `.mp4` extension appended if missing
- ✅ Generation time parsed (e.g., `136.68s` → 136.68 seconds)
- ✅ Model matched via fuzzy matching (full model names work)
- ✅ Times displayed in grid badges, dashboard, speed test page

### Example Filenames from Venice

```
Wan 2.5 Preview  136.68s
Veo 3 Fast  62.80s
Sora 2  209.85s
Kling 2.0  98.45s
```

**After auto-processing:**
```
Wan 2.5 Preview  136.68s.mp4  ← Extension auto-added
Veo 3 Fast  62.80s.mp4
Sora 2  209.85s.mp4
Kling 2.0  98.45s.mp4
```

### Config Matching

Your `config.json` should use full model names to match Venice filenames:

```json
{
  "models": [
    {
      "id": "wan-2-5",
      "name": "Wan 2.5 Preview",  // ← Matches Venice filename
      "speed": "Fastest"
    },
    {
      "id": "veo-3",
      "name": "Veo 3 Fast",        // ← Matches Venice filename
      "speed": "Fast"
    }
  ]
}
```

**Fuzzy Matching Priorities:**
1. Exact model ID match (`wan-2-5` → `wan-2-5.mp4`)
2. **Model name substring** (`Wan 2.5 Preview` → `Wan 2.5 Preview  136.68s.mp4`)
3. Model ID substring fallback

This means Venice's full model names work automatically!

## Video File Naming Rules (Legacy)

### Format
`{modelId}.mp4`

### Critical Rules
1. **Filename MUST match model `id` in config.json exactly**
2. **Case sensitive** (if config says `kling`, file must be `kling.mp4`, not `Kling.mp4`)
3. **Only one file per model per scene**

### Example Mapping

If your [config.json](../config.json) has:
```json
{
  "models": [
    { "id": "kling", "name": "Kling v2" },
    { "id": "sora", "name": "Sora Turbo" },
    { "id": "veo", "name": "Google Veo" }
  ]
}
```

Then each scene folder should contain:
```
01-smoke/
├── kling.mp4    ← Matches "id": "kling"
├── sora.mp4     ← Matches "id": "sora"
└── veo.mp4      ← Matches "id": "veo"
```

### Supported File Extensions
- `.mp4` (recommended)
- `.mov`

## Common Mistakes

### ❌ Wrong: Spaces in folder names
```
videos/
└── 01 smoke cigarette/  ← Will cause URL encoding issues
```

### ✅ Correct: Hyphens in folder names
```
videos/
└── 01-smoke-cigarette/  ← Clean URLs
```

### ❌ Wrong: Filename doesn't match config
```
config.json:
{ "id": "kling" }

videos/01-smoke/
└── kling-v2.mp4  ← Doesn't match "kling"
```

### ✅ Correct: Exact match
```
config.json:
{ "id": "kling" }

videos/01-smoke/
└── kling.mp4  ← Exact match
```

### ❌ Wrong: Missing number prefix
```
videos/
└── smoke/  ← Setup script won't detect ordering
```

### ✅ Correct: Number prefix
```
videos/
└── 01-smoke/  ← Scene displays in order
```

## Adding New Videos

### Step 1: Create scene folder (if new scene)
```bash
mkdir videos/04-new-scene
```

### Step 2: Add video files
```bash
# Copy your generated videos into the folder
cp ~/Downloads/kling-output.mp4 videos/04-new-scene/kling.mp4
cp ~/Downloads/sora-output.mp4 videos/04-new-scene/sora.mp4
```

### Step 3: Update config.json
Edit [../config.json](../config.json) to add the new scene:
```json
{
  "scenes": [
    {
      "title": "New Scene",
      "folder": "04-new-scene",
      "description": "Description of what this scene tests"
    }
  ]
}
```

### Step 4: Rebuild site
```bash
npm run setup
```

## Troubleshooting

### "Scene folder not found"
- Check folder name in config.json matches actual folder in videos/
- Verify no typos or case mismatches
- Remove spaces from folder names (use hyphens)

### "Missing video for model X"
- Verify filename matches model `id` in config.json exactly
- Check file extension is `.mp4` or `.mov`
- Ensure file exists in the correct scene folder

### "No video files found in scene"
- Verify `.mp4` or `.mov` files exist in the folder
- Check file permissions (files must be readable)
- Ensure files aren't hidden (starting with `.`)

### Videos won't play in browser
- Check video codec is web-compatible (H.264/MP4 recommended)
- Try re-encoding with:
  ```bash
  ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4
  ```
- Ensure files aren't corrupted

## File Size Recommendations

### Optimal Performance
- **File Size:** < 10MB per video
- **Duration:** < 10 seconds
- **Resolution:** 1080p (1920x1080)
- **Codec:** H.264 (MP4 container)

### Compression Tips

**Using FFmpeg:**
```bash
# Compress to target size (~5MB)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4

# Resize to 1080p if higher
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 output.mp4
```

**Why compress?**
- Faster loading in browser
- Better playback performance
- Smaller git repository size (if committing videos)

## Example Project Structure

```
videos/
├── README.md (this file)
├── 01-smoke/
│   ├── kling.mp4       (8.2 MB)
│   ├── sora.mp4        (6.1 MB)
│   ├── veo.mp4         (7.4 MB)
│   └── runway.mp4      (5.8 MB)
├── 02-office-wide/
│   ├── kling.mp4       (9.1 MB)
│   ├── sora.mp4        (7.3 MB)
│   └── veo.mp4         (8.6 MB)
└── 03-walking-shot/
    ├── kling.mp4       (6.9 MB)
    ├── sora.mp4        (5.2 MB)
    ├── veo.mp4         (7.1 MB)
    └── runway.mp4      (4.8 MB)
```

## Workflow Summary

### Recommended (Venice Interface)

1. **Generate videos** in Venice AI across multiple models
2. **Create scene folder** in videos/ (e.g., `01-smoke`)
3. **Download videos** with exact Venice text (e.g., `Wan 2.5 Preview  136.68s`)
4. **Update config.json** with scene metadata and model names matching Venice
5. **Run** `npm run setup` (auto-appends `.mp4`, parses times)
6. **Open** `site/index.html` to review comparisons
7. **Open** `site/speed-test.html` to see performance rankings

### Alternative (Legacy)

1. **Generate videos** from your AI models
2. **Create scene folder** in videos/ (e.g., `01-smoke`)
3. **Rename files** to match model IDs (e.g., `kling.mp4`)
4. **Update config.json** with scene metadata
5. **Run** `npm run setup`
6. **Open** `site/index.html` to review

## Need Help?

- Main README: [../README.md](../README.md)
- Configuration Guide: See [../README.md#configuration-reference](../README.md#configuration-reference)
- Troubleshooting: See [../README.md#troubleshooting](../README.md#troubleshooting)
