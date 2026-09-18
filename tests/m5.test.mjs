// MyDay M5 测试：咨询工作（客户/记录/统计/待办一键进今日计划/级联删除）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M5 咨询工作',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 客户管理 + 记录 + 待办联动
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='咨询工作').closest('button').click();
      type('#client-input','张老师');
      type('#client-input','李公司');
      ok('两个客户', App.data.consult.clients.length===2);
      ok('新建后右侧显示李公司', $$('.split .card')[1].textContent.includes('李公司'));
      $$('.split .card')[0].querySelectorAll('[data-action="consult.select"]')[0].click();
      ok('点击切换到张老师', $$('.split .card')[1].textContent.includes('张老师'));
      $$('.split .card')[1].querySelector('[data-action="consult.renameStart"]').click();
      type('#client-rename','张教授');
      ok('客户改名生效', App.data.consult.clients[0].name==='张教授');
      $$('.split .card')[1].querySelector('[data-field="note"]').click();
      type('#c-field','高三家长');
      ok('备注行内编辑保存', App.data.consult.clients[0].note==='高三家长');
      [...$$('button')].find(b=>b.textContent.includes('添加咨询记录')).click();
      ok('记录表单出现', !!document.querySelector('#s-summary'));
      document.querySelector('#s-summary').value='第一次沟通，了解需求';
      document.querySelector('#s-min').value='45';
      document.querySelector('#s-follow').value='发方案给客户';
      document.querySelector('[data-action="consult.saveSession"]').click();
      ok('记录保存(时长45)', App.data.consult.sessions.length===1&&App.data.consult.sessions[0].minutes===45);
      ok('统计本月1次', $$('.statbar')[0].textContent.includes('1 次'), $$('.statbar')[0].textContent);
      ok('统计累计45分钟', $$('.statbar')[0].textContent.includes('45'), $$('.statbar')[0].textContent);
      $$('[data-action="consult.addFollow"]')[0].click();
      ok('一键生成咨询待办', App.data.today.todos.some(x=>x.text==='发方案给客户'&&x.tag==='consult'&&x.date===App._getToday()));
      ok('按钮变为已加入且不可再点', !$$('[data-action="consult.addFollow"]').length&&$$('.split .card')[1].textContent.includes('已加入'));
      App.go('today');
      ok('今日计划出现咨询分组', [...$$('.group-title')].some(g=>g.textContent.includes('咨询')&&$$('.list-item').some(li=>li.textContent.includes('发方案给客户'))));
      App.go('consult');
      [...$$('.list-item .del-btn')].find(b=>b.closest('.list-item').textContent.includes('第一次沟通')).click();
      ok('记录删除生效', App.data.consult.sessions.length===0);
      document.querySelector('#toast-area button').click();
      ok('记录撤销恢复', App.data.consult.sessions.length===1);
      return R; })()` },
    // B. 级联删除 + 首页摘要 + 持久化
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      $$('.split .card')[0].querySelectorAll('[data-action="consult.select"]')[1].click();
      $$('.split .card')[1].querySelector('[data-action="consult.delClient"]').click();
      ok('删除客户弹确认框', !!document.querySelector('.modal'));
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('确认删除李公司', App.data.consult.clients.length===1&&App.data.consult.clients[0].name==='张教授');
      ok('张教授的记录保留', App.data.consult.sessions.length===1);
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const cc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='咨询工作');
      ok('首页摘要:本月1次', !!cc&&cc.textContent.includes('1 次'));
      ok('首页摘要:最近记录摘要', !!cc&&cc.textContent.includes('第一次沟通'));
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后客户保留', App.data.consult.clients.length===1);
      ok('刷新后记录保留', App.data.consult.sessions.length===1);
      ok('刷新后咨询待办保留', App.data.today.todos.some(x=>x.tag==='consult'&&x.text==='发方案给客户'));
      return R; })()` }
  ]
};
