// MyDay M3 测试：自媒体灵感库 + 四列看板 + 统计 + 首页摘要
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M3 自媒体看板',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    { url: APP },
    // A. 灵感库 / 转正式 / 推进 / 编辑 / 发布 / 统计 / 新建 / 删除撤销
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const type=(sel,v)=>{ const el=document.querySelector(sel); if(!el){ok('输入框存在:'+sel,false,sel);return;} el.value=v; el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
      $$('#nav .nav-item span').find(e=>e.textContent==='自媒体').closest('button').click();
      type('#idea-input','评测新键盘');
      type('#idea-input','出一期Vlog');
      ok('灵感添加2条', App.data.media.ideas.length===2);
      ok('灵感最新在上', $$('.split .card .list-item .item-text')[0].textContent==='出一期Vlog');
      $$('[data-action="media.convert"]')[0].click();
      ok('转正式后灵感剩1条', App.data.media.ideas.length===1);
      ok('看板想法列出现卡片', $$('.kanban .kcol')[0].textContent.includes('出一期Vlog'));
      const findCard=t=>[...$$('.kanban .kcard')].find(k=>k.textContent.includes(t));
      findCard('出一期Vlog').querySelector('[data-action="media.advance"]').click();
      ok('推进→准备中', App.data.media.items[0].stage==='wip');
      findCard('出一期Vlog').querySelector('[data-action="media.advance"]').click();
      ok('推进→草稿完成', App.data.media.items[0].stage==='draft');
      findCard('出一期Vlog').querySelector('[data-action="media.edit"]').click();
      document.querySelector('#m-platform').value='B站';
      type('#m-title','出一期Vlog');
      ok('编辑保存带平台', App.data.media.items[0].platform==='B站');
      findCard('出一期Vlog').querySelector('[data-action="media.advance"]').click();
      ok('推进→已发布并自动补日期', App.data.media.items[0].stage==='published'&&App.data.media.items[0].date===App._getToday());
      ok('本月发布统计=1', $$('.statbar span')[0].textContent.includes('1'), $$('.statbar span')[0].textContent);
      ok('平台分布显示B站 1', $$('.statbar')[0].textContent.includes('B站 1'), $$('.statbar')[0].textContent);
      [...$$('button')].find(b=>b.textContent.includes('新内容')).click();
      ok('新建表单出现在想法列', !!document.querySelector('#m-title'));
      document.querySelector('#m-title').value='选题二';
      document.querySelector('[data-action="media.save"]').click();
      ok('新内容进入想法列', App.data.media.items.some(x=>x.title==='选题二'&&x.stage==='idea'));
      [...$$('[data-action="media.ideaDel"]')][0].click();
      ok('灵感删除生效', App.data.media.ideas.length===0);
      document.querySelector('#toast-area button').click();
      ok('灵感撤销恢复', App.data.media.ideas.length===1);
      ok('无脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` },
    // B. 已发布折叠 + 首页摘要卡
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const t=App._getToday();
      for(let i=0;i<5;i++) App.data.media.items.push({id:'seed'+i, title:'历史视频'+i, stage:'published', platform:'公众号', date:t, note:''});
      App.save(); App.render();
      let cols=$$('.kanban .kcol');
      ok('已发布列默认只显示最近5条', cols[3].querySelectorAll('.kcard').length===5, String(cols[3].querySelectorAll('.kcard').length));
      ok('出现「查看更多」', [...cols[3].querySelectorAll('button')].some(b=>b.textContent.includes('查看更多')));
      [...cols[3].querySelectorAll('button')].find(b=>b.textContent.includes('查看更多')).click();
      ok('展开后显示全部6条', $$('.kanban .kcol')[3].querySelectorAll('.kcard').length===6);
      [...$$('.kanban .kcol')[3].querySelectorAll('button')].find(b=>b.textContent.includes('收起')).click();
      ok('收起恢复5条', $$('.kanban .kcol')[3].querySelectorAll('.kcard').length===5);
      ok('统计6条+平台分布', $$('.statbar')[0].textContent.includes('6')&&$$('.statbar')[0].textContent.includes('公众号 5'), $$('.statbar')[0].textContent);
      $$('#nav .nav-item span').find(e=>e.textContent==='首页总览').closest('button').click();
      const mc=$$('.sum-card').find(c=>c.querySelector('.card-title').textContent==='自媒体');
      ok('首页摘要:已发布6条', !!mc&&mc.textContent.includes('6'));
      ok('首页摘要:待发布选题二', !!mc&&mc.textContent.includes('选题二'));
      return R; })()` },
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      ok('刷新后内容保留(7条)', App.data.media.items.length===7, String(App.data.media.items.length));
      ok('刷新后灵感保留', App.data.media.ideas.length===1);
      return R; })()` }
  ]
};
