# FlowTimer implementation plan

## Product
A native-style macOS timer distributed as a `.zip` and `.dmg`, with a floating always-on-top window and a compact notch-style island. It is intentionally offline-first and stores no account data.

## Design
- **Style options:** Quiet glass utility (0.06), monochrome studio instrument (0.08), soft arcade focus tool (0.05).
- **Chosen movement:** Monochrome studio instrument.
- **Core principles:** calm, legible at a glance, minimal controls, fast repeatability.
- **Color philosophy:** near-black surfaces with white text and a single restrained blue progress accent for focus without visual noise.
- **Layout paradigm:** compact vertical timer card paired with a thin top-center island; controls stay secondary to the time readout.
- **Signature elements:** oversized tabular time, slim depleting progress line, rounded black glass surfaces.
- **Interaction philosophy:** click does one obvious thing; double-click is the fast reset-and-repeat gesture; the notch surface exposes the essentials without opening a settings screen.
- **Animation:** progress updates smoothly; completion briefly pulses the accent and plays one notification sound.
- **Typography:** system sans-serif stack with tabular numerals for stable time alignment.
- **Brand essence:** a quiet timer that stays present without getting in the way. Calm, precise, unobtrusive.

## Structure
- `src/main.js`: Electron lifecycle, window management, always-on-top behavior, IPC state bridge.
- `src/preload.js`: safe IPC bridge.
- `src/timer.html`, `src/timer.css`, `src/timer.js`: floating timer UI and timer engine.
- `src/notch.html`, `src/notch.css`, `src/notch.js`: compact notch-style control island.
- `.github/workflows/build-macos.yml`: macOS artifact build and upload.
