(function(root){
  'use strict';
  const key='dts-opening-warning';
  const sign='<svg class="electrical-sign" viewBox="0 0 160 145" aria-label="Elektrik tehlikesi" role="img"><path d="M80 7L153 136H7Z" fill="#ffe331" stroke="#111" stroke-width="7" stroke-linejoin="round"/><path d="M91 35L58 85h23l-12 36 40-56H86l16-30Z" fill="#111"/></svg>';
  const headline='ELEKTRİK GÖZLE GÖRÜLMEZ. ELEKTRİK ÇARPMASI ÖLÜMCÜL OLABİLİR!';
  const instructions='GERÇEK DEVREYE DOKUNMADAN ÖNCE ENERJİYİ KES! Enerjili kabloya, terminale veya pano içine dokunma. Enerjinin kesildiğini ve gerilim olmadığını yetkin bir öğretmen doğrulamadan çalışmaya başlama. Yeniden enerji verilmesine karşı önlem alınmalıdır.';
  function showOnStart(storage){try{return storage.getItem(key)!=='off'}catch{return true}}
  function setShow(storage,show){storage.setItem(key,show?'on':'off')}
  function create({document,storage}){
    const modal=document.querySelector('#safetyModal'),title=document.querySelector('#safetyTitle'),body=document.querySelector('#safetyBody'),ack=document.querySelector('#safetyAcknowledge'),row=document.querySelector('#safetyDismissRow'),dismiss=document.querySelector('#safetyDismiss');let previous=null,opening=false;
    document.querySelectorAll('[data-electrical-sign]').forEach(n=>n.innerHTML=sign);
    function show(kind='opening'){
      previous=document.activeElement;opening=kind==='opening';row.hidden=!opening;dismiss.checked=false;
      title.textContent=opening?'ELEKTRİK DEVRELERİYLE ÇALIŞIRKEN ÇOK DİKKATLİ OL. ELEKTRİK ÇARPMASI ÖLÜMCÜL OLABİLİR!':'DUR! ENERJİLİ KABLOYA VE TERMİNALE DOKUNMA!';
      body.innerHTML=opening?'<p class="personal-dedication">BU PROGRAM, YAKUB UYSAL’IN ELEKTRİK BİLİMİNİN TEMELLERİNİ ÖĞRENMESİ İÇİN BABASI TARAFINDAN ÖZEL OLARAK HAZIRLANMIŞTIR.</p><p>'+instructions+'</p><p><b>Gerçek elektrik devrelerinde tek başına çalışma. Bu program bir eğitim simülasyonudur.</b></p>':'<p><b>Kablo / terminal teması engellendi. Simülasyon çalışmaya devam ediyor.</b> Bağlantılara dokunmak veya devreyi düzenlemek için önce Simülasyonu Durdur düğmesine bas. Kabloya ya da terminale her dokunuşta bu uyarı yeniden gösterilir.</p><p>'+instructions+'</p><p class="real-power-note">Bu program gerçek bir devrenin enerjisini kesmez. Simülasyonu durdurmak, gerçek panonun güvenli olduğu anlamına gelmez.</p>';
      ack.textContent=opening?'UYARIYI OKUDUM · STÜDYOYA GİR':'UYARIYI OKUDUM · SİMÜLASYONA DÖN';modal.hidden=false;document.body.classList.add('safety-open');ack.focus({preventScroll:true});
    }
    ack.addEventListener('click',()=>{if(opening&&dismiss.checked){try{setShow(storage,false)}catch{}}modal.hidden=true;document.body.classList.remove('safety-open');document.querySelector('#showOpeningWarning').checked=showOnStart(storage);previous?.focus?.({preventScroll:true})});
    document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();return}if(e.key==='Tab'){const focusable=opening?[dismiss,ack]:[ack],at=focusable.indexOf(document.activeElement);e.preventDefault();focusable[(at+(e.shiftKey?-1:1)+focusable.length)%focusable.length].focus();e.stopImmediatePropagation()}},true);
    return {show,get visible(){return !modal.hidden}};
  }
  const api={sign,headline,instructions,showOnStart,setShow,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSSafety=api;
})(typeof window==='undefined'?globalThis:window);
