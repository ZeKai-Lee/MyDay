// MyDay M8 测试：游戏娱乐（游戏库/状态/时长累计/筛选/最近游玩）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M8 游戏娱乐',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='游戏娱乐').closest('button').click();
      type('#game-input','塞尔达');
      type('#game-input','星露谷');
      ok('添加2款默认想玩', App.data.games.games.length===2&&App.data.games.games.every(g=>g.status==='wish'));
      // 状态切换
      const sel=$$('select[data-change="games.status"]')[0];
      sel.value='playing'; sel.dispatchEvent(new Event('change',{bubbles:true}));
      ok('切为在玩', App.data.games.games[0].status==='playing');
      ok('统计在玩1款', $$('.statbar')[0].textContent.includes('1 款'));
      // 记录游玩
      $$('[data-action="games.logStart"]')[0].click();
      ok('出现分钟输入', !!document.querySelector('#play-min'));
      document.querySelector('#play-min').value='30';
      $$('[data-action="games.logSave"]')[0].click();
      ok('累计30分钟', App.data.games.games[0].totalMinutes===30);
      ok('本月统计30分钟', $$('.statbar')[0].textContent.includes('30'), $$('.statbar')[0].textContent);
      ok('最近游玩1条', $$('.card')[1].textContent.includes('塞尔达'));
      // 再玩一次 + Enter 提交路径
      $$('[data-action="games.logStart"]')[0].click();
      document.querySelector('#play-min').value='15';
      type('#play-min','15');
      ok('累计45分钟(回车提交)', App.data.games.games[0].totalMinutes===45);
      ok('游玩记录2条', App.data.games.plays.length===2);
      // 筛选
      $$('[data-action="games.filter"]').find(b=>b.textContent==='想玩').click();
      ok('筛选想玩只显示星露谷', $$('.list-item b').length===1&&$$('.list-item b')[0].textContent==='星露谷');
      $$('[data-action="games.filter"]').find(b=>b.textContent==='全部').click();
      ok('全部显示2款', $$('.list-item b').length===2);
      // 删除+撤销（连带游玩记录）
      [...$$('.del-btn')].find(b=>b.closest('.list-item').textContent.includes('塞尔达')).click();
      ok('删除游戏生效', App.data.games.games.length===1);
      ok('连带删除游玩记录', App.data.games.plays.length===0);
      document.querySelector('#toast-area button').click();
      ok('撤销恢复游戏和记录', App.data.games.games.length===2&&App.data.games.plays.length===2);
      ok('撤销后累计仍45', App.data.games.games[0].totalMinutes===45);
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    // 首页摘要 + 持久化
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const gc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='游戏娱乐');
      ok('首页摘要:在玩1款', !!gc&&gc.textContent.includes('1 款'), gc&&gc.textContent);
      ok('首页摘要:本月45分钟', !!gc&&gc.textContent.includes('45'), gc&&gc.textContent);
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后游戏保留', App.data.games.games.length===2);
      ok('刷新后累计保留', App.data.games.games[0].totalMinutes===45);
      ok('刷新后游玩记录保留', App.data.games.plays.length===2);
      return R; })()` }
  ]
};
