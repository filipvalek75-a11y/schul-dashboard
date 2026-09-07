(() => {
  const style = document.createElement('style');
  style.textContent = `
  .relax-footer{max-width:900px!important;margin:16px auto 14px!important;padding:0 24px!important}.relax-inner{padding:10px 14px!important;border-radius:14px!important;gap:10px!important}.relax-copy b{font-size:14px!important}.relax-copy span{font-size:12px!important;margin-top:2px!important}.relax-btn{padding:8px 11px!important;font-size:13px!important;border-radius:10px!important}
  .commerce-news{max-width:1240px;margin:6px auto 18px;padding:0 24px}.commerce-news-panel{background:linear-gradient(145deg,#171b2d,#202844);border:1px solid rgba(148,163,184,.2);border-radius:22px;padding:20px;box-shadow:0 16px 40px rgba(31,42,68,.2);color:#eef2ff}.commerce-news-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:16px}.commerce-news-title{display:flex;align-items:center;gap:10px}.commerce-news-mark{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#6d7cff,#27c4b8);display:grid;place-items:center;font-size:18px;box-shadow:0 8px 20px rgba(91,108,255,.28)}.commerce-news-title h2{margin:0;font-size:20px}.commerce-news-title p{margin:3px 0 0;color:#a9b5ca;font-size:13px}.commerce-news-actions{display:flex;align-items:center;gap:10px;color:#a9b5ca;font-size:12px}.commerce-news-refresh{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:#eef2ff;padding:8px 11px;border-radius:10px;font-weight:700;cursor:pointer}.commerce-news-refresh:hover{background:rgba(255,255,255,.12)}.commerce-news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.commerce-news-card{display:flex;flex-direction:column;min-height:190px;background:linear-gradient(155deg,rgba(255,255,255,.08),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:15px;text-decoration:none;color:#f8fafc;transition:.18s ease;position:relative;overflow:hidden}.commerce-news-card:hover{transform:translateY(-2px);border-color:rgba(125,140,255,.55);background:linear-gradient(155deg,rgba(255,255,255,.11),rgba(255,255,255,.05))}.commerce-news-meta{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:11px}.commerce-news-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;background:rgba(91,108,255,.16);color:#cbd3ff;font-size:11px;font-weight:800}.commerce-news-date{font-size:11px;color:#98a5ba}.commerce-news-card h3{font-size:15px;line-height:1.35;margin:0 0 10px}.commerce-news-source{margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;gap:8px;color:#a9b5ca;font-size:12px}.commerce-news-arrow{font-size:16px;color:#91a0ff}.commerce-news-skeleton{height:190px;border-radius:16px;background:linear-gradient(90deg,rgba(255,255,255,.05),rgba(255,255,255,.1),rgba(255,255,255,.05));background-size:220% 100%;animation:newsShimmer 1.3s linear infinite}@keyframes newsShimmer{to{background-position:-220% 0}}.commerce-news-error{grid-column:1/-1;padding:18px;border-radius:14px;background:rgba(255,255,255,.06);color:#cbd5e1}.commerce-news-badge{display:inline-flex;align-items:center;gap:6px;color:#8fe1d8}.commerce-news-dot{width:7px;height:7px;border-radius:50%;background:#2dd4bf;box-shadow:0 0 10px rgba(45,212,191,.65)}@media(max-width:900px){.commerce-news-grid{grid-template-columns:repeat(2,1fr)}.relax-footer{max-width:760px!important}}@media(max-width:620px){.commerce-news-grid{grid-template-columns:1fr}.commerce-news{padding:0 16px}.commerce-news-panel{padding:16px}.commerce-news-card{min-height:170px}.relax-footer{padding:0 16px!important}.relax-copy span{display:none!important}}@media(prefers-reduced-motion:reduce){.commerce-news-card,.commerce-news-skeleton{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'commerce-news';
  section.innerHTML = `<div class="commerce-news-panel"><div class="commerce-news-head"><div class="commerce-news-title"><div class="commerce-news-mark">📰</div><div><h2>Aktuell aus der E-Commerce-Welt</h2><p>6 neue Entwicklungen aus Handel, Tech, Marketing und Recht</p></div></div><div class="commerce-news-actions"><span class="commerce-news-badge"><span class="commerce-news-dot"></span> automatisch aktuell</span><span id="commerceNewsUpdated">wird geladen …</span><button class="commerce-news-refresh" id="commerceNewsRefresh">↻ Aktualisieren</button></div></div><div class="commerce-news-grid" id="commerceNewsGrid">${'<div class="commerce-news-skeleton"></div>'.repeat(6)}</div></div>`;

  const footer = document.querySelector('.relax-footer');
  if (footer) footer.parentNode.insertBefore(section, footer.nextSibling);
  else document.body.appendChild(section);

  const grid = section.querySelector('#commerceNewsGrid');
  const updated = section.querySelector('#commerceNewsUpdated');
  const refresh = section.querySelector('#commerceNewsRefresh');

  const esc = (s='') => s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmtDate = (iso) => { try { return new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Vienna'}).format(new Date(iso)); } catch { return ''; } };
  const fmtUpdated = (iso) => { try { return 'Stand: '+new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Vienna'}).format(new Date(iso)); } catch { return ''; } };

  async function loadNews(force=false){
    grid.innerHTML = '<div class="commerce-news-skeleton"></div>'.repeat(6);
    refresh.disabled = true;
    try{
      const r = await fetch('/api/news'+(force?'?t='+Date.now():''),{cache:force?'no-store':'default'});
      if(!r.ok) throw new Error('news');
      const data = await r.json();
      if(!data.items || !data.items.length) throw new Error('empty');
      grid.innerHTML = data.items.map(n=>`<a class="commerce-news-card" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer"><div class="commerce-news-meta"><span class="commerce-news-tag">${esc(n.icon||'◆')} ${esc(n.category||'E-Commerce')}</span><span class="commerce-news-date">${fmtDate(n.publishedAt)}</span></div><h3>${esc(n.title)}</h3><div class="commerce-news-source"><span>${esc(n.source||'Quelle')}</span><span class="commerce-news-arrow">↗</span></div></a>`).join('');
      updated.textContent = fmtUpdated(data.updatedAt);
    }catch(e){
      grid.innerHTML = '<div class="commerce-news-error"><b>News sind gerade nicht erreichbar.</b><br><span>Bitte später erneut versuchen oder auf „Aktualisieren“ klicken.</span></div>';
      updated.textContent = 'vorübergehend offline';
    }finally{ refresh.disabled=false; }
  }
  refresh.addEventListener('click',()=>loadNews(true));
  loadNews(false);
})();