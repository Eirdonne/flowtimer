const timeEl = document.getElementById('time');
const progressFill = document.getElementById('progressFill');
const statusEl = document.getElementById('status');
const modeButton = document.getElementById('modeButton');
const durationSelect = document.getElementById('durationSelect');
const resetButton = document.getElementById('resetButton');
const stopButton = document.getElementById('stopButton');
const card = document.getElementById('card');
let state = { mode: 'down', duration: 300, elapsed: 0, running: false, updatedAt: Date.now() };
let lastComplete = false;

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return h > 0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function derived() {
  const now = Date.now();
  const elapsed = state.running ? state.elapsed + (now - state.updatedAt) / 1000 : state.elapsed;
  return { elapsed, remaining: Math.max(0, state.duration - elapsed) };
}
function render() {
  const { elapsed, remaining } = derived();
  const complete = state.mode === 'down' && state.duration > 0 && remaining <= 0;
  timeEl.textContent = formatTime(state.mode === 'down' ? remaining : elapsed);
  progressFill.style.width = state.mode === 'down' ? `${Math.max(0, Math.min(1, remaining / state.duration)) * 100}%` : '100%';
  modeButton.textContent = state.mode === 'down' ? 'COUNTDOWN' : 'COUNT UP';
  statusEl.textContent = complete ? 'Time is up' : state.running ? 'Running' : 'Ready';
  document.body.classList.toggle('complete', complete);
  if (complete && !lastComplete) {
    lastComplete = true;
    beep();
    window.flowTimer.notifyComplete();
  }
  if (!complete) lastComplete = false;
}
function commit(next) { state = { ...state, ...next, updatedAt: Date.now() }; window.flowTimer.setState(state); render(); }
function beep() {
  try { const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.16, ctx.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .45); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .46); } catch {}
}
function toggle() {
  const { elapsed, remaining } = derived();
  if (state.mode === 'down' && remaining <= 0) return resetAndStart();
  commit({ elapsed, running: !state.running });
}
function resetAndStart() { commit({ elapsed: 0, running: true }); }
function stop() { const { elapsed } = derived(); commit({ elapsed, running: false }); }

card.addEventListener('click', (event) => { if (event.target.closest('button,select')) return; toggle(); });
card.addEventListener('dblclick', (event) => { if (event.target.closest('button,select')) return; resetAndStart(); });
modeButton.addEventListener('click', () => { const { elapsed } = derived(); commit({ mode: state.mode === 'down' ? 'up' : 'down', elapsed, running: false }); });
durationSelect.addEventListener('change', () => { let value = durationSelect.value; if (value === 'custom') { const input = prompt('Countdown duration in minutes', '20'); const minutes = Number(input); if (!Number.isFinite(minutes) || minutes <= 0) { durationSelect.value = String(state.duration); return; } value = String(Math.round(minutes * 60)); } const seconds = Number(value); commit({ duration: seconds, elapsed: 0, running: false }); });
resetButton.addEventListener('click', resetAndStart);
stopButton.addEventListener('click', stop);
window.flowTimer.onState((next) => { state = next; render(); });
window.flowTimer.getState().then((next) => { state = next; render(); });
setInterval(render, 100);
