// MyDay M1 地基测试 —— 由浏览器自动化驱动执行（执行方式见 tests/README.md）
const APP = 'http://127.0.0.1:8377/MyDay.html';

export default {
  name: 'M1 地基：外壳/存储/双语/主题',
  steps: [
    { url: APP },
    { js: "(()=>{ localStorage.clear(); window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message||e))); return 'setup-ok'; })()" },
    // 重新加载：从全新存档启动
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      const nav=$$('#nav .nav-item span').map(e=>e.textContent);
      ok('导航共9项', nav.length===9, nav.join(','));
      ok('中文标签正确', nav[0]==='首页总览'&&nav[1]==='今日计划'&&nav[2]==='自媒体'&&nav[8]==='数据与设置');
      const d=JSON.parse(localStorage.getItem('myday-data-v1')||'null');
      ok('首次运行建立存档', !!d);
      ok('schemaVersion=1', !!d&&d.schemaVersion===1);
      ok('默认中文+浅色', !!d&&d.prefs.lang==='zh'&&d.prefs.theme==='light');
      ok('九个模块数据齐全', !!d&&['home','today','media','dev','consult','fitness','diet','games'].every(k=>k in d));
      $$('#nav .nav-item')[1].click();
      ok('导航切换到今日计划', ($('#content')||{}).textContent!==undefined && $$('#content .empty').length===1);
      ok('当前项高亮', ($('#nav .nav-item.active span')||{}).textContent==='今日计划');
      $$('#nav .nav-item')[8].click();
      const en=[...document.querySelectorAll('.chip')].find(b=>b.textContent==='English');
      ok('语言切换按钮存在', !!en);
      if(en) en.click();
      ok('切换后导航为英文', $$('#nav .nav-item span')[0].textContent==='Home');
      ok('html.lang=en', document.documentElement.lang==='en');
      const dark=[...document.querySelectorAll('.chip')].find(b=>b.textContent==='Dark');
      if(dark) dark.click();
      ok('深色模式生效', document.documentElement.dataset.theme==='dark');
      return R; })()` },
    // 刷新：验证持久化与“刷新回首页”
    { url: APP },
    { js: `(()=>{ const R=[]; const ok=(n,c,i)=>R.push({n,c:!!c,i:i==null?'':String(i)});
      const $$=s=>[...document.querySelectorAll(s)];
      ok('刷新后回到首页', ($('#nav .nav-item.active span')||{}).textContent==='Home');
      ok('刷新后语言保持英文', document.documentElement.lang==='en');
      ok('刷新后主题保持深色', document.documentElement.dataset.theme==='dark');
      ok('从未导出→备份提醒红色', ((document.querySelector('#data-status .ds-backup')||{}).className||'').includes('danger'));
      const real=(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date());
      ok('今天=电脑系统日期', !!window.App&&App._getToday()===real, window.App?App._getToday()+' vs '+real:'');
      const ext=performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin));
      ok('无任何外部网络请求', ext.length===0, ext.map(r=>r.name).join('|'));
      ok('无页面脚本报错', !(window.__errs||[]).length, (window.__errs||[]).join(' | '));
      return R; })()` }
  ]
};
