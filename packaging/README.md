# MyDay exe 发行包构建方法（Electron 免编译方案）

无需 Node.js/npm，使用 Electron 官方预编译运行时（v33.0.0，来自 npmmirror 官方镜像）。

## 重建步骤

1. 下载运行时：
   `https://registry.npmmirror.com/-/binary/electron/v33.0.0/electron-v33.0.0-win32-x64.zip`（约 115MB）
2. 解压到 `release/MyDay-exe-win64/`，把 `electron.exe` 改名为 `MyDay.exe`。
3. 删除 `resources/default_app.asar`（Electron 默认欢迎页），新建 `resources/app/`：
   - `main.js`（本目录文件：创建窗口、加载 MyDay.html、icon、加载完成日志）
   - `package.json`（本目录文件：name/productName=MyDay，main=main.js）
   - `MyDay.html`（项目根目录的应用本体）
   - `icon.ico`（本目录文件：蓝色渐变底 + 白色 M，System.Drawing 生成）
4. 精简 `locales/`：只保留 `zh-CN.pak`、`en-US.pak`、`en-GB.pak`，其余删除（省约 30MB）。
5. 放入 `使用说明.md`。
6. 验收：启动 MyDay.exe → 进程存在 → 控制台输出 `[MyDay] loaded ok` →
   `%APPDATA%\MyDay` 数据目录创建 → 关闭退出干净。
7. 压缩：`Compress-Archive release/MyDay-exe-win64/* → release/MyDay-v1.1.1-exe-win64.zip`。

## 正式存放路径

日常使用的 exe 版安装在 **`D:\MyDay\`**（从 release 构建目录复制过去），桌面快捷方式 `MyDay.lnk`
指向 `D:\MyDay\MyDay.exe`，快捷方式图标取自 `D:\MyDay\resources\app\icon.ico`。
项目内的 `release/MyDay-exe-win64/` 只是构建工作目录（已 gitignore）。

## 已知限制

- exe 文件在资源管理器里的图标仍是 Electron 默认图标（改它需要 rcedit/NPM 工具链）；
  窗口标题栏与任务栏图标已是自定义 icon.ico。
- 若需升级 Electron 或加自动更新，再引入 npm 工具链。
