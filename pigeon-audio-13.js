(()=>{
  if(window.__pigeonAudio13Exact)return;
  window.__pigeonAudio13Exact=true;

  const PARTS=Array.from({length:10},(_,i)=>`/assets/pigeon13/part${String(i+1).padStart(2,'0')}.txt`);
  let audio=null,audioUrl=null,loading=null,activeCard=null;

  const style=document.createElement('style');
  style.id='pigeon-audio-13-style';
  style.textContent=`
    .brainrot-day.brainrot-pigeon .pigeon-audio-indicator{position:absolute;right:7px;top:34px;width:23px;height:23px;border-radius:999px;background:rgba(8,12,22,.82);border:1px solid rgba(255,255,255,.45);display:grid;place-items:center;font-size:12px;z-index:4;opacity:0;transform:scale(.78);pointer-events:none;box-shadow:0 3px 10px rgba(0,0,0,.3);transition:opacity .16s ease,transform .16s ease}
    .brainrot-day.brainrot-pigeon.pigeon-audio-playing .pigeon-audio-indicator{opacity:1;transform:scale(1);animation:pigeon-audio-pulse .62s ease-in-out infinite alternate}
    .brainrot-day.brainrot-pigeon.pigeon-audio-playing{border-color:#b9ddff!important;box-shadow:0 0 22px rgba(134,190,235,.62)!important}
    @keyframes pigeon-audio-pulse{from{box-shadow:0 0 0 0 rgba(151,211,255,.45),0 3px 10px rgba(0,0,0,.3)}to{box-shadow:0 0 0 5px rgba(151,211,255,0),0 3px 12px rgba(0,0,0,.38)}}
    @media(max-width:620px){.brainrot-day.brainrot-pigeon .pigeon-audio-indicator{right:4px;top:27px;width:20px;height:20px;font-size:10px}}
    @media(prefers-reduced-motion:reduce){.brainrot-day.brainrot-pigeon.pigeon-audio-playing .pigeon-audio-indicator{animation:none}}
  `;
  document.head.appendChild(style);

  function volumeFromSite(){
    const values=[window.siteVolume,window.masterVolume,window.brainrotVolume];
    for(const v of values){if(Number.isFinite(+v)){const n=+v;return Math.max(0,Math.min(1,n>1?n/100:n))}}
    for(const k of ['siteVolume','masterVolume','brainrotVolume','volume']){
      const raw=localStorage.getItem(k);if(raw!==null&&raw!==''&&!Number.isNaN(+raw)){const n=+raw;return Math.max(0,Math.min(1,n>1?n/100:n))}
    }
    const slider=document.querySelector('#site-volume,#master-volume,#brainrot-volume,[data-site-volume],[data-volume]');
    if(slider&&slider.type==='range'){
      const min=Number(slider.min||0),max=Number(slider.max||100),v=Number(slider.value);
      if(Number.isFinite(v)&&max>min)return Math.max(0,Math.min(1,(v-min)/(max-min)));
    }
    return 1;
  }
  function muted(){
    const b=document.getElementById('brainrot-sound');
    if(!b)return false;
    const t=(b.textContent||'').toLowerCase();
    return t.includes('sounds aus')||t.includes('🔇')||b.getAttribute('aria-pressed')==='false';
  }
  function clearPlaying(){
    if(activeCard)activeCard.classList.remove('pigeon-audio-playing');
    activeCard=null;
  }
  function stopPigeon(reset=true){
    if(audio){audio.pause();if(reset){try{audio.currentTime=0}catch{}}}
    clearPlaying();
  }
  function stopOtherSounds(){
    if('speechSynthesis'in window)window.speechSynthesis.cancel();
    document.dispatchEvent(new CustomEvent('brainrot-stop-all-sounds',{detail:{except:'pigeon13'}}));
  }
  async function prepareAudio(){
    if(audio)return audio;
    if(loading)return loading;
    loading=(async()=>{
      const chunks=await Promise.all(PARTS.map(async p=>{const r=await fetch(p,{cache:'force-cache'});if(!r.ok)throw new Error('Audio-Teil fehlt: '+p);return r.text()}));
      const b64=chunks.join('').replace(/\s+/g,'');
      const bin=atob(b64),bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      audioUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
      audio=new Audio(audioUrl);
      audio.preload='auto';audio.loop=false;audio.playsInline=true;
      audio.volume=volumeFromSite();
      audio.addEventListener('ended',clearPlaying);
      audio.addEventListener('error',clearPlaying);
      audio.load();
      return audio;
    })().catch(e=>{loading=null;console.error('Whispering Pigeon Audio:',e);throw e});
    return loading;
  }
  async function playPigeon(card){
    stopOtherSounds();
    stopPigeon(true);
    if(muted())return;
    try{
      const a=await prepareAudio();
      a.volume=volumeFromSite();
      a.pause();a.currentTime=0;
      activeCard=card;card.classList.add('pigeon-audio-playing');
      await a.play();
    }catch(e){clearPlaying();console.warn('Whispering Pigeon konnte noch nicht abgespielt werden:',e)}
  }
  function isPigeon(card){
    if(!card)return false;
    const num=card.querySelector('.brainrot-num')?.textContent.trim();
    const name=card.querySelector('.brainrot-name')?.textContent.trim().toLowerCase()||'';
    return num==='13'&&name.includes('whispering pigeon');
  }
  function upgrade(card){
    if(!isPigeon(card)||card.dataset.pigeonExact==='1')return card;
    const clone=card.cloneNode(true);
    clone.dataset.pigeonExact='1';
    let icon=clone.querySelector('.pigeon-audio-indicator');
    if(!icon){icon=document.createElement('span');icon.className='pigeon-audio-indicator';icon.textContent='🔊';icon.setAttribute('aria-hidden','true');clone.appendChild(icon)}
    card.replaceWith(clone);
    clone.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      clone.classList.remove('brainrot-pop');void clone.offsetWidth;clone.classList.add('brainrot-pop');
      playPigeon(clone);
    });
    return clone;
  }
  function scan(){
    const cal=document.getElementById('brainrot-calendar');if(!cal)return;
    [...cal.querySelectorAll('.brainrot-day:not(.empty)')].forEach(upgrade);
  }
  function bindCalendar(cal){
    if(cal.dataset.pigeon13ExactBound)return;
    cal.dataset.pigeon13ExactBound='1';
    cal.addEventListener('pointerover',e=>{const card=e.target.closest('.brainrot-day');if(card?.dataset.pigeonExact==='1')e.stopImmediatePropagation()},true);
    cal.addEventListener('click',e=>{const card=e.target.closest('.brainrot-day');if(card&&card.dataset.pigeonExact!=='1')stopPigeon(true)},true);
    new MutationObserver(()=>setTimeout(scan,0)).observe(cal,{childList:true,subtree:true});
  }
  function init(){
    const cal=document.getElementById('brainrot-calendar');if(!cal)return false;
    bindCalendar(cal);scan();prepareAudio().catch(()=>{});
    const soundBtn=document.getElementById('brainrot-sound');
    if(soundBtn&&!soundBtn.dataset.pigeon13Bound){soundBtn.dataset.pigeon13Bound='1';soundBtn.addEventListener('click',()=>setTimeout(()=>{if(muted())stopPigeon(true);else if(audio)audio.volume=volumeFromSite()},0))}
    ['brainrot-prev','brainrot-next','brainrot-now'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>stopPigeon(true),true));
    const section=document.getElementById('brainrot');
    if(section)new MutationObserver(()=>{if(!section.classList.contains('active'))stopPigeon(true)}).observe(section,{attributes:true,attributeFilter:['class']});
    return true;
  }
  document.addEventListener('input',e=>{if(audio&&e.target.matches?.('input[type="range"],#site-volume,#master-volume,#brainrot-volume,[data-site-volume],[data-volume]'))audio.volume=volumeFromSite()},true);
  document.addEventListener('change',e=>{if(audio&&e.target.matches?.('input[type="range"],#site-volume,#master-volume,#brainrot-volume,[data-site-volume],[data-volume]'))audio.volume=volumeFromSite()},true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPigeon(true)});
  window.addEventListener('pagehide',()=>stopPigeon(true));
  const wait=setInterval(()=>{if(init())clearInterval(wait)},120);
  setTimeout(()=>clearInterval(wait),12000);
})();