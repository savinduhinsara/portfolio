const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile navigation
$('#menuBtn').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Typewriter
const phrases = ['build("something_interesting")', 'learn("one_more_thing")', 'explore("the_unknown")', 'ship("the_next_version")'];
let pi=0, ci=0, deleting=false;
function typeLoop(){
  const target=$('#typed'), word=phrases[pi];
  target.textContent=deleting ? word.slice(0,ci--) : word.slice(0,ci++);
  if(!deleting && ci>word.length){deleting=true;setTimeout(typeLoop,1200);return}
  if(deleting && ci<0){deleting=false;pi=(pi+1)%phrases.length;ci=0}
  setTimeout(typeLoop,deleting?35:65);
}
typeLoop();

// Project filters
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter;
  $$('.project-card').forEach(card => card.classList.toggle('hide', f!=='all' && card.dataset.type!==f));
}));

// Terminal
const commands = {
  help: 'commands: about, skills, projects, lab, contact, whoami, clear, matrix',
  whoami: 'Savindu Hinsara // student // developer // creator // curious human',
  about: 'Student, builder, language learner and lifelong rabbit-hole explorer.',
  skills: 'HTML · CSS · JavaScript · Python · PHP · MySQL · Godot/GDScript (learning)',
  projects: 'ALLONSLAND · PROJECT AUGUSTA: SEA · WEB LAB · CREATOR MODE',
  lab: 'Experimental systems online. Curiosity levels: unnecessarily high.',
  contact: 'Scroll to CONTACT or use the command palette. No fake inboxes here.',
  matrix: 'Wake up, Neo. ...just kidding. This is a portfolio.',
  clear: ''
};
const out=$('#terminalOutput');
$('#terminalInput').addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  const raw=e.target.value.trim(), cmd=raw.toLowerCase();
  if(!raw) return;
  const line=document.createElement('p'); line.innerHTML=`<span class="green">guest@sh:~$</span> ${escapeHtml(raw)}`; out.appendChild(line);
  if(cmd==='clear'){out.innerHTML='';}
  else {
    const ans=document.createElement('p'); ans.innerHTML=commands[cmd] ? escapeHtml(commands[cmd]) : `unknown command: ${escapeHtml(cmd)} — type <b>help</b>`;
    out.appendChild(ans);
  }
  e.target.value=''; out.scrollTop=out.scrollHeight;
});
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

// Command palette
const sections=[
  ['HOME','Return to the landing system','#home'],
  ['ABOUT','Identity file and profile','#about'],
  ['SKILLS','Capability matrix','#skills'],
  ['PROJECTS','Things being built','#projects'],
  ['LAB','Interactive terminal and experiments','#lab'],
  ['ROAD AHEAD','Trajectory','#timeline'],
  ['CONTACT','Transmission channel','#contact']
];
const palette=$('#commandPalette'), pInput=$('#paletteInput'), pResults=$('#paletteResults');
let selected=0;
function renderResults(q=''){
  const list=sections.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(q.toLowerCase()));
  pResults.innerHTML=list.map((x,i)=>`<div class="palette-result ${i===0?'selected':''}" data-target="${x[2]}">${x[0]}<small>${x[1]}</small></div>`).join('');
  $$('.palette-result').forEach(el=>el.onclick=()=>{closePalette();document.querySelector(el.dataset.target).scrollIntoView({behavior:'smooth'});});
  selected=0;
}
function openPalette(){palette.classList.add('open');palette.setAttribute('aria-hidden','false');pInput.value='';renderResults();setTimeout(()=>pInput.focus(),20)}
function closePalette(){palette.classList.remove('open');palette.setAttribute('aria-hidden','true')}
$('#cmdBtn').onclick=openPalette; $('#closePalette').onclick=closePalette;
palette.addEventListener('click',e=>{if(e.target===palette)closePalette()});
pInput.addEventListener('input',e=>renderResults(e.target.value));
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()}
  if(e.key==='Escape')closePalette();
  if(!palette.classList.contains('open'))return;
  const items=$$('.palette-result');
  if(e.key==='ArrowDown'){e.preventDefault();selected=(selected+1)%items.length}
  if(e.key==='ArrowUp'){e.preventDefault();selected=(selected-1+items.length)%items.length}
  if(e.key==='Enter'&&items[selected]){items[selected].click()}
  items.forEach((x,i)=>x.classList.toggle('selected',i===selected));
});

// Contact form: local demo behavior, no data is sent anywhere.
$('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const msg=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  navigator.clipboard?.writeText(msg);
  $('#formStatus').textContent='TRANSMISSION PACKET COPIED TO CLIPBOARD. Connect this form to your backend to send it for real.';
  e.target.reset();
});

// Back to top
const back=$('#backTop');
window.addEventListener('scroll',()=>back.classList.toggle('show',scrollY>600));
back.onclick=()=>scrollTo({top:0,behavior:'smooth'});

// Matrix/circuit background
const canvas=$('#matrix'), ctx=canvas.getContext('2d');
let w,h,cols,drops;
function resizeMatrix(){
  w=canvas.width=innerWidth*devicePixelRatio; h=canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  cols=Math.floor(innerWidth/18); drops=Array(cols).fill(0).map(()=>Math.random()*innerHeight/18);
}
resizeMatrix(); addEventListener('resize',resizeMatrix);
function drawMatrix(){
  ctx.fillStyle='rgba(5,7,13,.12)';ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.font='11px JetBrains Mono, monospace';
  for(let i=0;i<cols;i++){
    const chars='01<>[]{}/*+=-';
    const ch=chars[Math.floor(Math.random()*chars.length)];
    ctx.fillStyle=Math.random()>.92?'#65f7c7':'#263a4b';
    ctx.fillText(ch,i*18,drops[i]*18);
    if(drops[i]*18>innerHeight && Math.random()>.975)drops[i]=0;
    drops[i]+=.45;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();
