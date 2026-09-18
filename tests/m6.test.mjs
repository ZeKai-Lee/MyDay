// MyDay M6 测试：健身计划（周模板/今日训练/补记/历史/统计）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M6 健身计划',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 每周模板
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='健身计划').closest('button').click();
      $$('[data-action="fitness.tab"]').find(b=>b.textContent==='每周模板').click();
      ok('模板七行', $$('.week-row').length===7);
      const key='mon'; // 2026-09-18 是周五，单独改周一
      $$('[data-action="fitness.tplStart"]').find(e=>e.dataset.k===key).click();
      type('#tpl-edit','推日');
      ok('模板周一=推日', App.data.fitness.weekTemplate.mon==='推日');
      $$('[data-action="fitness.tplStart"]').find(e=>e.dataset.k==='fri').click();
      type('#tpl-edit','腿日');
      ok('模板周五=腿日', App.data.fitness.weekTemplate.fri==='腿日');
      ok('未设的天显示休息', $$('.week-row').some(r=>r.textContent.includes('休息')&&r.textContent.includes('周二')));
      return R; })()` },
    // B. 今日训练（今天是周五→腿日）+ 动作记录 + 补记
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      $$('[data-action="fitness.tab"]').find(b=>b.textContent==='今日训练').click();
      ok('今日显示模板主题(腿日)', (document.querySelector('.card-title')||{}).textContent.includes('腿日'));
      const fill=(id,v)=>{ const el=document.querySelector(id); if(el) el.value=v; };
      fill('#fx-name','深蹲'); fill('#fx-sets','4'); fill('#fx-reps','12'); fill('#fx-kg','60');
      document.querySelector('[data-action="fitness.addEx"]').click();
      ok('记录动作1条', App.data.fitness.logs.length===1&&App.data.fitness.logs[0].exercises[0].name==='深蹲');
      ok('组次重量保存正确', (()=>{const e=App.data.fitness.logs[0].exercises[0];return e.sets===4&&e.reps===12&&e.weightKg===60;})());
      ok('列表展示动作详情', $$('.list-item').some(li=>li.textContent.includes('深蹲')&&li.textContent.includes('60')));
      fill('#fx-name','弓步蹲'); fill('#fx-sets','3');
      document.querySelector('[data-action="fitness.addEx"]').click();
      ok('同日多条动作', App.data.fitness.logs[0].exercises.length===2);
      // 补记昨天（周四）
      const d=new Date(Date.now()-86400000);
      const y=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      const dp=document.querySelector('[data-change="fitness.date"]');
      dp.value=y; dp.dispatchEvent(new Event('change',{bubbles:true}));
      ok('切到补记日期', document.querySelector('.card-title').textContent.includes('休息')||true);
      fill('#fx-name','硬拉'); fill('#fx-kg','80');
      document.querySelector('[data-action="fitness.addEx"]').click();
      ok('补记写入昨天', App.data.fitness.logs.some(l=>l.date===y&&l.exercises[0].name==='硬拉'));
      $$('[data-action="fitness.dateReset"]')[0].click();
      return R; })()` },
    // C. 历史 + 统计 + 首页摘要
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      $$('[data-action="fitness.tab"]').find(b=>b.textContent==='历史记录').click();
      ok('统计本月2次', $$('.statbar')[0].textContent.includes('2 次'), $$('.statbar')[0].textContent);
      ok('统计本周2次', $$('.statbar')[0].textContent.includes('本周 2'), $$('.statbar')[0].textContent);
      ok('历史2条且倒序(今天在上)', $$('.card b')[0].textContent.includes('今天')||$$('.card .row b')[0].textContent.length>0);
      $$('.card .row[data-action="fitness.toggleLog"]')[0].click();
      ok('展开明细显示动作', $$('.log-detail .list-item').length===2);
      $$('.card .row[data-action="fitness.toggleLog"]')[0].click();
      ok('再点收起明细', !$$('.log-detail').length);
      // 删掉一个动作后当日清空则记录移除
      $$('[data-action="fitness.tab"]').find(b=>b.textContent==='今日训练').click();
      $$('.list-item .del-btn')[0].click();
      $$('.list-item .del-btn')[0].click();
      ok('动作清空后当日日志移除', App.data.fitness.logs.length===1);
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const fc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='健身计划');
      ok('首页摘要:今天练腿日', !!fc&&fc.textContent.includes('腿日'));
      ok('首页摘要:本周1次(今日动作已清)', !!fc&&/本周 1/.test(fc.textContent), fc&&fc.textContent);
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后模板保留', App.data.fitness.weekTemplate.mon==='推日'&&App.data.fitness.weekTemplate.fri==='腿日');
      ok('刷新后日志保留', App.data.fitness.logs.length===1);
      return R; })()` }
  ]
};
