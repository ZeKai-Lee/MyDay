// MyDay M10 附加测试：大数据性能 / ?today= 跨天参数 / 双语枚举不错乱
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M10 性能/跨天/双语',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 大数据性能抽查
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const base=App.data.today.todos.length;
      const td=App._getToday();
      for(let i=0;i<200;i++) App.data.today.todos.push({id:'p'+i,text:'性能测试待办'+i,tag:['media','dev','consult','life'][i%4],date:td,done:i%3===0});
      for(let i=0;i<100;i++) App.data.media.items.push({id:'mi'+i,title:'内容'+i,stage:['idea','wip','draft','published'][i%4],platform:'B站',date:td,note:''});
      App.save();
      let t0=performance.now(); App.go('today'); let ms=performance.now()-t0;
      ok('今日视图渲染<300ms', ms<300, ms.toFixed(1)+'ms');
      t0=performance.now(); App.go('media'); ms=performance.now()-t0;
      ok('看板渲染<300ms', ms<300, ms.toFixed(1)+'ms');
      t0=performance.now(); App.go('home'); ms=performance.now()-t0;
      ok('首页渲染<300ms', ms<300, ms.toFixed(1)+'ms');
      const inp=document.querySelector('#home-todo-input'); inp.value='性能追加';
      t0=performance.now(); inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); ms=performance.now()-t0;
      ok('添加待办<200ms', ms<200, ms.toFixed(1)+'ms');
      ok('数据完整(基+'+base+'+201/100)', App.data.today.todos.length===base+201&&App.data.media.items.length===100, String(App.data.today.todos.length));
      return R; })()` },
    // B. ?today= 跨天参数端到端
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const d=new Date(Date.now()-86400000);
      const y=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      App.data.today.todos.push({id:'y1',text:'昨天的活',tag:'life',date:y,done:false});
      App.save(); return R; })()` },
    { url: APP + '?today=2026-09-19' },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      ok('参数覆盖:今天=2026-09-19', App._getToday()==='2026-09-19', App._getToday());
      App.go('today');
      const carry=[...$$('button')].find(b=>b.textContent.includes('之前未完成'));
      ok('顺延区出现', !!carry, carry&&carry.textContent);
      carry.click();
      ok('展开后昨日未完成可见', $$('body')[0].textContent.includes('昨天的活'));
      return R; })()` },
    // C. 双语枚举不错乱（回到真实日期）
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const real=(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date());
      ok('恢复真实系统日期', App._getToday()===real, App._getToday());
      $$('#nav .nav-item span').find(e=>e.textContent==='自媒体').closest('button').click();
      ok('中文列头「已发布」', $$('.kcol-title span').filter(e=>e.textContent==='已发布').length===1);
      $$('#nav .nav-item span').find(e=>e.textContent==='数据与设置').closest('button').click();
      [...$$('.chip')].find(b=>b.textContent==='English').click();
      $$('#nav .nav-item span').find(e=>e.textContent==='Content').closest('button').click();
      ok('英文列头 Published', $$('.kcol-title span').filter(e=>e.textContent==='Published').length===1);
      ok('英文下卡片标题保持中文原文', $$('.kcard').some(k=>k.textContent.includes('内容0')));
      $$('#nav .nav-item span').find(e=>e.textContent==='Data & Settings').closest('button').click();
      [...$$('.chip')].find(b=>b.textContent==='中文').click();
      $$('#nav .nav-item span').find(e=>e.textContent==='自媒体').closest('button').click();
      ok('切回中文数据完好', App.data.media.items.length===100&&$$('.kcol-title span').filter(e=>e.textContent==='已发布').length===1);
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` }
  ]
};
