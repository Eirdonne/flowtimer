const timeEl = document.getElementById('time');
const timeButton = document.getElementById('timeButton');
const fill = document.getElementById('fill');
const mode = document.getElementById('mode');
const toggle = document.getElementById('toggle');
const reset = document.getElementById('reset');
const stop = document.getElementById('stop');
const quit = document.getElementById('quit');
let state = { mode:'down', duration:300, elapsed:0, running:false, updatedAt:Date.now() };
function derived() { const elapsed = state.running ? state.elapsed + (Date.now()-state.updatedAt)/1000 : state.elapsed; return {elapsed, remaining:Math.max(0,state.duration-elapsed)}; }
function fmt(sec) { const s=Math.max(0,Math.floor(sec)); const m=Math.floor(s/60), r=s%60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; }
function render() { const {elapsed,remaining}=derived(); timeEl.textContent=state.mode==='down'?fmt(remaining):fmt(elapsed); fill.style.width=state.mode==='down'?`${Math.max(0,remaining/state.duration)*100}%`:'100%'; mode.textContent=state.mode==='down'?'●':'∞'; toggle.textContent=state.running?'Ⅱ':'▶'; }
function commit(next) { state={...state,...next,updatedAt:Date.now()}; window.flowTimer.setState(state); render(); }
toggle.addEventListener('click',()=>{const {elapsed,remaining}=derived(); if(state.mode==='down'&&remaining<=0) return commit({elapsed:0,running:true}); commit({elapsed,running:!state.running});});
reset.addEventListener('click',()=>commit({elapsed:0,running:true}));
stop.addEventListener('click',()=>{const {elapsed}=derived(); commit({elapsed,running:false});});
mode.addEventListener('click',()=>{const {elapsed}=derived(); commit({mode:state.mode==='down'?'up':'down',elapsed,running:false});});
timeButton.addEventListener('click',()=>{ if (state.mode !== 'down') return; const input = prompt('Countdown duration in minutes', String(Math.round(state.duration / 60))); const minutes = Number(input); if (Number.isFinite(minutes) && minutes > 0) commit({duration:Math.round(minutes * 60),elapsed:0,running:false}); });
quit.addEventListener('click',()=>window.flowTimer.quit());
let dragging=false, start=null;
document.querySelector('.grab').addEventListener('mousedown',(e)=>{dragging=true;start={x:e.screenX,y:e.screenY};});
window.addEventListener('mouseup',()=>dragging=false);
window.addEventListener('mousemove',(e)=>{if(!dragging||!start)return; window.flowTimer.showTimer();});
window.flowTimer.onState((next)=>{state=next;render();});
window.flowTimer.getState().then(next=>{state=next;render();});
setInterval(render,100);
