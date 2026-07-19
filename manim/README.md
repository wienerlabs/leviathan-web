# Leviathan Manim explain scenes

3Blue1Brown-style chalkboard scenes for bond economics, Proof of Gradient, and the audit lottery.

## Setup

```bash
# macOS deps
brew install cairo ffmpeg pkg-config

# Python 3.10+ recommended
pip install manim
```

Optional for best LaTeX: install a TeX distribution (`mactex-no-gui` or `basictex`).

## Render

```bash
cd manim
manim -pqh leviathan_explain.py BondScene
manim -pqh leviathan_explain.py PogScene
manim -pqh leviathan_explain.py AuditScene
```

Flags:

- `-p` preview
- `-ql` low quality (fast)
- `-qh` high quality
- `-qk` 4K

Videos appear under `media/videos/`.

## Site twin

The landing page section **Explain · 3B1B style** mirrors these scenes in the browser with KaTeX + Motion (no Manim runtime required for the website).
