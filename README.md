# 🎵 SONIC HUB — Stream Music Your Way

> A single-page music streaming web application with AI-powered recommendations, a real-time equalizer, and a curated Bollywood/Ghazal/Indie library.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo & Screenshots](#live-demo--screenshots)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Data Model](#data-model)
- [Component Breakdown](#component-breakdown)
- [Audio Engine](#audio-engine)
- [AI Integration](#ai-integration)
- [Styling System](#styling-system)
- [Responsive Design](#responsive-design)
- [Setup & Usage](#setup--usage)
- [Configuration](#configuration)
- [Browser Compatibility](#browser-compatibility)

---

## Overview

SONIC HUB is a fully client-side, single-file music streaming landing page built with vanilla HTML, CSS, and JavaScript. It features a 14-track curated library (Bollywood, Ghazal, Romantic, Devotional, Ambient), a persistent bottom music player powered by the Web Audio API with a 5-band real-time equalizer, mood-based browsing, an AI chatbot assistant powered by Claude (Anthropic), and an AI playlist generator — all in a single `index.html` file with zero build steps.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     UI LAYER (HTML + CSS)                │   │
│  │                                                          │   │
│  │  Header ──► Hero ──► Slider ──► Tabs ──► Charts         │   │
│  │                ──► Artist Sidebar ──► Moods ──► Footer   │   │
│  │                                                          │   │
│  │  Popups: EQ | AI Playlist | Unlimited | Artist Connect  │   │
│  │  Persistent: Player Bar | AI Chatbot FAB & Window       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  JAVASCRIPT LAYER                        │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │   │
│  │  │  Data Layer  │  │ Audio Engine │  │  UI Engine    │  │   │
│  │  │              │  │              │  │               │  │   │
│  │  │  SONGS[]     │  │ HTML5 Audio  │  │ renderCharts  │  │   │
│  │  │  ARTISTS[]   │  │ Web Audio    │  │ renderArtists │  │   │
│  │  │  SONG_COVERS │  │ API (EQ,     │  │ buildSlider   │  │   │
│  │  │  ARTIST_     │  │ Gain, Panner)│  │ search        │  │   │
│  │  │  PHOTOS[]    │  │              │  │ filters       │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐  │   │
│  │  │   Playback Engine    │  │     AI Integration       │  │   │
│  │  │                      │  │                          │  │   │
│  │  │  playSong()          │  │  Chatbot ──► Claude API  │  │   │
│  │  │  prev/next/shuffle   │  │  AI Playlist Generator   │  │   │
│  │  │  repeat modes        │  │  (Anthropic v1/messages) │  │   │
│  │  │  progress bar        │  │                          │  │   │
│  │  │  volume + mute       │  │  Fallback: keyword-based │  │   │
│  │  └──────────────────────┘  └──────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              EXTERNAL DEPENDENCIES (CDN)                 │   │
│  │                                                          │   │
│  │  Font Awesome 6.4  ·  Google Fonts (Bebas Neue, DM Sans) │   │
│  │  Anthropic API  ·  Unsplash (cover images)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```



```
User Action
    │
    ▼
Event Handler (onclick / oninput / keydown)
    │
    ├──► playSong(index)
    │         │
    │         ├──► HTML5 <audio> src = MP3 file path
    │         ├──► Web Audio API graph: source ──► EQ filters ──► GainNode ──► destination
    │         ├──► Update Player Bar UI (title, artist, cover, progress)
    │         ├──► Sync Hero vinyl animation (spin / pause)
    │         └──► Sync Now Playing badge + EQ bars animation
    │
    ├──► Search Input
    │         │
    │         └──► Filter SONGS[] by title/artist/genre → render dropdown items
    │
    ├──► Chart Filter Button
    │         │
    │         └──► Filter SONGS[] by genre tag → re-render chart list
    │
    └──► AI Chatbot Input
              │
              └──► POST /v1/messages (Anthropic Claude API)
                        │
                        ├── Success: parse [PLAY:N] command, render bot message
                        └── Failure: keyword-based local fallback
```

---

## Project Structure

```
sonic-hub/
│
├── index.html          ← Entire application (HTML + CSS + JS in one file)
│
└── [audio files]       ← MP3 files referenced by relative path in SONGS[]
    ├── 409081-asees-kaur---tu-banja-gali-benaras-ki-...mp3
    ├── 524094-aishwarya-pandit---baithe-baithe.mp3
    ├── ... (14 tracks total)
    └── the_mountain-indian-hindi-background-music-496551.mp3
```

---

## Features

| Feature | Description |
|---|---|
| 🎵 Music Player | Persistent bottom bar with play/pause, prev/next, shuffle, repeat |
| 🎚️ Real-time EQ | 5-band Web Audio API equalizer with presets (Flat, Bass Boost, Treble, Vocal, Pop, Classical) |
| 🔊 Audio Controls | Master gain slider, stereo panning slider |
| 🔍 Live Search | Real-time search dropdown filtering songs by title, artist, or genre |
| 📊 Top Charts | Filterable ranked song list with play count bars, duration, and like toggles |
| 🎨 Mood Browser | 6 mood cards: Romantic, Bollywood, Ghazal, Devotional, Ambient, Classic |
| 🎠 Discover Slider | 3D perspective carousel of trending album art |
| 👤 Artist Profiles | Sidebar with follower counts, monthly listeners, and expandable artist detail panel |
| 🤖 AI Chatbot | Claude-powered music assistant with song-play commands and mood-based suggestions |
| 🎶 AI Playlist Generator | Prompt-based playlist builder calling the Claude API for curated track lists |
| 🎛️ Feature Popups | High Fidelity EQ, Unlimited Access info, AI Playlist, Artist Connect modals |
| 📱 Responsive | Mobile hamburger nav, fluid grid layouts, touch-friendly controls |
| ✨ Animations | Vinyl spin, floating feature tags, EQ bar animations, hero fade-up |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic sections, audio element, SVG animations) |
| Styling | CSS3 (custom properties, grid, flexbox, keyframe animations, backdrop-filter) |
| Logic | Vanilla JavaScript (ES6+, async/await, Web Audio API) |
| Icons | Font Awesome 6.4 (CDN) |
| Typography | Google Fonts — Bebas Neue (display), DM Sans (body) |
| Audio Playback | HTML5 `<audio>` element |
| Audio Processing | Web Audio API (AudioContext, BiquadFilterNode, GainNode, StereoPannerNode) |
| AI Backend | Anthropic Claude API (`claude-sonnet-4-20250514`) via `fetch` |
| Images | Unsplash (song covers, artist photos, mood/feature images) |
| No dependencies | Zero npm packages, zero build tools, zero frameworks |

---

## Data Model

### Song Object
```js
{
  id:       String,   // Unique identifier (e.g. "1")
  rank:     Number,   // Chart position
  title:    String,   // Song title
  artist:   String,   // Artist name
  genre:    String,   // Genre tag: Romantic | Bollywood | Ghazal | Devotional | Ambient | ...
  file:     String,   // MP3 filename (relative path)
  trending: Boolean   // Show "TRENDING" badge in chart list
}
```

### Artist Object
```js
{
  name:      String,   // Display name
  genre:     String,   // Genre description
  followers: Number,   // Total followers
  monthly:   Number,   // Monthly listeners
  verified:  Boolean   // Verified badge
}
```


---

### Header
Sticky top bar with blur backdrop. Contains the animated SVG logo, a live search input with a dropdown overlay, desktop navigation links (`#home`, `#discover`, `#charts`, `#playlists`), a CTA button, and a mobile hamburger button.

### Hero Section (`#home`)
Full-viewport section with headline copy, two CTA buttons (scroll-to-charts, scroll-to-discover), and an animated vinyl disc with tonearm on the right. Four floating feature tags (`High Fidelity`, `Unlimited Access`, `AI Playlists`, `Artist Connect`) trigger their respective popups. A `Now Playing` badge below the vinyl shows the active track with animated EQ bars.

### Discover Slider (`#discover`)
A 3D card carousel with perspective transforms. Each card is assigned a `data-pos` attribute (`-3` to `3`) that drives its CSS transform, scale, brightness, and z-index. Clicking a non-center card rotates it to the center and triggers `playSong()`. Navigation via click-on-card only (no arrow buttons).

### Feature Tabs Section
A two-column layout: a morphing image panel on the left that fades between three Unsplash images, and a stack of three tab cards on the right (Unlimited Streams, Personalized Playlists, Connect & Discover). Clicking a card switches the active image.

### Charts Section (`#charts`)
A two-column layout: a filterable ranked song list on the left and a sticky artist sidebar on the right. Genre filter pills (All, Trending, Romantic, Bollywood, Ghazal) re-render the chart list. Each row shows rank, cover thumbnail, title, artist, genre tag, play-count bar, duration, like button, and a play button.

### Artist Sidebar
Lists 8 artists with photos (or colored initial fallbacks), name, verified badge, genre, and listener count. Clicking an artist expands an inline detail panel with banner image, follower/monthly stats, and a Follow/Following toggle button.

### Moods Section (`#playlists`)
A responsive grid of 6 mood cards with full-bleed Unsplash images, overlay gradients, and hover zoom + lift transitions.

### Footer
4-column grid (Product, Community, Company, Legal) with social icon links and a copyright line.

### Player Bar (Persistent)
Fixed bottom bar with three zones: track info (cover thumbnail, title, artist, like button), playback controls (shuffle, prev, play/pause, next, repeat with active states), and volume (mute toggle + scrub bar). A hidden `<audio>` element is the actual playback engine. Progress bar is clickable/scrubbable.

### Popup Modals
Four overlays opened via `openPopup(id)` / `closePopup(id)`:
- **High Fidelity / EQ** — vertical range sliders for 5 EQ bands (60Hz, 250Hz, 1kHz, 4kHz, 12kHz), EQ presets, master gain, stereo panning.
- **Unlimited Access** — feature highlights card.
- **AI Playlists** — mood/genre prompt input that calls the Claude API and renders a suggested track list.
- **Artist Connect** — community feature highlights card.

### AI Chatbot
A FAB (Floating Action Button) in the bottom-right corner opens a chat window. Messages are sent to the Anthropic `v1/messages` endpoint with a rolling 6-message history. The system prompt instructs Claude to act as a music assistant for SONIC HUB and to embed `[PLAY:N]` commands in responses to trigger `playSong(N)`. A keyword-based fallback handles API failures gracefully.

---

## Audio Engine

The Web Audio API graph is constructed lazily on the first `playSong()` call to comply with browser autoplay policies.

```
<audio> element
      │
      ▼
  MediaElementSourceNode  (sourceNode)
      │
      ▼
  BiquadFilterNode — 60 Hz  (shelf)      ← eqNodes['60']
      │
      ▼
  BiquadFilterNode — 250 Hz (peaking)    ← eqNodes['250']
      │
      ▼
  BiquadFilterNode — 1 kHz  (peaking)    ← eqNodes['1000']
      │
      ▼
  BiquadFilterNode — 4 kHz  (peaking)    ← eqNodes['4000']
      │
      ▼
  BiquadFilterNode — 12 kHz (shelf)      ← eqNodes['12000']
      │
      ▼
  GainNode  (gainNode)                   ← master gain
      │
      ▼
  StereoPannerNode  (pannerNode)         ← L/R balance
      │
      ▼
  AudioContext.destination
```

EQ band gain range: **−12 dB to +12 dB**. Master gain range: **0 to 2× (0–200%)**. Stereo panning range: **−1 (full left) to +1 (full right)**.

### EQ Presets

| Preset | 60 Hz | 250 Hz | 1 kHz | 4 kHz | 12 kHz |
|---|---|---|---|---|---|
| Flat | 0 | 0 | 0 | 0 | 0 |
| Bass Boost | +10 | +6 | 0 | −2 | −3 |
| Treble Boost | −3 | −2 | 0 | +6 | +10 |
| Vocal | −4 | −2 | +6 | +5 | +2 |
| Pop | +3 | +2 | 0 | +3 | +4 |
| Classical | +5 | +3 | −2 | +2 | +5 |

---

## AI Integration

### Chatbot

```
User input
    │
    ▼
Build messages array (last 6 turns from chatHistory[])
    │
    ▼
POST https://api.anthropic.com/v1/messages
  model:      claude-sonnet-4-20250514
  max_tokens: 1000
  system:     "You are SONIC AI, a music assistant for SONIC HUB.
               Respond with [PLAY:N] (0-indexed) to trigger playback."
    │
    ├─ Success ──► Parse [PLAY:N] command → playSong(N)
    │              Render bot message bubble
    │
    └─ Failure ──► Keyword fallback:
                   "play/song/music" → random song suggestion
                   "mood/sad/happy"  → redirect to AI Playlist feature
                   else              → generic help message
```

### AI Playlist Generator

The popup captures a free-text mood/genre prompt and sends it to the Claude API requesting a JSON array of recommended songs from the `SONGS` data. The response is rendered as a clickable playlist inside the popup.

---

## Styling System

All colors are driven by CSS custom properties defined on `:root`:

```css
:root {
  --g:    #1DB954;              /* Brand green (Sonic green) */
  --gd:   rgba(29,185,84,.14); /* Green tint background */
  --black: #000;
  --white: #fff;
  --sub:   #888;               /* Subtitle / muted text */
  --surf:  #0d0d0d;            /* Surface backgrounds */
  --bdr:   #1c1c1c;            /* Border color */
  --card:  #0a0a0a;            /* Card background */
}
```

Typography uses two Google Fonts: **Bebas Neue** for all display headings and logo text, and **DM Sans** (weights 300–700) for all body and UI text.

---

## Setup & Usage

No build process or package manager is required.

```bash
# 1. Clone or download the project
git clone https://github.com/your-username/sonic-hub.git
cd sonic-hub

# 2. Place MP3 files in the same directory as index.html
#    (filenames must match the `file` field in the SONGS array)

# 3. Open in a browser
#    Option A — Direct file open (some browsers block Web Audio on file://)
open index.html

#    Option B — Local HTTP server (recommended)
npx serve .
# or
python3 -m http.server 8080
# then visit http://localhost:8080
```


---

## Configuration

To swap songs, edit the `SONGS` array in the `<script>` block:

```js
const SONGS = [
  {
    id: '1',
    rank: 1,
    title: 'Your Song Title',
    artist: 'Artist Name',
    genre: 'Romantic',        // Affects chart filter buttons
    file: 'your-file.mp3',   // Relative path to audio file
    trending: true            // Show TRENDING badge
  },
  // ...
];
```

To use the AI features, ensure the page is served from a domain that has access to the Anthropic API (the API key is handled by the proxy layer; no key is embedded in the HTML).

---

---

## License

© 2026 SONIC HUB. All rights reserved.
