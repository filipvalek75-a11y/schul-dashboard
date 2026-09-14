(()=>{
  if(window.__swanThemeLoaded)return;window.__swanThemeLoaded=true;
  const s=document.createElement('style');
  s.id='swan-theme-style';
  s.textContent=`
  :root{
    --bg:#eee8f4!important;
    --panel:#fbf9fd!important;
    --panel2:#f3edf8!important;
    --text:#251b2d!important;
    --muted:#74697c!important;
    --accent:#8b46b7!important;
    --accent2:#b98bd4!important;
    --line:#d6c7df!important;
    --shadow:0 14px 34px rgba(69,44,82,.12)!important
  }
  html{background:#ece6f1!important;color-scheme:light!important}
  body{
    background:
      radial-gradient(circle at 12% 0%,rgba(179,130,214,.34),transparent 27%),
      radial-gradient(circle at 94% 8%,rgba(216,197,228,.58),transparent 32%),
      linear-gradient(145deg,#f7f3fa 0%,#eee7f4 52%,#f4eff7 100%)!important;
    color:#251b2d!important;
    background-attachment:fixed!important
  }
  body:before{content:'';position:fixed;inset:0;pointer-events:none;z-index:-1;background:linear-gradient(120deg,transparent 0 48%,rgba(139,70,183,.035) 50%,transparent 52% 100%);background-size:260px 260px}
  header{
    background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(244,236,249,.97) 55%,rgba(235,222,243,.97))!important;
    border-bottom:1px solid #cdb9d9!important;
    box-shadow:0 10px 28px rgba(78,50,92,.12)!important;
    position:relative;overflow:hidden
  }
  header:after{content:'';position:absolute;left:7%;right:7%;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#8b46b7,#e8dfe9,#8b46b7,transparent);opacity:.8}
  .swan-brand h1{background:linear-gradient(90deg,#302337,#6e4a7f 48%,#8f49ba 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important}
  .swan-brand .sub{color:#776782!important}
  .today-box,.student-name{
    background:linear-gradient(145deg,#ffffff,#f2eaf6)!important;
    border:1px solid #d7c6e0!important;
    color:#35273c!important;
    box-shadow:0 8px 20px rgba(72,46,86,.10)!important
  }
  .tab{
    background:#f5f0f8!important;
    color:#66576f!important;
    border:1px solid #d8cae0!important;
    box-shadow:none!important
  }
  .tab:hover{background:#eee3f4!important;color:#3c2b45!important;border-color:#b891cb!important;transform:translateY(-1px)}
  .tab.active{
    background:linear-gradient(135deg,#8a46b6,#b36fd1)!important;
    color:#fff!important;
    border-color:#9f5dc1!important;
    box-shadow:0 8px 20px rgba(126,70,153,.22)!important
  }
  .card,.day,.folder,.category,.assignment,.study-card,.search-box,.search-result,.event-row,.event-details,.tool-card,.overview-assignments,.answer,.lane,.task,.research,.file,.drop{
    background:linear-gradient(145deg,#ffffff,#f8f4fa)!important;
    border-color:#ddd0e4!important;
    color:#2c2132!important;
    box-shadow:0 12px 28px rgba(74,49,85,.10),inset 0 1px 0 rgba(255,255,255,.8)!important
  }
  .card{border-radius:22px!important}.card h2,.card h3,.category h3,.folder h3{color:#31243a!important}.muted{color:#786d7f!important}.item{border-color:#e1d7e6!important}.folder h3{color:#7d3da1!important}.overview-link{color:#382b40!important;border-color:#ded3e4!important}
  .folder:hover,.tool-card:hover,.search-result:hover,.event-row.clickable:hover,.overview-link:hover{background:#f3eaf8!important;border-color:#b98bcd!important;transform:translateY(-2px);box-shadow:0 12px 26px rgba(100,63,118,.14)!important}
  button,.btn,.relax-btn{background:linear-gradient(135deg,#8750aa,#aa73c5)!important;color:#fff!important;border:1px solid #9b68b7!important;box-shadow:0 7px 17px rgba(109,67,132,.18)!important}
  .secondary,button.secondary,.btn.secondary{background:#f2ecf5!important;color:#55465d!important;border:1px solid #cdbfd5!important}
  input,textarea,select,.search-row input{background:#fff!important;color:#2d2333!important;border:1px solid #cfc2d6!important;box-shadow:inset 0 1px 5px rgba(59,40,67,.05)!important}
  input:focus,textarea:focus,select:focus{outline:2px solid rgba(139,70,183,.18)!important;border-color:#a56cc0!important}
  .lesson{border-color:#e1d7e5!important}.pause{background:#fff3d9!important;color:#7a5c1d!important}.free{background:#e7f4ef!important;color:#3d7566!important}.day.today-day{outline-color:#a66dc0!important;box-shadow:0 0 0 5px rgba(166,109,192,.10),0 12px 26px rgba(76,51,88,.10)!important}
  .cell{background:#fcfafc!important;border-color:#ded4e3!important;color:#35293d!important}.cell.weekend{background:#f3edf6!important}.cell.holiday{background:#f9e8eb!important;border-color:#e7bdc7!important}.cell.schoolfree{background:#f9f0dd!important;border-color:#e6d3a8!important}.cell.today{outline-color:#9b5fba!important}.today-label{color:#7f419f!important}
  .category{border-left-color:#9a5eb8!important}.stoff-box{background:#f6eff9!important;border-color:#d9cce0!important;border-left-color:#9d5cbc!important;color:#35273c!important}.answer{border-left-color:#9f5dbd!important}.progress{background:#e6dbe9!important}.progress>span{background:linear-gradient(90deg,#8f4faf,#b975cf,#d9bddf)!important}
  .commerce-news-panel{background:linear-gradient(145deg,#fbf8fc,#f1e8f5)!important;border-color:#d8c5e0!important;box-shadow:0 14px 30px rgba(83,52,96,.11)!important;color:#2c2132!important}.commerce-news-mark{background:linear-gradient(135deg,#8950a8,#b77acb)!important}.commerce-news-card{background:#ffffff!important;border-color:#ded0e4!important;color:#2b2031!important}.commerce-news-card:hover{border-color:#b985cc!important;box-shadow:0 10px 24px rgba(88,54,104,.11)!important}.commerce-news-tag{background:#eee1f4!important;color:#754293!important}.commerce-news-dot{background:#9b5ebb!important}.commerce-news-badge{color:#7c4b96!important}.commerce-news-title p,.commerce-news-actions,.commerce-news-source,.commerce-news-date{color:#7e7285!important}
  .brainrot-cal-card{background:linear-gradient(145deg,#fff,#f3edf7)!important;border-color:#d9cbe0!important}.brainrot-hero{background:linear-gradient(135deg,#f9f5fb,#eadcf1)!important;border:1px solid #d2bddc!important;box-shadow:0 12px 28px rgba(79,48,92,.11)!important}.brainrot-pill{background:#eee6f1!important;color:#65566e!important}.brainrot-sound-btn{background:linear-gradient(135deg,#8a4bab,#ad70c8)!important}
  .relax-inner{background:linear-gradient(135deg,#f7f1fa,#e9dcef)!important;border-color:#d2bedc!important;box-shadow:0 12px 26px rgba(76,48,87,.10)!important;color:#372b3e!important}
  .priority{background:#efe1f4!important;color:#7a3c97!important;border:1px solid #c9a9d6!important}.road{border-left-color:#9c5cba!important}.company-theme-note{color:#796c81!important}
  ::selection{background:#b57bcd;color:#fff}::-webkit-scrollbar-track{background:#eee7f2}::-webkit-scrollbar-thumb{background:linear-gradient(#bea8c7,#9d6eae);border-radius:999px;border:3px solid #eee7f2}
  `;
  document.head.appendChild(s);
})();