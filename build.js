// IIQE 刷题应用打包脚本（零依赖）
// 将 index.html + questions.js 打包成单文件 dist/index.html：
//   1. 提取题库数据，把 `window.QBANK = [...]` 改写为 `const QB = [...]` 内联进 HTML
//   2. 删除应用脚本里的 `const QB = window.QBANK;`（避免重复声明导致整个脚本失效）
// 用法：node build.js
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const qsrc = fs.readFileSync(path.join(root, 'questions.js'), 'utf8');

// 1. 提取题库：window.QBANK = [ ... ];  ->  const QB = [ ... ];
const m = qsrc.match(/window\.QBANK\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
if (!m) { console.error('打包失败：questions.js 中未找到 window.QBANK 定义'); process.exit(1); }
const qbInline = 'const QB = ' + m[1] + ';';

// 2. 内联题库脚本，替换外部引用
const SCRIPT_TAG = '<script src="questions.js"></script>';
if (!html.includes(SCRIPT_TAG)) { console.error('打包失败：index.html 中未找到 <script src="questions.js"></script>'); process.exit(1); }
let out = html.replace(SCRIPT_TAG, '<script>\n' + qbInline + '\n</script>');

// 3. 删除重复的 QB 声明
const DUP = 'const QB = window.QBANK;';
if (!out.includes(DUP)) { console.error('打包失败：未找到预期的「const QB = window.QBANK;」声明'); process.exit(1); }
out = out.replace(DUP + '\n', '');

// 4. 输出
const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'index.html'), out);

const n = (m[1].match(/\{p:/g) || []).length;
console.log(`打包完成：dist/index.html（内联题库 ${n} 题）`);
