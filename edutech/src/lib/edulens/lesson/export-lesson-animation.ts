import type { LearningVisualLesson } from "../types";

const EXPORT_CSS = `
body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:24px}
.wrap{max-width:720px;margin:0 auto}
h1{font-size:1.25rem;margin:0 0 8px}
.meta{font-size:.85rem;color:#94a3b8;margin-bottom:20px}
.stage{background:linear-gradient(180deg,#1e293b,#312e81);border-radius:12px;padding:20px;margin:16px 0;min-height:180px}
.step-card{background:#fff;color:#1e293b;border-radius:10px;padding:16px;margin-top:12px}
.controls{display:flex;gap:8px;margin-top:16px}
button{background:#6366f1;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:.85rem}
button:disabled{opacity:.4;cursor:not-allowed}
.dots{display:flex;gap:4px;margin:12px 0}
.dot{flex:1;height:4px;border-radius:2px;background:#475569}
.dot.on{background:#818cf8}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.anim{animation:fadeIn .6s ease-out}
svg{display:block;margin:0 auto}
`;

/**
 * Downloads a self-contained HTML slideshow of the lesson animation.
 */
export function downloadLessonAnimationHtml(
  lesson: LearningVisualLesson,
  filenameStem: string
): void {
  const stepsJson = JSON.stringify(lesson.steps).replace(/</g, "\\u003c");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(lesson.title)}</title>
<style>${EXPORT_CSS}</style>
</head>
<body>
<div class="wrap">
  <h1>${escapeHtml(lesson.title)}</h1>
  <p class="meta">${escapeHtml(lesson.knowledgeGap)}</p>
  <div class="dots" id="dots"></div>
  <div class="stage anim" id="stage"></div>
  <div class="step-card anim" id="card"></div>
  <div class="controls">
    <button id="prev">← Prev</button>
    <button id="play">Pause</button>
    <button id="next">Next →</button>
  </div>
  <p class="meta" id="summary" style="margin-top:20px"></p>
</div>
<script>
const lesson=${JSON.stringify({ title: lesson.title, knowledgeGap: lesson.knowledgeGap, summary: lesson.summary })};
const steps=${stepsJson};
let i=0, playing=true, timer;
const stage=document.getElementById('stage');
const card=document.getElementById('card');
const dots=document.getElementById('dots');
const summary=document.getElementById('summary');
steps.forEach(()=>{const d=document.createElement('div');d.className='dot';dots.appendChild(d);});
function svgParabola(){
  return '<svg viewBox="0 0 320 200" width="100%" height="200"><line x1="40" y1="170" x2="290" y2="170" stroke="#94a3b8" stroke-width="2"/><line x1="160" y1="20" x2="160" y2="170" stroke="#475569" stroke-width="1" stroke-dasharray="4"/><path d="M 60 150 Q 160 30 260 150" fill="none" stroke="#a5b4fc" stroke-width="3"/><circle cx="160" cy="55" r="5" fill="#fbbf24"/><circle cx="95" cy="170" r="4" fill="#34d399"/><circle cx="225" cy="170" r="4" fill="#34d399"/><text x="152" y="48" fill="#fde68a" font-size="11">vertex</text></svg>';
}
function render(){
  dots.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('on',j<=i));
  const s=steps[i];
  stage.innerHTML=svgParabola();
  card.innerHTML='<strong>Step '+(i+1)+' / '+steps.length+': '+esc(s.title)+'</strong><p style="margin:8px 0 0;line-height:1.6">'+esc(s.body)+'</p>'+(s.latex?'<p style="font-family:serif;font-style:italic;color:#4338ca">'+esc(s.latex)+'</p>':'');
  summary.textContent=i===steps.length-1?lesson.summary:'';
  document.getElementById('prev').disabled=i===0;
  document.getElementById('next').disabled=i===steps.length-1;
}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function next(){if(i<steps.length-1){i++;render();}}
function prev(){if(i>0){i--;render();}}
function schedule(){clearTimeout(timer);if(playing&&i<steps.length-1)timer=setTimeout(()=>{next();schedule();},5500);}
document.getElementById('next').onclick=()=>{next();schedule();};
document.getElementById('prev').onclick=()=>{prev();schedule();};
document.getElementById('play').onclick=()=>{playing=!playing;document.getElementById('play').textContent=playing?'Pause':'Play';schedule();};
render();schedule();
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filenameStem || "lesson-animation"}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
