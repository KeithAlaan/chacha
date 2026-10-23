const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* name letters */
const nameEl=$('#name');
[...'Charisse'].forEach(c=>nameEl.append(Object.assign(document.createElement('span'),{textContent:c,ariaHidden:'true'})));
nameEl.append(document.createElement('br'));
[...'Toriing'].forEach(c=>nameEl.append(Object.assign(document.createElement('span'),{textContent:c,ariaHidden:'true'})));
nameEl.addEventListener('click',e=>{
  if(e.target.tagName==='SPAN'){e.target.classList.remove('pop');void e.target.offsetWidth;e.target.classList.add('pop');burst(e.clientX,e.clientY,12)}
});

/* typewriter */
const lines=['Hi there! 👋 I\'m','Welcome to my corner of the internet. I\'m'];
let li=0,ci=0,del=false;
function type(){
  const t=$('#typed'),s=lines[li];
  if(reduce){t.textContent=lines[0];return}
  t.textContent=s.slice(0,ci);
  if(!del&&ci<s.length){ci++;setTimeout(type,45)}
  else if(!del){del=li===0;if(li===0){setTimeout(type,1400)}}
  else if(ci>0){ci--;setTimeout(type,25)}
  else{del=false;li=1;setTimeout(type,200)}
}
type();

/* theme */
$('#themeBtn').onclick=e=>{
  const n=document.body.classList.toggle('night');
  e.currentTarget.setAttribute('aria-pressed',n);
  e.currentTarget.textContent=n?'☀️ Day mode':'🌙 Night mode';
};

/* facts */
const facts=['I can lose track of time when I\'m designing something.','I\'d pick milk tea over almost any drink.','My happiest place is near the sea.','I believe good design should need zero instructions.','I always hover over buttons to see what they do. You probably do too.','I\'m building this page for an HCI class. Hi, teacher! 👋'];
let fi=-1;
$('#factBtn').onclick=()=>{let n;do{n=Math.floor(Math.random()*facts.length)}while(n===fi);fi=n;$('#factText').textContent=facts[n];burst(innerWidth/2,innerHeight/2,8)};

/* flip cards */
$$('.flip').forEach(b=>b.onclick=()=>b.classList.toggle('on'));

/* skills */
const skills=[['HTML and CSS',80,'Making things look right.'],['JavaScript',65,'Making things do stuff.'],['UI and UX thinking',85,'Making things easy to use.'],['Teamwork',90,'Making things happen together.'],['Time management',70,'Work in progress, honestly.']];
$('#skillList').innerHTML=skills.map(s=>`<div class="skill" title="${s[2]}"><div class="row"><span>${s[0]}</span><span>${s[1]}%</span></div><div class="bar"><i data-w="${s[1]}"></i></div></div>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+'%';io.unobserve(e.target)}}),{threshold:.4});
$$('.bar i').forEach(i=>io.observe(i));

/* mood */
const moods={chill:'Slow playlist, a window seat, and milk tea. Zero notifications.',hype:'Loud music, a long to-do list, and every item getting crossed off by lunch.',focus:'Headphones on, one tab open, and a stubborn bug that is about to lose.',hungry:'Forget the plan. We are finding the best food nearby, and I am ordering extra.'};
$$('.mood').forEach(b=>b.onclick=()=>{
  $$('.mood').forEach(x=>x.setAttribute('aria-pressed',x===b));
  $('#moodOut').textContent=moods[b.dataset.m];
});

/* copy email */
$('#copyBtn').onclick=async()=>{
  try{await navigator.clipboard.writeText('semblantecharisse69@gmail.com');toast('Email copied ✅')}
  catch{toast('Could not copy. Select the email above and copy it.')}
};

/* toast */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}

/* stickers */
const found=new Set();
$$('.sticker[data-s]').forEach(b=>b.onclick=e=>{
  const id=b.dataset.s;if(found.has(id))return;
  found.add(id);b.classList.add('got');
  const n=found.size;
  $$('#dots i').forEach((d,i)=>d.classList.toggle('on',i<n));
  $('#count').textContent=n+'/5';
  burst(e.clientX,e.clientY,16);
  if(n===5){toast('All stickers found! Scroll to the bottom 🎉');$('#secret').classList.add('show');setTimeout(()=>{burst(innerWidth/2,innerHeight/3,120)},300)}
  else toast(b.dataset.msg+' ('+(5-n)+' to go)');
});


/* games: tabs */
$$('.tab').forEach(t=>t.onclick=()=>{
  $$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));
  $$('.game').forEach(g=>g.classList.toggle('show',g.id===t.dataset.g));
});

/* game 1: star catcher */
let score=0,best=0,left=15,timer=null,playing=false;
function spawn(){
  if(!playing)return;
  const a=$('#arena');$$('.target').forEach(x=>x.remove());
  const t=document.createElement('button');t.className='target';t.setAttribute('aria-label','Star, tap it');
  const bonus=Math.random()<.15;
  t.textContent=bonus?'💎':'⭐';
  t.style.left=Math.random()*(a.clientWidth-60)+'px';
  t.style.top=Math.random()*(a.clientHeight-60)+'px';
  const hit=e=>{e.preventDefault();score+=bonus?3:1;$('#sc').textContent=score;const r=t.getBoundingClientRect();burst(r.left+28,r.top+28,6);spawn()};
  t.addEventListener('pointerdown',hit);
  a.append(t);
  clearTimeout(t._m);setTimeout(()=>{if(t.isConnected&&playing)spawn()},bonus?800:1100);
}
$('#startStar').onclick=()=>{
  clearInterval(timer);score=0;left=15;playing=true;
  $('#sc').textContent=0;$('#tm').textContent=left;$('#arenaMsg').style.display='none';
  spawn();
  timer=setInterval(()=>{
    left--;$('#tm').textContent=left;
    if(left<=0){
      clearInterval(timer);playing=false;$$('.target').forEach(x=>x.remove());
      const nb=score>best;if(nb){best=score;$('#bs').textContent=best}
      const m=$('#arenaMsg');m.style.display='grid';
      m.textContent=(nb&&score>0?'New best! ':'Time is up. ')+'You scored '+score+'. Press Start to try again.';
      if(nb&&score>0)burst(innerWidth/2,innerHeight/2,60);
    }
  },1000);
};

/* game 2: memory match */
const faces=['🍓','🎧','🎨','🌴','🎮','🧋','🚀','🌈'];
let first=null,lock=false,moves=0,pairs=0,mbest=null;
function buildMem(){
  const deck=[...faces,...faces].sort(()=>Math.random()-.5);
  const grid=$('#mem');grid.innerHTML='';moves=0;pairs=0;first=null;lock=false;
  $('#mv').textContent=0;$('#memOut').textContent='Flip two cards to find matching pairs.';
  deck.forEach(f=>{
    const b=document.createElement('button');b.className='mcard';b.dataset.f=f;b.setAttribute('aria-label','Hidden card');
    b.innerHTML='<span class="q">?</span>';
    b.onclick=()=>flipCard(b);grid.append(b);
  });
}
function flipCard(b){
  if(lock||b.classList.contains('up')||b.classList.contains('done'))return;
  b.classList.add('up');b.textContent=b.dataset.f;b.setAttribute('aria-label','Card '+b.dataset.f);
  if(!first){first=b;return}
  moves++;$('#mv').textContent=moves;
  if(first.dataset.f===b.dataset.f){
    first.classList.add('done');b.classList.add('done');first=null;pairs++;
    if(pairs===faces.length){
      const nb=mbest===null||moves<mbest;if(nb){mbest=moves;$('#mbest').textContent=mbest}
      $('#memOut').textContent='You matched all pairs in '+moves+' moves!'+(nb?' New best!':'');
      burst(innerWidth/2,innerHeight/2,80);
    }else $('#memOut').textContent='Match! '+(faces.length-pairs)+' pairs left.';
  }else{
    lock=true;$('#memOut').textContent='Not a match. Try again.';
    const a=first;first=null;
    setTimeout(()=>{[a,b].forEach(c=>{c.classList.remove('up');c.innerHTML='<span class="q">?</span>';c.setAttribute('aria-label','Hidden card')});lock=false},750);
  }
}
$('#resetMem').onclick=buildMem;buildMem();

/* game 3: rock paper scissors */
const em={rock:'✊',paper:'✋',scissors:'✌️'},beats={rock:'scissors',paper:'rock',scissors:'paper'};
let w=0,l=0,t=0;
$$('#rps .btn').forEach(b=>b.onclick=()=>{
  const me=b.dataset.c,cpu=Object.keys(em)[Math.floor(Math.random()*3)];
  let r;
  if(me===cpu){t++;r='Tie! We both picked '+em[me]+'.'}
  else if(beats[me]===cpu){w++;r='You win! '+em[me]+' beats '+em[cpu]+'.';burst(b.getBoundingClientRect().left+30,b.getBoundingClientRect().top,18)}
  else{l++;r='I win! '+em[cpu]+' beats '+em[me]+'. Rematch?'}
  $('#rw').textContent=w;$('#rl').textContent=l;$('#rt').textContent=t;$('#rpsOut').textContent=r;
});

/* confetti */
const cv=$('#fx'),cx=cv.getContext('2d');let ps=[];
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
function burst(x,y,n){
  if(reduce)return;
  const cols=['#FF4F8B','#FFD84D','#5FD6B0','#6C7BFF','#ffffff'];
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=3+Math.random()*7;
    ps.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-4,s:4+Math.random()*6,c:cols[i%cols.length],l:70+Math.random()*30,r:Math.random()*6})}
  if(ps.length===n)loop();
}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  ps=ps.filter(p=>p.l>0);
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.l--;p.r+=.2;cx.save();cx.globalAlpha=Math.min(1,p.l/30);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);cx.restore()});
  if(ps.length)requestAnimationFrame(loop);else cx.clearRect(0,0,cv.width,cv.height);
}
$('#confettiBtn').onclick=e=>burst(e.clientX,e.clientY,70);
