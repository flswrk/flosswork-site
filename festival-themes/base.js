/* Flosswork festival themes: shared runtime. Builds the sticky banner, then runs the active festival theme's decoration.
   window.FW_FESTIVAL = {id, banner:{text,more}} is set by the inline loader in each page head. */
(function(){
  var T=window.FW_FESTIVAL;
  if(!T||window.FWFestival)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fn=null,started=false;
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;return e}
  function rnd(a,b){return a+Math.random()*(b-a)}
  var diya='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 18h26c0 6-5.5 10-13 10S3 24 3 18z" fill="currentColor"/><path class="flame" d="M16 3c3.2 4.2 4.4 6.8 4.4 9.4a4.4 4.4 0 0 1-8.8 0C11.6 9.8 12.8 7.2 16 3z" fill="#ff8a00"/></svg>';

  function start(){
    if(started||!fn||document.readyState==='loading')return;
    started=true;
    var bn=T.banner||{},b=el('div','fw-fest');
    b.setAttribute('role','note');
    b.innerHTML='<span class="ico">'+diya+'</span><span class="txt"></span>'+(bn.more?'<span class="more"></span>':'')+'<span class="ico">'+diya+'</span>';
    b.querySelector('.txt').textContent=bn.text||'';
    if(bn.more)b.querySelector('.more').textContent='· '+bn.more;
    document.body.insertBefore(b,document.body.firstChild);
    var fx=el('div','fw-fx');fx.setAttribute('aria-hidden','true');
    fn({el:el,rnd:rnd,reduce:reduce,banner:b,fx:fx,hero:document.querySelector('.shero,.phero')});
    if(fx.childNodes.length)document.body.appendChild(fx);
  }
  window.FWFestival={define:function(f){fn=f;start()}};
  document.addEventListener('DOMContentLoaded',start);
})();
