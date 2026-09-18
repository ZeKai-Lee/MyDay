// MyDay v1.1 测试：手动保存按钮 / 自媒体数据图表 / 健身·饮食月历 / 显式删除与添加按钮
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M11 v1.1 新增功能',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 手动保存按钮 + Ctrl+S
    { js: `(async()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='今日计划').closest('button').click();
      type('#todo-input','保存按钮测试');
      ok('侧栏存在立即保存按钮', !!document.querySelector('#data-status [data-action="app.save"]'));
      document.querySelector('#data-status [data-action="app.save"]').click();
      ok('点击保存出现已保存提示', document.querySelector('#toast-area').textContent.length>0, document.querySelector('#toast-area').textContent);
      ok('数据已写入localStorage', (JSON.parse(localStorage.getItem('myday-data-v1')).today.todos||[]).some(x=>x.text==='保存按钮测试'));
      document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'s',ctrlKey:true,bubbles:true,cancelable:true}));
      ok('Ctrl+S 不报错', !(window.__errs||[]).length);
      return R; })()` },
    // B. 自媒体：录入数据 → 图表
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const td=App._getToday();
      App.data.media.items.push(
        {id:'s1',title:'视频甲',stage:'published',platform:'B站',date:td,note:'',stats:{views:12000,likes:340,comments:56}},
        {id:'s2',title:'视频乙',stage:'published',platform:'抖音',date:td,note:'',stats:{views:4500,likes:120,comments:10}});
      App.save();
      $$('#nav .nav-item span').find(e=>e.textContent==='自媒体').closest('button').click();
      ok('数据看板出现', document.querySelector('#content').textContent.includes('数据看板'));
      ok('图表两条(播放)', $$('.chart-row').length===2, String($$('.chart-row').length));
      ok('播放量1.2万显示', $$('.chart-val').some(e=>e.textContent.includes('万')), $$('.chart-val').map(e=>e.textContent).join(','));
      ok('合计1.65万', document.querySelector('#content').textContent.includes('合计'));
      $$('[data-action="media.metric"]').find(b=>b.textContent==='点赞').click();
      ok('切换到点赞维度', $$('.chart-val')[0].textContent.trim()==='340', $$('.chart-val').map(e=>e.textContent).join(','));
      ok('已发布卡片显示数据行', $$('.kcard').some(k=>k.textContent.includes('▶')&&k.textContent.includes('视频甲')));
      // 编辑表单可录入数据
      [...$$('.kcard [data-action="media.edit"]')].find(k=>k.textContent==='视频甲').click();
      ok('表单含播放输入框', !!document.querySelector('#m-views')&&document.querySelector('#m-views').value==='12000');
      document.querySelector('#m-views').value='13000';
      document.querySelector('[data-action="media.save"]').click();
      ok('修改数据保存', App.data.media.items[0].stats.views===13000);
      return R; })()` },
    // C. 健身月历
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      App.data.fitness.weekTemplate.mon='推日';
      const d=new Date(); const mon=d.getDate()-((d.getDay()+6)%7);
      const monday=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(mon).padStart(2,'0');
      App.data.fitness.logs.push({id:'L1',date:monday,exercises:[{id:'e1',name:'卧推',sets:4,reps:8,weightKg:50,note:''}]});
      App.save();
      $$('#nav .nav-item span').find(e=>e.textContent==='健身计划').closest('button').click();
      $$('[data-action="fitness.tab"]').find(b=>b.textContent==='月历').click();
      ok('月历显示42格', $$('.cal-cell').length===42);
      ok('有训练的格子高亮', $$('.cal-cell.has').length===1);
      ok('格子显示部位与动作数', $$('.cal-cell.has')[0].textContent.includes('推日')&&$$('.cal-cell.has')[0].textContent.includes('1 动作'));
      ok('格子显示周一表头起', $$('.cal-head-cell')[0].textContent==='周一');
      $$('.cal-cell.has')[0].click();
      ok('跳转后显示该日期日志', $$('.list-item').some(li=>li.textContent.includes('卧推')));
      ok('日期已切到所点日期', !!document.querySelector('[data-change="fitness.date"]'));
      return R; })()` },
    // D. 饮食月历
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const td=App._getToday();
      App.data.diet.days[td]={meals:{breakfast:[{id:'f1',name:'鸡蛋',kcal:100}],lunch:[],dinner:[{id:'f2',name:'面条',kcal:400}],snack:[]},water:6};
      App.save();
      $$('#nav .nav-item span').find(e=>e.textContent==='饮食计划').closest('button').click();
      $$('[data-action="diet.tab"]').find(b=>b.textContent==='月历').click();
      ok('饮食月历42格', $$('.cal-cell').length===42);
      const cell=$$('.cal-cell.has')[0];
      ok('格子显示热量500', !!cell&&cell.textContent.includes('500'), cell&&cell.textContent);
      ok('格子显示喝水6', !!cell&&cell.textContent.includes('6'));
      cell.click();
      ok('点击跳到该日饮食', document.body.textContent.includes('鸡蛋')&&document.body.textContent.includes('面条'));
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    // E. 显式按钮：开发添加任务 / 咨询删除客户
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      // 开发：按钮文字化 + 点击按钮也能添加
      $$('#nav .nav-item span').find(e=>e.textContent==='开发工作').closest('button').click();
      type2: { const el=document.querySelector('#proj-input'); el.value='演示项目'; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); }
      ok('添加任务按钮存在', [...$$('button')].some(b=>b.textContent.includes('添加任务')));
      document.querySelector('#devtask-input').value='按钮添加的任务';
      [...$$('button')].find(b=>b.textContent.includes('添加任务')).click();
      ok('点击按钮添加任务成功', App.data.dev.tasks.some(t=>t.text==='按钮添加的任务'));
      // 咨询：删除客户按钮文字化
      $$('#nav .nav-item span').find(e=>e.textContent==='咨询工作').closest('button').click();
      { const el=document.querySelector('#client-input'); el.value='测试客户'; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); }
      ok('删除客户按钮存在且带文字', [...$$('button')].some(b=>b.textContent==='删除客户'));
      [...$$('button')].find(b=>b.textContent==='删除客户').click();
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('删除客户成功', App.data.consult.clients.length===0);
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后新增数据保留', App.data.media.items.length===2&&App.data.fitness.logs.length===1);
      return R; })()` }
  ]
};
