(()=>{
  const root=document.getElementById('learn');
  if(!root)return;

  const SUBJECTS=['AWL','BE','BWPP','DFP','ECM','ITS','PB','DUK'];
  const overview=root.querySelector(':scope > .card');
  const subjectView=document.getElementById('studySubjectView');
  const studyFolders=document.getElementById('studyFolders');

  const style=document.createElement('style');
  style.id='learning-fix-style';
  style.textContent=`
    #learn .folder,#learn .tool-card,#learn .study-card{cursor:pointer;transition:.16s ease}
    #learn .folder:hover,#learn .tool-card:hover,#learn .study-card:hover{transform:translateY(-2px)}
    #learn #studySubjectView{display:none}
    #learn #studySubjectView.active{display:block!important}
    #learn .answer{display:none}
    #learn .answer.open{display:block}
    #learn .qa{padding:12px 0;border-bottom:1px solid rgba(120,90,160,.15)}
    #learn .qa:last-child{border-bottom:0}
  `;
  document.head.appendChild(style);

  function getData(code){
    try{return (typeof studyData!=='undefined'&&studyData[code])?studyData[code]:null}catch{return null}
  }

  function renderSubject(code){
    if(!SUBJECTS.includes(code))return false;
    const d=getData(code);
    const title=document.getElementById('studyTitle');
    const progress=document.getElementById('studyProgress');
    const progressText=document.getElementById('studyProgressText');
    const next=document.getElementById('nextStudyEvent');
    const packages=document.getElementById('studyPackages');
    const questions=document.getElementById('studyQuestions');

    if(title)title.textContent='🎓 '+code+' lernen';
    if(progress)progress.style.width=(d?d.progress:0)+'%';
    if(progressText)progressText.textContent=d?`${d.progress}% vorbereitet`:'Noch kein Lernfortschritt gespeichert.';
    if(next)next.textContent=d?d.next:'Noch kein Termin.';
    if(packages)packages.innerHTML=d&&d.packages?.length
      ?d.packages.map(x=>`<div class="study-card">📘 ${x}</div>`).join('')
      :'<div class="muted">Noch kein Lernmaterial gespeichert.</div>';
    if(questions)questions.innerHTML=d&&d.questions?.length
      ?d.questions.map((q,i)=>`<div class="qa"><b>${i+1}. ${q[0]}</b><br><button class="secondary" type="button" data-answer="learnAns${i}">Antwort anzeigen</button><div class="answer" id="learnAns${i}">${q[1]}</div></div>`).join('')
      :'<div class="muted">Noch keine Übungsfragen vorhanden.</div>';

    if(overview)overview.style.display='none';
    if(subjectView){subjectView.classList.add('active');subjectView.style.display='block';}
    root.style.display='block';
    subjectView?.scrollIntoView({behavior:'smooth',block:'start'});
    return true;
  }

  function closeView(){
    if(subjectView){subjectView.classList.remove('active');subjectView.style.display='none';}
    if(overview)overview.style.display='block';
    root.style.display='block';
  }

  window.openStudySubject=renderSubject;
  window.closeStudySubject=closeView;
  window.toggleStudyAnswer=id=>document.getElementById(id)?.classList.toggle('open');
  window.toggleAnswer=id=>document.getElementById(id)?.classList.toggle('open');

  root.addEventListener('click',e=>{
    const answerBtn=e.target.closest('[data-answer]');
    if(answerBtn){
      e.preventDefault();e.stopPropagation();
      document.getElementById(answerBtn.dataset.answer)?.classList.toggle('open');
      return;
    }
    const folder=e.target.closest('#studyFolders .folder');
    if(folder){
      const code=SUBJECTS.find(s=>(folder.textContent||'').toUpperCase().includes(s));
      if(code){e.preventDefault();renderSubject(code);}
    }
  });

  studyFolders?.querySelectorAll('.folder').forEach(el=>{
    el.tabIndex=0;
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
  });

  closeView();
})();