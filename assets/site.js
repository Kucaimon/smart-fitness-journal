(function(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(){
    document.body.classList.add('is-ready');
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();

  // Scroll reveal: magazine sections enter in measured, editorial steps.
  const revealItems = document.querySelectorAll('[data-reveal]');
  if(!reduceMotion && 'IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    revealItems.forEach(el=>observer.observe(el));
  } else {
    revealItems.forEach(el=>el.classList.add('is-visible'));
  }

  // Full-screen editorial menu.
  const trigger = document.querySelector('.journal-menu-trigger');
  const menu = document.querySelector('.journal-menu');
  const close = document.querySelector('.journal-menu-close');
  const backdrop = document.querySelector('.journal-menu-backdrop');
  function setMenu(open){
    if(!trigger || !menu) return;
    trigger.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  }
  if(trigger) trigger.addEventListener('click', ()=>setMenu(!menu.classList.contains('is-open')));
  if(close) close.addEventListener('click', ()=>setMenu(false));
  if(backdrop) backdrop.addEventListener('click', ()=>setMenu(false));
  document.querySelectorAll('.journal-menu-links a').forEach(a=>{
    a.addEventListener('click', ()=>setMenu(false));
  });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape') setMenu(false);
  });

  // Reading progress for article pages.
  const progress = document.querySelector('.journal-progress span');
  function updateProgress(){
    if(!progress) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
  }
  let progressTicking=false;
  function requestProgressUpdate(){
    if(progressTicking) return;
    progressTicking=true;
    requestAnimationFrame(()=>{ progressTicking=false; updateProgress(); });
  }
  window.addEventListener('scroll', requestProgressUpdate, {passive:true});
  window.addEventListener('resize', requestProgressUpdate);
  updateProgress();

  // Subtle cover parallax, only when motion is allowed.
  const parallax = document.querySelector('[data-parallax="cover"]');
  const touchDevice = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if(parallax && !reduceMotion && !touchDevice){
    let ticking=false;
    function paint(){
      const r=parallax.getBoundingClientRect();
      const center=window.innerHeight/2;
      const shift=Math.max(-18,Math.min(18,(r.top + r.height/2-center)*-0.04));
      parallax.style.transform='translate3d(0,'+shift.toFixed(2)+'px,0) scale(1.02)';
      ticking=false;
    }
    window.addEventListener('scroll', ()=>{
      if(!ticking){ticking=true;requestAnimationFrame(paint);}
    }, {passive:true});
    paint();
  }

  // Editorial page transition for same-origin article/direction links.
  if(!reduceMotion && !touchDevice && location.protocol !== 'file:'){
    document.querySelectorAll('a[href]').forEach(link=>{
      const href=link.getAttribute('href') || '';
      if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
         href.startsWith('https://') || href.startsWith('http://') || link.target==='_blank') return;
      link.addEventListener('click', e=>{
        if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target=new URL(href, location.href);
        if(target.origin!==location.origin) return;
        if(target.pathname===location.pathname && target.hash) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(()=>{ location.href=target.href; }, 220);
      });
    });
  }

  // Telegram invitation popup: once per browser session, after the page settles.
  const tgPopup = document.getElementById('tgPopup');
  const tgClose = tgPopup && tgPopup.querySelector('.tg-close');
  const tgKey = 'smartFitnessJournalTelegramSeen';
  function showTelegramPopup(){
    if(!tgPopup) return;
    let seen = false;
    try { seen = sessionStorage.getItem(tgKey) === '1'; } catch(_) {}
    if(seen) return;
    tgPopup.classList.add('is-visible');
    tgPopup.setAttribute('aria-hidden','false');
    try { sessionStorage.setItem(tgKey,'1'); } catch(_) {}
  }
  function hideTelegramPopup(){
    if(!tgPopup) return;
    tgPopup.classList.remove('is-visible');
    tgPopup.setAttribute('aria-hidden','true');
  }
  if(tgPopup){
    window.setTimeout(showTelegramPopup, 9000);
    if(tgClose) tgClose.addEventListener('click', hideTelegramPopup);
    tgPopup.addEventListener('click', e=>{ if(e.target===tgPopup) hideTelegramPopup(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') hideTelegramPopup(); });
  }

  // Keep the menu trigger available to screen readers.
  const searchInput=document.getElementById('search');
  if(searchInput) searchInput.addEventListener('keydown', e=>{
    if(e.key==='Escape'){searchInput.value='';searchInput.dispatchEvent(new Event('input'));}
  });
})();