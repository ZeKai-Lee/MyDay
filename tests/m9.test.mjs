// MyDay M9 测试：数据与设置（导出/导入/清空/备份提醒红黄绿）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M9 数据与设置',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 导出 + 备份提醒状态
    { js: `(async()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      const sb=()=>document.querySelector('#data-status .ds-backup');
      // 先造点数据供后面导入恢复
      App.data.today.todos.push({id:'t1',text:'待办A',tag:'life',date:App._getToday(),done:false});
      App.data.home.memos.push({id:'m1',text:'备忘A',done:false});
      App.data.games.games.push({id:'g1',name:'游戏A',status:'playing',totalMinutes:30});
      App.save(); App.render();
      window.__snap = JSON.stringify(App.data);
      $$('#nav .nav-item span').find(e=>e.textContent==='数据与设置').closest('button').click();
      ok('未导出→红色', sb().className.includes('danger'), sb().className);
      $$('[data-action="settings.export"]')[0].click();
      ok('导出记录时间', !!App.data.prefs.lastExportAt, App.data.prefs.lastExportAt);
      ok('导出后→绿色', sb().className.includes('ok'), sb().className);
      const ago=n=>{ const d=new Date(Date.now()-n*86400000); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'T09:00'; };
      App.data.prefs.lastExportAt=ago(8); App.save(); App.render();
      ok('8天前→黄色', document.querySelector('#data-status .ds-backup').className.includes('warn'), sb().className);
      App.data.prefs.lastExportAt=ago(31); App.save(); App.render();
      ok('31天前→红色', document.querySelector('#data-status .ds-backup').className.includes('danger'), sb().className);
      App.data.prefs.lastExportAt=ago(2); App.save(); App.render();
      ok('2天前→绿色', document.querySelector('#data-status .ds-backup').className.includes('ok'), sb().className);
      ok('设置页含说明与版本', document.querySelector('#content').textContent.includes('浏览器')&&document.querySelector('#content').textContent.includes('1.0.0'));
      return R; })()` },
    // B. 清空（输错字不放行 / 输对清空）
    { js: `(async()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      $$('[data-action="settings.clearAsk"]')[0].click();
      ok('弹清空确认框(含输入)', !!document.querySelector('#confirm-input'));
      document.querySelector('#confirm-input').value='qingkong';
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('输错不执行且提示', App.data.today.todos.length===1&&document.querySelector('#toast-area').textContent.includes('未执行'));
      document.querySelector('.modal [data-action="modal.close"]').click();
      $$('[data-action="settings.clearAsk"]')[0].click();
      document.querySelector('#confirm-input').value='清空';
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('输对→全部清空', App.data.today.todos.length===0&&!App.data.home.memos.length&&!App.data.games.games.length);
      ok('界面回到空状态', document.querySelector('#toast-area').textContent.includes('已清空'));
      await new Promise(r=>setTimeout(r,300));
      return R; })()` },
    // C. 导入：坏文件不动数据 / 好文件完整恢复
    { js: `(async()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const feed=async(content)=>{ const dt=new DataTransfer();
        dt.items.add(new File([content],'b.json',{type:'application/json'}));
        const inp=document.querySelector('#import-file'); inp.files=dt.files;
        inp.dispatchEvent(new Event('change',{bubbles:true}));
        await new Promise(r=>setTimeout(r,300)); };
      await feed('{{this is not json');
      ok('坏文件→失败提示', document.querySelector('#toast-area').textContent.includes('导入失败'));
      ok('坏文件→数据未动', App.data.today.todos.length===0);
      // 结构对但缺字段
      await feed(JSON.stringify({schemaVersion:1}));
      ok('缺字段→同样失败', document.querySelector('#toast-area').textContent.includes('导入失败'));
      // 正常导入
      await feed(window.__snap);
      const modal=document.querySelector('.modal');
      ok('导入弹确认+数据量摘要', !!modal&&modal.textContent.includes('今日计划 1')&&modal.textContent.includes('游戏娱乐 1'), modal&&modal.textContent.slice(0,120));
      document.querySelector('.modal [data-action="modal.ok"]').click();
      ok('确认后数据完整恢复', App.data.today.todos.length===1&&App.data.home.memos[0].text==='备忘A'&&App.data.games.games[0].name==='游戏A');
      ok('恢复提示', document.querySelector('#toast-area').textContent.includes('导入成功'));
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后导入的数据仍在', App.data.today.todos.length===1&&App.data.games.games[0].name==='游戏A');
      return R; })()` }
  ]
};
