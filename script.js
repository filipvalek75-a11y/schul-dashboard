/* =========================================================
   FILIPS SCHULPLATTFORM – HAUPT-JAVASCRIPT
   Hier kannst du Termine, Fächer, Lernstoff und Navigation ändern.
   Zusätzliche Spezialfunktionen werden am Ende zentral geladen.
   ========================================================= */

const subjects=['AWL','BE','BWPP','DFP','ECM','ITS','PB','DUK'];

const holidays={
  '2026-10-26':'Nationalfeiertag','2026-11-01':'Allerheiligen','2026-12-08':'Mariä Empfängnis',
  '2026-12-25':'Christtag','2026-12-26':'Stefanitag','2027-01-01':'Neujahr','2027-01-06':'Heilige Drei Könige',
  '2027-03-29':'Ostermontag','2027-05-01':'Staatsfeiertag','2027-05-06':'Christi Himmelfahrt',
  '2027-05-17':'Pfingstmontag','2027-05-27':'Fronleichnam','2027-08-15':'Mariä Himmelfahrt'
};

const schoolRanges=[
  ['2026-10-27','2026-10-31','Herbstferien'],
  ['2026-11-02','2026-11-02','Allerseelen – schulfrei'],
  ['2026-12-24','2027-01-06','Weihnachtsferien'],
  ['2027-02-01','2027-02-06','Semesterferien Wien'],
  ['2027-03-20','2027-03-29','Osterferien'],
  ['2027-05-15','2027-05-17','Pfingstferien'],
  ['2027-07-03','2027-09-05','Sommerferien Wien']
];

const events={
  '2026-09-07':{title:'ECM Abgabe',type:'abgabe',subject:'ECM',stoff:['Wiederholung 1. Semester']},
  '2026-10-28':{title:'BWPP Test 1',type:'test',subject:'BWPP',stoff:[]},
  '2026-11-11':{title:'ECM Schularbeit',type:'schularbeit',subject:'ECM',stoff:[]},
  '2026-11-25':{title:'AWL Schularbeit',type:'schularbeit',subject:'AWL',stoff:[]},
  '2026-12-16':{title:'BWPP Test 2',type:'test',subject:'BWPP',stoff:[]}
};

const studyData={
  ECM:{
    progress:10,
    next:'11.11.2026 · Schularbeit',
    packages:['Wiederholung 1. Semester','15 Wiederholungsfragen','Lösungen zu den Wiederholungsfragen'],
    questions:[
      ['Was ist Webtracking?','Webtracking bedeutet, dass man beobachtet, wie sich Besucher auf einer Website verhalten, z. B. welche Seiten sie besuchen oder wo sie klicken.'],
      ['Wofür steht AIDA?','Attention, Interest, Desire, Action.'],
      ['Was ist eine Buyer Persona?','Eine erfundene Beispielperson, die einen typischen Kunden darstellt.'],
      ['Was bedeutet Barrierefreiheit im Web?','Eine Website soll auch von Menschen mit Einschränkungen möglichst problemlos genutzt werden können.'],
      ['Was ist strategisches Marketing?','Strategisches Marketing beschäftigt sich mit langfristigen Marketingzielen und Entscheidungen, z. B. Zielgruppe und Positionierung.']
    ]
  }
};

const monthNames=['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function viennaNow(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit',weekday:'long',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  const o={};parts.forEach(p=>o[p.type]=p.value);return o;
}
function todayISO(){const p=viennaNow();return `${p.year}-${p.month}-${p.day}`}
function updateToday(){
  const p=viennaNow();
  const deDay=new Intl.DateTimeFormat('de-AT',{timeZone:'Europe/Vienna',weekday:'long'}).format(new Date());
  const box=document.getElementById('todayBox');
  if(box)box.textContent=`Heute: ${deDay}, ${p.day}.${p.month}.${p.year} · ${p.hour}:${p.minute} Uhr`;
  document.getElementById('mondayCard')?.classList.toggle('today-day',deDay==='Montag');
  document.getElementById('wednesdayCard')?.classList.toggle('today-day',deDay==='Mittwoch');
}

const p0=viennaNow();
let calDate=new Date(Number(p0.year),Number(p0.month)-1,1),searchTarget=null,currentEventDate=null;
function iso(y,m,d){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function schoolLabel(x){for(const r of schoolRanges)if(x>=r[0]&&x<=r[1])return r[2];return''}
function renderCal(){
  const y=calDate.getFullYear(),m=calDate.getMonth(),today=todayISO();
  const monthTitle=document.getElementById('monthTitle'),c=document.getElementById('calendar');
  if(!monthTitle||!c)return;
  monthTitle.textContent=monthNames[m]+' '+y;
  c.innerHTML=['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<div class="dow">${x}</div>`).join('');
  let first=new Date(y,m,1).getDay();first=first===0?6:first-1;
  for(let i=0;i<first;i++)c.innerHTML+='<div class="cell empty"></div>';
  const days=new Date(y,m+1,0).getDate();let rows=[];
  for(let d=1;d<=days;d++){
    const key=iso(y,m,d),date=new Date(y,m,d),weekend=[0,6].includes(date.getDay()),h=holidays[key],s=schoolLabel(key),e=events[key];
    let cls='cell'+(weekend?' weekend':'')+(h?' holiday':'')+(s?' schoolfree':'')+(key===today?' today':'')+(key===searchTarget?' search-hit':'');
    let inner=`<b>${d}</b>${key===today?'<span class="today-label">HEUTE</span>':''}`;
    if(h){inner+=`<span class="dot">${h}</span>`;rows.push({day:d,label:h,key:null})}
    if(s){inner+=`<span class="dot">${s}</span>`;rows.push({day:d,label:s,key:null})}
    if(e){inner+=`<span class="event-label ${e.type}" onclick="showEventDetails('${key}');event.stopPropagation()">${e.title}</span>`;rows.push({day:d,label:e.title,key})}
    c.innerHTML+=`<div class="${cls}">${inner}</div>`;
  }
  const eventList=document.getElementById('eventList');
  if(eventList)eventList.innerHTML=rows.length?rows.map(x=>`<div class="event-row ${x.key?'clickable':''}" ${x.key?`onclick="showEventDetails('${x.key}')"`:''}><b>${x.day}. ${monthNames[m]}</b> · ${x.label}${x.key?'<br><span class="muted">Anklicken für Prüfungsstoff</span>':''}</div>`).join(''):'<div class="muted">Keine Termine in diesem Monat.</div>';
}
function showEventDetails(date){
  const e=events[date];if(!e)return;currentEventDate=date;
  document.getElementById('detailTitle').textContent=e.title;
  document.getElementById('detailMeta').textContent=`${formatDate(date)} · ${e.subject||''}`;
  document.getElementById('detailStoff').innerHTML=e.stoff&&e.stoff.length?`<ul>${e.stoff.map(s=>`<li>${s}</li>`).join('')}</ul>`:'<p class="muted">Der Prüfungsstoff wurde noch nicht eingetragen. Sobald du mir den Stoff oder die Unterlagen schickst, trage ich ihn hier ein.</p>';
  document.getElementById('detailLearnBtn').style.display=e.subject?'inline-block':'none';
  document.getElementById('eventDetails').classList.add('open');
  document.getElementById('eventDetails').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function closeEventDetails(){document.getElementById('eventDetails')?.classList.remove('open');currentEventDate=null}
function goLearnFromEvent(){if(!currentEventDate)return;const e=events[currentEventDate];const tabs=document.querySelectorAll('.tab');showPage('learn',tabs[3]);openStudySubject(e.subject)}
function changeMonth(n){searchTarget=null;closeEventDetails();calDate=new Date(calDate.getFullYear(),calDate.getMonth()+n,1);renderCal()}
function goToday(){searchTarget=todayISO();const p=viennaNow();calDate=new Date(Number(p.year),Number(p.month)-1,1);renderCal()}
function searchEvents(){
  const q=document.getElementById('eventSearch').value.trim().toLowerCase(),box=document.getElementById('searchResults');
  if(!q){box.innerHTML='<div class="muted">Bitte einen Suchbegriff eingeben.</div>';return}
  const hits=Object.entries(events).filter(([d,e])=>(e.title+' '+e.type+' '+e.subject+' '+(e.stoff||[]).join(' ')+' '+d).toLowerCase().includes(q));
  box.innerHTML=hits.length?hits.map(([d,e])=>`<div class="search-result" onclick="jumpToEvent('${d}')"><b>${e.title}</b><br><span class="muted">${formatDate(d)}</span></div>`).join(''):'<div class="muted">Keine passenden Termine gefunden.</div>';
}
function jumpToEvent(d){const [y,m]=d.split('-').map(Number);calDate=new Date(y,m-1,1);searchTarget=d;renderCal();showEventDetails(d)}
function formatDate(d){const [y,m,day]=d.split('-');return `${day}.${m}.${y}`}

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  if(btn)btn.classList.add('active');
  if(id==='assignments')closeSubject();
  if(id==='learn')closeStudySubject();
}
function renderFolders(){
  const a=document.getElementById('assignmentFolders'),s=document.getElementById('studyFolders');
  if(a)a.innerHTML=subjects.map(x=>`<div class="folder" onclick="openSubject('${x}')">📁<h3>${x}</h3><div class="muted">${x==='ECM'?'1 Eintrag':'0 Einträge'}</div></div>`).join('');
  if(s)s.innerHTML=subjects.map(x=>`<div class="folder" onclick="openStudySubject('${x}')">🎓<h3>${x}</h3><div class="muted">${studyData[x]?'Lernmaterial vorhanden':'Noch kein Lernmaterial'}</div></div>`).join('');
}
function openSubject(s){
  document.getElementById('folders').style.display='none';
  document.getElementById('subjectView').classList.add('active');
  document.getElementById('subjectTitle').textContent='📁 '+s;
  document.getElementById('doneAssignments').innerHTML=s==='ECM'?'<div class="assignment" id="ecmAssignment"><b>Wiederholung 1. Semester 2026</b><br><span class="muted">Abgabe 07.09.2026 · erledigt</span></div>':'<span class="muted">Noch keine erledigten Abgaben.</span>';
  document.getElementById('solutions').innerHTML=s==='ECM'?'<span class="muted">Antworten zu den 15 ECM-Fragen vorhanden.</span>':'<span class="muted">Noch keine Lösungen gespeichert.</span>';
}
function closeSubject(){const f=document.getElementById('folders');if(f)f.style.display='block';document.getElementById('subjectView')?.classList.remove('active')}
function goAssignment(s){const tabs=document.querySelectorAll('.tab');showPage('assignments',tabs[2]);openSubject(s)}
function openStudySubject(s){
  const folders=document.getElementById('studyFolders');if(!folders)return;
  folders.parentElement.parentElement.style.display='none';
  document.getElementById('studySubjectView').classList.add('active');
  document.getElementById('studyTitle').textContent='🎓 '+s+' lernen';
  const d=studyData[s];
  document.getElementById('studyProgress').style.width=(d?d.progress:0)+'%';
  document.getElementById('studyProgressText').textContent=d?`${d.progress}% vorbereitet`:'Noch kein Lernfortschritt gespeichert.';
  document.getElementById('nextStudyEvent').textContent=d?d.next:'Noch kein Termin.';
  document.getElementById('studyPackages').innerHTML=d?d.packages.map(x=>`<div class="study-card">📘 ${x}</div>`).join(''):'<div class="muted">Sobald du mir Unterlagen zu diesem Fach schickst, kann ich hier Lernpakete vorbereiten.</div>';
  document.getElementById('studyQuestions').innerHTML=d?d.questions.map((q,i)=>`<div class="qa"><b>${i+1}. ${q[0]}</b><br><button class="secondary" onclick="toggleAnswer('ans${i}')">Antwort anzeigen</button><div class="answer" id="ans${i}">${q[1]}</div></div>`).join(''):'<div class="muted">Noch keine Übungsfragen vorhanden.</div>';
}
function closeStudySubject(){const folders=document.getElementById('studyFolders');const main=folders?.parentElement?.parentElement;if(main)main.style.display='block';document.getElementById('studySubjectView')?.classList.remove('active')}
function toggleAnswer(id){document.getElementById(id)?.classList.toggle('open')}

renderFolders();updateToday();renderCal();setInterval(()=>{updateToday();renderCal()},60000);

/* =========================================================
   ZENTRALER MODUL-LOADER
   Diese Dateien bleiben vorerst als Spezialmodule bestehen,
   damit keine bestehende Funktion verloren geht.
   ========================================================= */
(function loadFeatureModules(){
  const modules=['news-widget.js'];
  modules.forEach(src=>{
    if(document.querySelector(`script[data-main-loader="${src}"]`))return;
    const s=document.createElement('script');s.src=src;s.defer=true;s.dataset.mainLoader=src;document.body.appendChild(s);
  });
})();
