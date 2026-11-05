/* Festival theme: Diwali, "Night of Diyas". Stars and a diya row in the hero, sparks rising over the page. */
FWFestival.define(function(t){
  var hero=t.hero,i,s;
  if(hero){
    var st=t.el('div','fw-stars');st.setAttribute('aria-hidden','true');
    for(i=0;i<46;i++){s=t.el('i');s.style.cssText='--x:'+t.rnd(1,99)+'%;--y:'+t.rnd(2,90)+'%;--s:'+t.rnd(1.5,3.2)+'px;--d:'+t.rnd(2.2,5)+'s;--dl:-'+t.rnd(0,5)+'s';st.appendChild(s)}
    hero.insertBefore(st,hero.firstChild);

    var row=t.el('div','fw-diyas');row.setAttribute('aria-hidden','true');
    for(i=0;i<14;i++){
      s=t.el('span','fw-dy','<i class="g"></i><svg viewBox="0 0 40 30"><defs><linearGradient id="fwb'+i+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c14a"/><stop offset="1" stop-color="#b8650f"/></linearGradient></defs><path d="M2 14h36c0 9-8 15-18 15S2 23 2 14z" fill="url(#fwb'+i+')"/><path d="M2 14h36" stroke="#ffe08a" stroke-width="1.5"/><g class="fl"><path d="M20 1c4 5 5.6 8.2 5.6 11.2a5.6 5.6 0 0 1-11.2 0C14.4 9.2 16 6 20 1z" fill="#ffb21c"/><path d="M20 6c2 3 2.8 5 2.8 6.8a2.8 2.8 0 0 1-5.6 0C17.2 11 18 9 20 6z" fill="#fff4c2"/></g></svg>');
      s.style.setProperty('--dl','-'+t.rnd(0,2)+'s');row.appendChild(s)}
    hero.appendChild(row);
  }
  if(t.reduce)return;
  for(i=0;i<(innerWidth<700?8:14);i++){s=t.el('i','fw-em');
    s.style.cssText='--x:'+t.rnd(2,98)+'%;--s:'+t.rnd(5,12)+'px;--d:'+t.rnd(9,17)+'s;--dl:-'+t.rnd(0,16)+'s;--dx:'+t.rnd(-40,40)+'px';t.fx.appendChild(s)}
});
