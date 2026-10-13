<p align="center">
  <img src="assets/banner.png" alt="Monochrome Chrome Design: a Claude skill for glass, chrome and dot-matrix visuals" width="100%">
</p>

<h1 align="center">Monochrome Chrome Design</h1>

<p align="center">
  A Claude skill that designs decks, websites, posters and social posts in one premium monochrome style:<br>
  spotlit black backgrounds, glass cards, gradient type, HUD wireframes and dot-matrix data visuals.
</p>

<p align="center">
  <img alt="Claude Skill" src="https://img.shields.io/badge/Claude-Skill-EDEDED?style=flat-square&labelColor=0E0E11">
  <img alt="Formats" src="https://img.shields.io/badge/formats-PPTX%20%C2%B7%20Web%20%C2%B7%20Poster%20%C2%B7%20Social-EDEDED?style=flat-square&labelColor=0E0E11">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-EDEDED?style=flat-square&labelColor=0E0E11">
</p>

---

You bring the topic, the text and the numbers. The skill decides the layout, picks the right chart for each piece of data, builds the file and checks it before handing it over. Every output (a 16-slide pitch deck, a landing page or an Instagram post) uses the same design system, so they all look like one brand.

## Gallery

**Pitch deck (.pptx).** Every slide has speaker notes, auto-playing animations and fade transitions.

![Deck cover slide](assets/deck-cover.jpg)

![Eight slides from the example deck](assets/deck-grid.jpg)

**Website.** A responsive, single-file landing page; sections animate in as they scroll into view.

![Website hero animation](assets/website-animation.gif)

<table>
  <tr>
    <td width="72%" valign="top"><img src="assets/website.jpg" alt="Full landing page, desktop"></td>
    <td width="28%" valign="top"><img src="assets/website-mobile.jpg" alt="Landing page on a phone"></td>
  </tr>
</table>

**Poster and social post.** Instagram portrait (1080 × 1350), A4 and A3 print, LinkedIn and 16:9 sizes are built in.

<table>
  <tr>
    <td width="40%" valign="top"><img src="assets/poster.jpg" alt="Event poster, Instagram portrait size"></td>
    <td width="60%" valign="top"><img src="assets/components.png" alt="Component sheet"><br><img src="assets/deck-architecture.jpg" alt="Architecture slide with an exploded isometric stack"></td>
  </tr>
</table>

Every image here was made with this skill's own code. Sources: [`examples/`](examples) and [`assets/src/`](assets/src).

## What the skill does

- **One look for every format.** PowerPoint decks, websites and landing pages, posters, flyers, Instagram posts and carousels, LinkedIn banners and dashboard one-pagers all share the same design system.
- **Matches each piece of data to a visual.** One number becomes a dot-matrix numeral, a trend becomes a dotted bar chart, a share becomes a ring gauge, layers become an isometric stack, a journey becomes a row of cards. The full mapping is [below](#content-to-visual).
- **Real gradients and animation in PowerPoint.** pptxgenjs can't make gradient text, gradient borders or animations, so the skill includes two small scripts that add them after the deck is built.
- **Blends in your own hero image.** Give it artwork on a black background and it makes the black transparent, softens the edges and adds a glow and a slowly turning dotted ring.
- **Checks its own work.** It renders every page or slide, looks for overflow, overlaps and poor contrast, and fixes them before delivering.
- **Keeps your data honest.** It shows real numbers exactly and labels example numbers as examples.

## Install

The skill is the folder [`monochrome-chrome-design/`](monochrome-chrome-design): a `SKILL.md` plus ready-to-run scripts.

### Claude.ai (web and desktop app)

1. Download [`dist/monochrome-chrome-design.zip`](dist/monochrome-chrome-design.zip) (or zip the `monochrome-chrome-design/` folder yourself; the folder name must stay `monochrome-chrome-design`).
2. Make sure **Code execution and file creation** is turned on.
3. Go to **Settings → Capabilities → Skills**, click **Upload skill** and choose the zip.
4. Switch the skill on in your skills list.

Skills are available on the Pro, Max, Team and Enterprise plans. On Enterprise, an owner first has to turn on skills and code execution in Admin settings. See Anthropic's guide: [Use skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

### Claude Code

```bash
git clone https://github.com/YOUR-USERNAME/monochrome-chrome-design.git

# for all your projects
cp -r monochrome-chrome-design/monochrome-chrome-design ~/.claude/skills/

# or for one project only
cp -r monochrome-chrome-design/monochrome-chrome-design .claude/skills/
```

Start a new session and Claude picks up the skill automatically when you ask for this style.

### Claude API

Upload the same folder as a custom skill. See Anthropic's [Agent Skills guide](https://platform.claude.com/docs/en/build-with-claude/skills-guide).

## Usage

Name the skill (or just the style) and give the content:

```text
Use the monochrome-chrome-design skill to make a 14-slide investor pitch deck (.pptx)
for "Orbit", an AI bookkeeping app for Indian freelancers.
Tagline: "Your books, done while you sleep."
Traction data (real): 2,400 users, ₹18 lakh ARR, 31% month-on-month growth.
Add speaker notes with simple analogies for the technical parts.
```

```text
Use the monochrome-chrome-design skill to build a single-page website for "Ledgerly",
privacy-first expense tracking for small teams: hero, 4 features in a bento grid,
stats, 3 pricing plans in INR with the middle one highlighted, FAQ, footer.
```

```text
Use the monochrome-chrome-design skill to make an Instagram post (1080 × 1350)
for "Build Night", a 48-hour AI hackathon in Mumbai on 21–23 Nov 2026:
300 builders, ₹5 lakh prize pool, 4 tracks. Call to action: "Apply now".
```

There are ten ready-made prompts, plus a fill-in brief template, in [**examples/prompts.md**](examples/prompts.md): pitch decks, results reports, landing pages, agency sites, posters, carousels, LinkedIn images, dashboards, and restyling something you already have.

**Tips for good results**

- Paste your real data and say which numbers are real and which are examples.
- List your sections or slides in order. Otherwise the skill uses a proven story order: problem, vision, how it works, features, journey, limits, roadmap.
- Give the exact pixel size for social and print work.
- For a hero image, use artwork on a pure black background. You must have the rights to use it.

## The design system

### Tokens

| Token | Value | Used for |
|---|---|---|
| Background | `#050506` | Every frame, under the spotlight lighting |
| Text | `#EDEDED` | Body text, filled dots, active ticks, primary buttons |
| White | `#FFFFFF` | The single most important element |
| Muted | `#8A8A92` | Secondary sentences, captions |
| Dim | `#5C5C64` | Mono labels, indices, footers |
| Headline gradient | `#FFFFFF → #7E7E86` | All headings |
| Glass fill | `#1D1D22 → #0B0B0E` | Cards |
| Glass border | `#82828A → #2C2C32 → #18181C` | Card edges, lit from above |

Type: **Inter** (regular weight, gradient) for headings and text, **JetBrains Mono** (uppercase, small) for labels, data and status. There are no colour accents: emphasis comes from brightness and a soft white glow, and each group has exactly one highlighted element.

### Content to visual

| Your content | Visual |
|---|---|
| One headline number | Dot-matrix numeral in a dashboard card |
| Values over time | Dotted bar chart, with the latest bars in white |
| A share, score or completion | Dotted ring gauge or tick meter |
| Weights or settings | Stack of tick meters |
| Layers, a stack, levels | Exploded isometric stack |
| An exchange between two parties | Sequence diagram |
| Three parties with trust or flow | Triangle diagram |
| Ordered steps | Flow chain of icon boxes |
| Network, reach, ecosystem | Wireframe globe with chips |
| Levels of access | Nested layer cards |
| Strengths vs limits | Two-panel comparison |
| Phases or a timeline | Roadmap with progress meters |
| A user's day, a customer journey | Journey cards |

## Use the code without Claude

The `scripts/` folder works on its own:

| File | What it does |
|---|---|
| [`chrome.css`](monochrome-chrome-design/scripts/chrome.css) | CSS kit: tokens, spotlit `.stage`, `.glass` cards, `.badge`, `.pill`, `.chip`, `.hud` brackets, `.ticks`, `.wordmark` and `.a-*` animations |
| [`generators.js`](monochrome-chrome-design/scripts/generators.js) | SVG generators: `dotNumber`, `dotBars`, `gauge`, `bigRing`, `halo`, `glow`, `background`, `isoStack`. Works in the browser or in Node |
| [`hero_blend.py`](monochrome-chrome-design/scripts/hero_blend.py) | Blends a black-background image into the theme |
| [`pptx_gradients.py`](monochrome-chrome-design/scripts/pptx_gradients.py) | Swaps marker colours for real gradients in a .pptx |
| [`pptx_animate.py`](monochrome-chrome-design/scripts/pptx_animate.py) | Adds auto-play animations, slow spins and fade transitions to a .pptx |

A minimal web page:

```html
<link rel="stylesheet" href="chrome.css">
<div class="stage hero" style="padding:64px">
  <span class="badge">New release</span>
  <h1 class="grad-text a-rise">See every visit.<br>Store nobody.</h1>
  <div class="glass hi hud" style="padding:24px;width:320px">
    <span class="chip">Live</span>
    <div id="stat"></div>
  </div>
</div>
<script src="generators.js"></script>
<script>document.getElementById('stat').innerHTML = dotNumber('98%', 10).svg;</script>
```

Building a deck in code: make it with [pptxgenjs](https://gitbrent.github.io/PptxGenJS/), using the marker colours and animation tags described in `SKILL.md` section 7, then run:

```bash
python3 pptx_gradients.py deck.pptx
python3 pptx_animate.py deck.pptx
```

## Repository layout

```text
monochrome-chrome-design/
├── monochrome-chrome-design/      ← the skill (upload or copy this folder)
│   ├── SKILL.md
│   └── scripts/
│       ├── chrome.css
│       ├── generators.js
│       ├── hero_blend.py
│       ├── pptx_gradients.py
│       └── pptx_animate.py
├── dist/
│   └── monochrome-chrome-design.zip   ← ready to upload to Claude.ai
├── examples/
│   ├── prompts.md                     ← demo prompts and brief template
│   ├── deck/Veil-Blueprint.pptx       ← 16-slide example deck
│   ├── website/index.html             ← example landing page
│   └── poster/poster.html             ← example Instagram post
├── assets/                            ← README images (+ src/ HTML sources)
├── LICENSE
└── README.md
```

## Good to know

- **Fonts.** Install [Inter](https://fonts.google.com/specimen/Inter) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (both free) on the computer you present or edit on. Websites load them from Google Fonts automatically.
- **PowerPoint vs other apps.** Gradient text, glass borders and animations are native PowerPoint features. Keynote and Google Slides may show them as flat colours or drop the animations.
- **Previews.** LibreOffice previews show gradient text as solid and ignore animations; PowerPoint shows both.
- **Example content.** Veil, Signal, Build Night and every number in the examples are made up, for demonstration only.

## License

[MIT](LICENSE). Use it for personal and commercial work, and credit is appreciated.
