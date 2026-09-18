// MyDay M4 测试：开发工作（项目/任务/笔记/跨项目搜索/级联删除）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M4 开发工作',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 项目增删改选 + 任务 + 笔记
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='开发工作').closest('button').click();
      type('#proj-input','官网重构');
      ok('新建项目并选中', App.data.dev.projects.length===1&&App.data.dev.projects[0].name==='官网重构');
      type('#proj-input','小程序');
      ok('新建后切换选中', (App.data.dev.projects.find(p=>p.name==='小程序')).status==='active');
      ok('右侧显示选中的项目', $$('.split .card')[1].textContent.includes('小程序'));
      $$('.split .card')[0].querySelectorAll('[data-action="dev.select"]')[0].click();
      ok('点击左侧切换选中', $$('.split .card')[1].textContent.includes('官网重构'));
      // 重命名
      $$('.split .card')[1].querySelector('[data-action="dev.renameStart"]').click();
      type('#proj-rename','官网重构2.0');
      ok('项目改名生效', App.data.dev.projects[0].name==='官网重构2.0');
      // 状态切换
      const st=$$('.split .card')[1].querySelector('select[data-change="dev.status"]');
      st.value='paused'; st.dispatchEvent(new Event('change',{bubbles:true}));
      ok('状态切换为暂停', App.data.dev.projects[0].status==='paused');
      st.value='active'; st.dispatchEvent(new Event('change',{bubbles:true}));
      // 任务
      type('#devtask-input','写接口');
      type('#devtask-input','画页面');
      ok('任务2条', App.data.dev.tasks.length===2);
      $$('.list-item input[type=checkbox]')[0].click();
      ok('任务勾选完成', App.data.dev.tasks[0].done===true);
      ok('左列表进度 1/2', $$('.split .card')[0].textContent.includes('1/2'));
      $$('.list-item .item-text').find(e=>e.textContent==='画页面').click();
      type('#devtask-edit','画页面初稿');
      ok('任务行内编辑生效', App.data.dev.tasks.some(t=>t.text==='画页面初稿'));
      [...$$('.list-item .del-btn')].find(b=>b.closest('.list-item').textContent.includes('画页面初稿')).click();
      ok('任务删除生效', !App.data.dev.tasks.some(t=>t.text==='画页面初稿'));
      document.querySelector('#toast-area button').click();
      ok('任务撤销恢复', App.data.dev.tasks.some(t=>t.text==='画页面初稿'));
      // 笔记
      [...$$('button')].find(b=>b.textContent.includes('添加笔记')).click();
      ok('笔记表单出现', !!document.querySelector('#note-title')&&!!document.querySelector('#note-content'));
      document.querySelector('#note-title').value='部署命令';
      document.querySelector('#note-content').value='npm run deploy --prod';
      document.querySelector('[data-action="dev.saveNote"]').click();
      ok('笔记保存', App.data.dev.notes.length===1&&App.data.dev.notes[0].title==='部署命令');
      $$('[data-action="dev.editNote"]').find(e=>e.textContent==='部署命令').click();
      ok('笔记编辑表单回填', document.querySelector('#note-content').value.includes('deploy'));
      document.querySelector('#note-content').value='npm run deploy --prod && echo done';
      document.querySelector('[data-action="dev.saveNote"]').click();
      ok('笔记内容更新', App.data.dev.notes[0].content.includes('echo done'));
      return R; })()` },
    // B. 跨项目搜索 + 级联删除 + 首页摘要
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      // 给第二个项目加一条笔记
      $$('.split .card')[0].querySelectorAll('[data-action="dev.select"]')[1].click();
      [...$$('button')].find(b=>b.textContent.includes('添加笔记')).click();
      document.querySelector('#note-title').value='支付接口备忘';
      document.querySelector('#note-content').value='微信支付回调要验签';
      document.querySelector('[data-action="dev.saveNote"]').click();
      ok('第二项目笔记添加', App.data.dev.notes.length===2);
      // 搜索
      const sb=document.querySelector('#dev-search');
      sb.value='验签';
      sb.dispatchEvent(new Event('input',{bubbles:true}));
      ok('搜索显示结果卡片', $$('.split .card')[1].textContent.includes('搜索结果'));
      ok('搜索命中1条', $$('.split .card')[1].textContent.includes('支付接口备忘'));
      [...$$('[data-action="dev.openNote"]')][0].click();
      ok('点击结果跳到对应项目并展开编辑', $$('.split .card')[1].textContent.includes('小程序')&&!!document.querySelector('#note-title'));
      // 级联删除：切到官网重构2.0，删除它
      $$('.split .card')[0].querySelectorAll('[data-action="dev.select"]')[0].click();
      $$('.split .card')[1].querySelector('[data-action="dev.delProject"]').click();
      ok('弹出确认框', !!document.querySelector('.modal'));
      document.querySelector('.modal [data-action="modal.close"]').click();
      ok('取消后项目仍在', App.data.dev.projects.length===2);
      $$('.split .card')[1].querySelector('[data-action="dev.delProject"]').click();
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('确认后项目删除', App.data.dev.projects.length===1);
      ok('连带删除其任务', !App.data.dev.tasks.some(t=>t.projectId==='nouse'));
      ok('任务总数=第二项目的1条', App.data.dev.tasks.length===0, String(App.data.dev.tasks.length));
      ok('连带删除其笔记', App.data.dev.notes.length===1&&App.data.dev.notes[0].title==='支付接口备忘');
      // 首页摘要
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const dc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='开发工作');
      ok('首页摘要:1个进行中项目', !!dc&&dc.textContent.includes('1'));
      ok('首页摘要:未完成任务0', !!dc&&dc.textContent.includes('0'));
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后项目保留', App.data.dev.projects.length===1);
      ok('刷新后笔记保留', App.data.dev.notes.length===1);
      return R; })()` }
  ]
};
