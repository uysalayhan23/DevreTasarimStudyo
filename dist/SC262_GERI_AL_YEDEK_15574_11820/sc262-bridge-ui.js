(()=>{
  'use strict';
  const LESSON='electronic-switching-outline-027';
  let panel=null;
  function sync(project){
    const active=project?.tutorialLesson?.id===LESSON || (project?.tutorialLesson && /transistörlü schmitt trigger/i.test(String(project.name||''))) || String(project?.projectId||'').includes(LESSON);
    if(!active){if(panel)panel.hidden=true;return;}
    if(!panel){
      panel=document.createElement('section');
      panel.id='sc262SpicePanel';
      panel.setAttribute('aria-label','SC262 isteğe bağlı ngspice ölçümü');
      Object.assign(panel.style,{position:'fixed',right:'12px',bottom:'12px',zIndex:'10001',width:'310px',maxWidth:'calc(100vw - 24px)',padding:'12px',background:'#17233a',color:'#f9fafb',border:'1px solid #8da3bd',borderRadius:'8px',boxShadow:'0 4px 20px #0008',font:'13px system-ui'});
      const title=document.createElement('strong');title.textContent='SC262 · Yerel SPICE ölçümü (isteğe bağlı)';panel.append(title);
      const note=document.createElement('p');note.textContent='Köprü ayrı başlatılmalıdır. Yaklaşık BD139 modeli; öğretici devrenin yerel simülatör kabulü değildir.';panel.append(note);
      const input=document.createElement('input');input.type='password';input.placeholder='Bu oturumun yerel erişim anahtarı';input.setAttribute('aria-label','Yerel SC262 köprü anahtarı');Object.assign(input.style,{width:'100%',boxSizing:'border-box',marginBottom:'8px'});panel.append(input);
      const btn=document.createElement('button');btn.type='button';btn.textContent='ngspice ile ölç';panel.append(btn);
      const output=document.createElement('pre');output.setAttribute('aria-live','polite');output.style.whiteSpace='pre-wrap';output.textContent='Köprü kapalıysa diğer dersler normal çalışır.';panel.append(output);
      btn.onclick=async()=>{
        if(!input.value.trim()){output.textContent='Yerel köprü anahtarını girin.';return;}
        btn.disabled=true;output.textContent='Yerel SPICE hesaplaması bekleniyor…';
        const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
        try{
          const res=await fetch('http://127.0.0.1:18762/sc262',{method:'GET',headers:{'x-sc262-token':input.value.trim()},cache:'no-store',signal:controller.signal});
          if(!res.ok)throw Error('Köprü yanıtı: HTTP '+res.status);
          const v=await res.json();
          if(!['risingV','fallingV','hysteresisV'].every(k=>Number.isFinite(v[k]))||!(v.risingV>v.fallingV)||v.model!=='BD139_APPROX'||v.acceptance!=='exploratory-only')throw Error('Ölçüm doğrulaması başarısız');
          output.textContent=`Yükselen: ${v.risingV.toFixed(5)} V\nDüşen: ${v.fallingV.toFixed(5)} V\nFark: ${v.hysteresisV.toFixed(5)} V\nModel: yaklaşık BD139 · keşif ölçümü, PASS değil`;
        }catch(e){output.textContent='Ölçüm alınamadı: '+e.message+'\nKöprü açık mı? Tarayıcı yerel bağlantıyı engelliyor olabilir.';}
        finally{clearTimeout(timer);btn.disabled=false;}
      };
      document.body.append(panel);
    }
    panel.hidden=false;
  }
  window.DTSSC262BridgeUI={sync};
})();
