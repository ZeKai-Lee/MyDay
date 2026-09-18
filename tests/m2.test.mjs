// MyDay M2 测试：今日计划 + 首页联动/快速备忘/顺延/持久化
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M2 今日计划+首页',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 今日计划：增/分组/勾选/编辑/删除撤销/显示已完成
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='今日计划').closest('button').click();
      type('#todo-input','买牛奶');
      ok('添加待办(默认生活)', $$('.list-item .item-text').some(e=>e.textContent==='买牛奶'));
      ok('数据:归属life+日期=今天', App.data.today.todos.some(x=>x.text==='买牛奶'&&x.tag==='life'&&x.date===App._getToday()));
      document.querySelector('#todo-tag').value='media';
      type('#todo-input','发视频');
      ok('按归属分组(自媒体|生活)', $$('.group-title .tag-chip').map(e=>e.textContent).join('|')==='自媒体|生活');
      const milkItem=$$('.list-item').find(li=>li.textContent.includes('买牛奶'));
      milkItem.querySelector('input[type=checkbox]').click();
      ok('勾选后划线', $$('.item-text').some(e=>e.textContent==='买牛奶'&&e.classList.contains('done')));
      ok('进度显示 1/2', document.querySelector('.page-sub').textContent.trim()==='1/2 ✓');
      $$('.list-item .item-text').find(e=>e.textContent==='买牛奶').click();
      ok('点击进入行内编辑', !!document.querySelector('#todo-edit'));
      type('#todo-edit','买两盒牛奶');
      ok('编辑保存生效', $$('.list-item .item-text').some(e=>e.textContent==='买两盒牛奶'));
      const del=[...$$('.del-btn')].find(b=>b.closest('.list-item').textContent.includes('买两盒牛奶'));
      del.click();
      ok('删除生效', !App.data.today.todos.some(x=>x.text==='买两盒牛奶'));
      const undoBtn=document.querySelector('#toast-area button');
      ok('出现撤销按钮(5秒)', !!undoBtn);
      if(undoBtn) undoBtn.click();
      ok('撤销恢复数据', App.data.today.todos.some(x=>x.text==='买两盒牛奶'));
      [...$$('button')].find(b=>b.textContent==='隐藏已完成').click();
      ok('隐藏已完成', !$$('.item-text.done').length);
      [...$$('button')].find(b=>b.textContent==='显示已完成').click();
      ok('重新显示已完成', $$('.item-text.done').length===1);
      return R; })()` },
    // B. 首页联动 + 快速备忘
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      ok('首页进度与今日同步 1/2', (document.querySelector('.card-title .muted')||{}).textContent==='1/2');
      ok('首页展示2条今日待办', $$('.list-item input[type=checkbox]').length===2);
      const milk=$$('.list-item').find(li=>li.textContent.includes('买两盒牛奶'));
      ok('首页勾选状态同步(已勾)', !!(milk&&milk.querySelector('input[type=checkbox]').checked));
      type('#home-todo-input','首页快速添加');
      ok('首页快速添加写入今日数据', App.data.today.todos.some(x=>x.text==='首页快速添加'&&x.date===App._getToday()));
      type('#memo-input','记着交房租');
      ok('快速备忘已添加', App.data.home.memos.some(m=>m.text==='记着交房租'));
      $$('.list-item').find(li=>li.textContent.includes('记着交房租')).querySelector('.item-text').click();
      ok('点击备忘划掉', $$('.item-text.done').some(e=>e.textContent==='记着交房租'));
      [...$$('.del-btn')].find(b=>b.closest('.list-item').textContent.includes('记着交房租')).click();
      ok('备忘删除生效', !App.data.home.memos.some(m=>m.text==='记着交房租'));
      const ub=document.querySelector('#toast-area button');
      if(ub) ub.click();
      ok('备忘撤销恢复', App.data.home.memos.some(m=>m.text==='记着交房租'));
      return R; })()` },
    // C. 跨天顺延（用测试时钟把“今天”拨到明天）
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const d=new Date(Date.now()+86400000);
      const tm=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      App._setToday(tm);
      $$('#nav .nav-item span').find(e=>e.textContent==='今日计划').closest('button').click();
      ok('跨天后今日列表为空', !$$('.group-title').length);
      const carryBtn=[...$$('button')].find(b=>b.textContent.includes('之前未完成'));
      ok('顺延区出现且计数=2', !!carryBtn&&carryBtn.textContent.includes('2'), carryBtn&&carryBtn.textContent.trim());
      carryBtn.click();
      ok('展开可见2条未完成', $$('.list-item .item-text').filter(e=>e.textContent==='发视频'||e.textContent==='首页快速添加').length===2);
      ok('已完成的不进顺延区', !$$('.list-item .item-text').some(e=>e.textContent==='买两盒牛奶'));
      [...$$('button')].find(b=>b.dataset.action==='today.carryAdd').click();
      ok('「加入今天」进入今日分组', $$('.group-title').length===1);
      [...$$('button')].find(b=>b.dataset.action==='today.carryDone').click();
      ok('「完成掉」后顺延区消失', ![...$$('button')].some(b=>b.textContent.includes('之前未完成')));
      App._setToday(null);
      return R; })()` },
    // D. 刷新持久化
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后待办保留(3条)', App.data.today.todos.length===3, String(App.data.today.todos.length));
      ok('刷新后备忘保留', App.data.home.memos.some(m=>m.text==='记着交房租'));
      const real=(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date());
      ok('刷新后恢复真实系统日期', App._getToday()===real, App._getToday());
      ok('无页面脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` }
  ]
};
