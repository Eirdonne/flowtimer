# FlowTimer for macOS

A minimal always-on-top timer designed for study and focus. It includes a floating timer window plus a compact notch-style island.

## Controls

- Single click on the timer: start/pause.
- Double click on the timer: reset and start the selected interval.
- Count down or count up forever.
- Choose a duration with presets or type a custom duration.
- Drag the floating window by its surface.
- Use the notch island to stop, reset/repeat, change mode, or quit.

## Build on GitHub

The included GitHub Actions workflow builds a macOS `.zip` and `.dmg` on an Apple Silicon runner. No Xcode or Terminal is needed on the target Mac. After the workflow finishes, download the artifact from the Actions run.
