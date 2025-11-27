# Venice AI Video Testing Lab

Compare AI video generation models side-by-side with a beautiful, Venice-branded interface.

![Venice Colors](https://img.shields.io/badge/Sea%20Dark-%230E2942-blue) ![Venetian Red](https://img.shields.io/badge/Venetian%20Red-%23DD3300-red)

## Features

- ✅ **3x3 Video Grid** - Compare up to 9 models simultaneously
- ✅ **Winner Selection** - Click to select best outputs per scene
- ✅ **Master Dashboard** - View all selections at once
- ✅ **Export Results** - Download selections as JSON
- ✅ **Zero Dependencies** - Pure HTML/CSS/JS, no build tools required
- ✅ **Offline Ready** - Works from local filesystem (`file://` protocol)
- ✅ **Venice Branding** - Fixed Sea Dark (#0E2942) and Venetian Red (#DD3300) colors

## Quick Start (5 Minutes)

### 1. Clone This Template

```bash
git clone <your-repo-url> my-video-comparison
cd my-video-comparison
```

### 2. Organize Your Videos

Create folders in `videos/` directory, one per scene:

```
videos/
├── 01-smoke/
│   ├── kling.mp4
│   ├── sora.mp4
│   └── veo.mp4
├── 02-office/
│   ├── kling.mp4
│   ├── sora.mp4
│   └── veo.mp4
└── 03-walking/
    └── ...
```

**File Naming Rule:** `{modelId}.mp4` (matches the `id` in `config.json`)

### 3. Edit `config.json`

```json
{
  "title": "Venice AI Video Testing Lab",
  "description": "Your project description",
  "scenes": [
    {
      "title": "Cigarette Smoke",
      "folder": "01-smoke",
      "description": "Smoke rising from cigarette..."
    }
  ],
  "models": [
    {
      "id": "kling",
      "name": "Kling v2",
      "speed": "Fast",
      "color": "#C8E3FD"
    }
  ]
}
```

### 4. Run Setup

```bash
npm run setup
```

### 5. Open in Browser

```bash
open site/index.html
```

That's it! 🎉

## File Organization

### Required Structure

```
your-project/
├── config.json          # Your configuration (edit this)
├── videos/              # Your video files (add here)
│   ├── 01-scene-name/
│   │   ├── model1.mp4
│   │   └── model2.mp4
│   └── 02-another-scene/
│       └── ...
├── setup.js             # Build script (don't edit)
├── templates/           # Source templates (don't edit)
└── site/                # Generated output (auto-created)
```

### Folder Naming

- **Format:** `01-name`, `02-name`, `03-name` (numbers for ordering)
- **Characters:** Letters, numbers, hyphens only (no spaces)
- **Examples:** `01-smoke`, `02-office-wide`, `03-walking-shot`

### Video File Naming

- **Format:** `{modelId}.mp4` (must match model `id` in config)
- **Extensions:** `.mp4` or `.mov`
- **Examples:** If config has `"id": "kling"`, file should be `kling.mp4`

## Configuration Reference

### `config.json` Fields

#### Project Info
```json
{
  "title": "Your Project Name",
  "description": "Optional description"
}
```

#### Scenes
```json
"scenes": [
  {
    "title": "Scene Name",              // Display name
    "folder": "01-folder-name",         // Folder in videos/
    "description": "Optional..."        // Scene description
  }
]
```

#### Models
```json
"models": [
  {
    "id": "kling",                      // Used for filename matching
    "name": "Kling v2",                 // Display name
    "speed": "Fast",                    // Speed badge (optional)
    "color": "#C8E3FD"                  // Model color (optional)
  }
]
```

### Speed Options
- `"Fastest"` - Green badge
- `"Fast"` - Cyan badge
- `"Medium"` - Yellow badge
- `"Slow"` - Orange badge
- `"Slowest"` - Red badge

## Workflow

### 1. Add Videos
Drop your `.mp4` files into scene folders in `videos/`

### 2. Update Config
Edit `config.json` to match your scenes and models

### 3. Build Site
```bash
npm run setup
```

### 4. Review
Open `site/index.html` and compare models

### 5. Select Winners
Click on videos to mark favorites

### 6. Export
Click "Export Selections" button to save as JSON

## Troubleshooting

### "Scene folder not found"
- Check folder name in `config.json` matches actual folder in `videos/`
- Remove spaces from folder names (use hyphens instead)

### "Missing video for model X"
- Check filename matches model `id` in config exactly
- Ensure file extension is `.mp4` or `.mov`
- Check for typos in model ID or filename

### "No video files found in scene"
- Verify `.mp4`/`.mov` files exist in scene folder
- Check file permissions (files must be readable)

### Videos won't play
- Try different browser (Chrome/Firefox recommended)
- Check video codecs are web-compatible (H.264/MP4)
- Ensure files aren't corrupted

## Customization

### Change Project Title
Edit `title` in `config.json`, then run `npm run setup`

### Add/Remove Scenes
Edit `scenes` array in `config.json`, then run `npm run setup`

### Add/Remove Models
Edit `models` array in `config.json`, then run `npm run setup`

### Brand Colors
Colors are fixed to Venice palette:
- **Sea Dark:** `#0E2942` (primary background)
- **Venetian Red:** `#DD3300` (accents)
- **Black:** `#000000` (foundation)

## Export Format

When you click "Export Selections", you get:

```json
{
  "project": "Venice AI Video Testing Lab",
  "exportDate": "2025-11-26T12:34:56.789Z",
  "totalScenes": 9,
  "selectedScenes": 7,
  "selections": {
    "scene-1": {
      "winner": "kling",
      "timestamp": "2025-11-26T12:30:00.000Z",
      "sceneName": "Cigarette Smoke",
      "modelName": "Kling v2"
    }
  }
}
```

## Requirements

- **Node.js:** 14.0.0 or higher (for setup script only)
- **Browser:** Modern browser with HTML5 video support
- **Files:** Web-compatible video files (.mp4 with H.264 codec recommended)

## Tips

- **Video Length:** Keep videos under 10 seconds for best loading
- **File Size:** Compress videos to <10MB each for faster loading
- **Resolution:** 1080p is recommended, 4K may be slow
- **Consistency:** Use same resolution for all videos in a scene
- **Naming:** Stick to simple model IDs (e.g., `kling`, `sora`, `veo`)

## License

MIT

---

**Built with Venice AI brand colors**
Sea Dark (#0E2942) | Venetian Red (#DD3300) | Aeonik Typography
