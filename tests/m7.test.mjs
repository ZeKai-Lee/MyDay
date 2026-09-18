// MyDay M7 测试：饮食计划（四餐记录/喝水/速查表点选/补记/日期隔离）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M7 饮食计划',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 四餐记录 + 喝水 + 目标 + 热量小计
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='饮食计划').closest('button').click();
      ok('四张餐次卡', $$('.grid2 .card').length===4);
      document.querySelector('#food-kcal-breakfast').value='100';
      type('#food-name-breakfast','鸡蛋');
      document.querySelector('#food-kcal-lunch').value='200';
      type('#food-name-lunch','糙米饭');
      ok('早餐记录1条', App.data.diet.days[App._getToday()].meals.breakfast.length===1);
      ok('午餐记录1条带热量', App.data.diet.days[App._getToday()].meals.lunch[0].kcal===200);
      $$('[data-action="diet.waterPlus"]').forEach(b=>b.click());
      $$('[data-action="diet.waterPlus"]').forEach(b=>b.click());
      $$('[data-action="diet.waterPlus"]').forEach(b=>b.click());
      $$('[data-action="diet.waterMinus"]').forEach(b=>b.click());
      ok('喝水+3-1=2', App.data.diet.days[App._getToday()].water===2);
      ok('显示 2/8', document.body.textContent.includes('2/ 8'));
      $$('[data-action="diet.goalEdit"]').forEach(b=>b.click());
      type('#goal-edit','10');
      ok('目标改为10', App.data.diet.waterGoal===10);
      ok('改后显示 2/10', document.body.textContent.includes('2/ 10'));
      ok('今日热量300', document.body.textContent.includes('300'), document.body.textContent.match(/今日热量[^千]*/)?.[0]||'');
      return R; })()` },
    // B. 速查表 + 点选带入
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('[data-action="diet.tab"]').find(b=>b.textContent==='速查表').click();
      document.querySelector('#lk-kcal').value='250';
      type('#lk-name','牛奶');
      document.querySelector('#lk-kcal').value='100';
      type('#lk-name','鸡蛋');
      ok('速查表2条', App.data.diet.foodTable.length===2);
      $$('[data-action="diet.tab"]').find(b=>b.textContent==='今日饮食').click();
      const bcards=$$('.grid2 .card');
      bcards[0].querySelector('[data-action="diet.pickToggle"]').click();
      ok('点选面板出现', !!document.querySelector('#lookup-filter'));
      const lf=document.querySelector('#lookup-filter');
      lf.value='牛奶'; lf.dispatchEvent(new Event('input',{bubbles:true}));
      ok('筛选只剩牛奶', $$('.lookup-item').length===1&&$$('.lookup-item')[0].textContent.includes('牛奶'));
      $$('[data-action="diet.pickAdd"]')[0].click();
      ok('点选加入早餐(带热量)', App.data.diet.days[App._getToday()].meals.breakfast.some(f=>f.name==='牛奶'&&f.kcal===250));
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    // C. 昨天补记 + 日期隔离 + 首页摘要
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:~~c===c?!!c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      const d=new Date(Date.now()-86400000);
      const y=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      $$('[data-action="diet.prev"]')[0].click();
      ok('切到昨天', !!App.data.diet.days[y]);
      document.querySelector('#food-kcal-dinner').value='400';
      type('#food-name-dinner','面条');
      ok('昨天晚餐记录', App.data.diet.days[y].meals.dinner.length===1);
      ok('昨天喝水独立为0', App.data.diet.days[y].water===0);
      $$('[data-action="diet.next"]')[0].click();
      ok('回到今天:喝水仍2', App.data.diet.days[App._getToday()].water===2);
      ok('回到今天:早餐2条', App.data.diet.days[App._getToday()].meals.breakfast.length===2);
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const dc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='饮食计划');
      ok('首页摘要:喝水2/10', !!dc&&dc.textContent.includes('2/10'), dc&&dc.textContent);
      ok('首页摘要:2餐550千卡', !!dc&&dc.textContent.includes('2')&&dc.textContent.includes('550'), dc&&dc.textContent);
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后速查表保留', App.data.diet.foodTable.length===2);
      ok('刷新后今日餐记录保留', App.data.diet.days[App._getToday()].meals.breakfast.length===2);
      ok('刷新后昨天补记保留', Object.keys(App.data.diet.days).length>=2);
      return R; })()` }
  ]
};
