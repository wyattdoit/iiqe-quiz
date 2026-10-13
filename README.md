# IIQE 刷题神器 · 部署说明

## 项目结构

| 文件 | 作用 |
|---|---|
| `index.html` | 页面 + 应用逻辑（源码版，开发改这里） |
| `questions.js` | 题库数据（开发改这里） |
| `server.js` | 本地预览服务器（零依赖） |
| `build.js` | 打包脚本：合并成单文件 `dist/index.html` |
| `dist/index.html` | **部署就用这个文件**（题库已内联，无需其他文件） |

## 本地预览

```bash
npm run dev          # 启动后访问 http://127.0.0.1:7100/
```

## 部署（推送到 GitHub 即自动部署）

仓库已接入 GitHub Actions：推送（或合并）到 `main` 分支会自动执行
「构建单文件应用 → 部署到 GitHub Pages」，无需手动上传。

```bash
git add -A && git commit -m "更新内容"
git push origin main     # 推送后Actions自动构建部署，约1分钟上线
```

- 工作流文件：`.github/workflows/deploy.yml`
- 部署结果可在仓库的 Actions 页签查看。
- 线上地址：`https://wyattdoit.github.io/iiqe-quiz/`
- 自定义域名 `iiqe.sde.run`：需在 DNSPod 添加 CNAME 记录
  （`iiqe.sde.run → wyattdoit.github.io`），然后在仓库 Settings → Pages
  重新绑定域名（或用 API 设置 `cname`）。

## ⚠️ 常见坑

1. **改了题目或页面必须重新 `npm run build`**，否则线上还是旧版。
2. **部署的是 `dist/index.html`，不是项目根目录的 `index.html`**。根目录版本依赖 `questions.js`，单独上传会白屏 / 按钮无响应。
3. 不要手工编辑 `dist/index.html`，改了也会被下次打包覆盖。
4. 打包脚本会校验关键环节（题库存在、无重复声明），报错就按提示检查 `questions.js` / `index.html`，不要强行绕过。

## 验证部署是否成功

打开页面后看两点：

- 首页「题库总量」显示 **102**（显示 0 说明脚本没跑起来）；
- 点「卷一 · 保险原理及实务」能进入做题页，选选项后立即显示对错和解析。

按 F12 打开控制台，有红色报错就说明部署的包有问题，重新打包上传。
