# Venice AI Video Testing Lab

Compare AI video generation models side-by-side with a beautiful, Venice-branded interface.

![Venice Colors](https://img.shields.io/badge/Sea%20Dark-%230E2942-blue) ![Venetian Red](https://img.shields.io/badge/Venetian%20Red-%23DD3300-red)

## Features

- ✅ **3x3 Video Grid** - Compare up to 9 models simultaneously
- ✅ **Winner Selection** - Click to select best outputs per scene
- ✅ **Master Dashboard** - View all selections at once
- ✅ **Generation Time Tracking** - Automatically parses and displays generation times from Venice filenames
- ✅ **Speed Test Page** - Compare model performance with rankings and statistics
- ✅ **Export Results** - Download selections as JSON with generation times
- ✅ **Zero Dependencies** - Pure HTML/CSS/JS, no build tools required
- ✅ **Offline Ready** - Works from local filesystem (`file://` protocol)
- ✅ **Venice Branding** - Fixed Sea Dark (#0E2942) and Venetian Red (#DD3300) colors

## Quick Start (5 Minutes)

### 1. Clone This Template

```bash
git clone https://github.com/jordanurbs/venice-ai-video-lab.git my-video-comparison
cd my-video-comparison
```

### 2. Organize Your Videos

Add your video files in this structure (create folders manually or drag and drop):

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

**Recommended (Venice Interface):** Copy exact text from Venice interface when saving generated videos:

```
Wan 2.5 Preview  136.68s
Veo 3 Fast  62.80s
Sora 2  209.85s
```

The setup script will:
- ✅ **Auto-append `.mp4`** if extension is missing (Venice often omits it)
- ✅ **Parse generation time** from filename (e.g., `136.68s` → 136.68 seconds)
- ✅ **Display times** in grid badges, dashboard, and speed test page

**Alternative (Legacy):** Simple model ID format still works:

- **Format:** `{modelId}.mp4` (must match model `id` in config)
- **Extensions:** `.mp4` or `.mov`
- **Examples:** If config has `"id": "kling"`, file should be `kling.mp4`

**How it works:**
- Filenames like `Wan 2.5 Preview  192.79s` are matched to models via fuzzy matching
- Model name "Wan 2.5 Preview" matches config `"name": "Wan 2.5 Preview"`
- Generation time `192.79s` is automatically extracted and stored
- Missing `.mp4` extension is added automatically during scanning

## Configuration Reference

### `config.json` Fields

#### Project Info
```json
{
  "title": "Your Project Name",
  "description": "Optional description"
}
```

#### JSON Formatting Requirements

**⚠️ IMPORTANT:** Ensure your `config.json` is valid JSON:
- Remove or convert double quotes `""` inside text values to single quotes `''`
- Validate JSON syntax before running setup (use [jsonlint.com](https://jsonlint.com) or VS Code)
- Common issue: Prompts with quotation marks break JSON parsing

**Example - Wrong:**
```json
{
  "description": "A "cinematic" shot of smoke"  // ❌ Breaks JSON
}
```

**Example - Correct:**
```json
{
  "description": "A 'cinematic' shot of smoke"  // ✅ Valid JSON
}
```

#### Scenes
```json
"scenes": [
  {
    "title": "Scene Name",              // Display name
    "folder": "01-folder-name",         // Folder in videos/
    "description": "Your generation prompt here..."  // ⚠️ Use your actual AI prompt
  }
]
```

#### Models
```json
"models": [
  {
    "id": "wan-2-5",
    "name": "Wan 2.5 Preview",
    "speed": "Fastest",
    "color": "#C8E3FD"
  },
  {
    "id": "veo-3",
    "name": "Veo 3 Fast",
    "speed": "Fast",
    "color": "#98D8C8"
  },
  {
    "id": "sora-2",
    "name": "Sora 2",
    "speed": "Slow",
    "color": "#FFB366"
  },
  {
    "id": "kling-2",
    "name": "Kling 2.0",
    "speed": "Medium",
    "color": "#F7C8E0"
  }
]
```

### Speed Options
- `"Fastest"` - Green badge
- `"Fast"` - Cyan badge
- `"Medium"` - Yellow badge
- `"Slow"` - Orange badge
- `"Slowest"` - Red badge

### Complete Example

Here's a full `config.json` showing all fields together:

```json
{
  "title": "Venice AI Model Comparison",
  "description": "Testing prompt consistency across multiple AI video models",
  "scenes": [
    {
      "title": "Cigarette Smoke",
      "folder": "01-smoke",
      "description": "Smoke rising from cigarette in dim lighting, cinematic atmosphere"
    },
    {
      "title": "Office Wide Shot",
      "folder": "02-office",
      "description": "Wide angle office environment with natural lighting"
    },
    {
      "title": "Walking Camera Follow",
      "folder": "03-walking",
      "description": "Camera following subject walking down urban street"
    }
  ],
  "models": [
    {
      "id": "wan-2-5",
      "name": "Wan 2.5 Preview",
      "speed": "Fastest",
      "color": "#C8E3FD"
    },
    {
      "id": "veo-3",
      "name": "Veo 3 Fast",
      "speed": "Fast",
      "color": "#98D8C8"
    },
    {
      "id": "sora-2",
      "name": "Sora 2",
      "speed": "Slow",
      "color": "#FFB366"
    },
    {
      "id": "kling-2",
      "name": "Kling 2.0",
      "speed": "Medium",
      "color": "#F7C8E0"
    }
  ]
}
```

**Key Points:**
- Scene `description` should be your actual video generation prompt
- Scene `folder` must match directory name exactly (case-sensitive)
- Model `name` should match Venice interface output for time parsing
- Only include models you actually tested

## Workflow

### Recommended: Venice Interface Workflow

**1. Generate videos in Venice AI**
- Test your prompt across multiple models
- Venice shows generation time for each model

**2. Download and save with exact Venice text**
- Right-click video → "Save As..."
- Copy exact text from Venice interface (e.g., `Wan 2.5 Preview  136.68s`)
- Paste as filename (don't worry about `.mp4` extension - it's auto-added)
- Save to appropriate scene folder in `videos/` (create folder or drag and drop files)

**Example filenames copied from Venice:**
```
videos/01-smoke/
├── Wan 2.5 Preview  136.68s
├── Veo 3 Fast  62.80s
├── Sora 2  209.85s
└── Kling 2.0  98.45s
```

**3. Update Config**
Edit `config.json` to match your scenes and models:
```json
{
  "models": [
    {
      "id": "wan-2-5",
      "name": "Wan 2.5 Preview",  // Matches filename
      "speed": "Fastest"
    },
    {
      "id": "veo-3",
      "name": "Veo 3 Fast",        // Matches filename
      "speed": "Fast"
    }
  ]
}
```

**4. Build Site**
```bash
npm run setup
```

The setup script will:
- Find videos via fuzzy matching (handles full model names)
- Auto-append `.mp4` extension if missing
- Parse generation times from filenames
- Display times throughout the interface

**5. Review & Compare**
- Open `site/index.html` - Grid comparisons with generation time badges
- Open `site/speed-test.html` - Model performance rankings

**6. Select Winners**
Click on videos to mark favorites (stores model + generation time)

**7. Export**
Click "Export Selections" to save as JSON with generation times

### Alternative: Simple Workflow

**1. Add Videos**
Drop your `.mp4` files into scene folders in `videos/`

**2. Update Config**
Edit `config.json` to match your scenes and models

**3. Build Site**
```bash
npm run setup
```

**4. Review**
Open `site/index.html` and compare models

**5. Select Winners**
Click on videos to mark favorites

**6. Export**
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
      "modelName": "Kling v2",
      "generationTime": 98.45
    },
    "scene-2": {
      "winner": "veo-3",
      "timestamp": "2025-11-26T12:31:15.000Z",
      "sceneName": "Office Wide Shot",
      "modelName": "Veo 3 Fast",
      "generationTime": 62.80
    }
  }
}
```

**New Field:**
- `generationTime` - Seconds to generate (parsed from Venice filename), or `null` if not available

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
