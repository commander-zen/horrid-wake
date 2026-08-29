export function initCampfire() {
  const canvas = document.getElementById('ec');
  const ctx = canvas.getContext('2d');
  function rsz(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  rsz(); window.addEventListener('resize', rsz);

  const embers = Array.from({length:55}, ()=>mkE(true));
  function mkE(r){
    const cx=innerWidth/2;
    return{x:cx+(Math.random()-.5)*70,y:r?innerHeight*(.42+Math.random()*.48):innerHeight*.75,
      vx:(Math.random()-.5)*.8,vy:-(0.4+Math.random()*1.6),
      life:r?Math.random():0,max:.4+Math.random()*.9,r:.6+Math.random()*2,
      c:Math.random()>.42?'#38bdf8':'#8fd6ff'};
  }
  (function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    embers.forEach(e=>{
      e.x+=e.vx+Math.sin(e.life*9)*.45; e.y+=e.vy; e.life+=.007;
      if(e.life>e.max) Object.assign(e,mkE(false));
      const a=Math.sin(e.life/e.max*Math.PI)*.85;
      ctx.globalAlpha=a; ctx.fillStyle=e.c;
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(anim);
  })();
}
