# 钱刚 (Bill Qian) — SMT 专家个人作品集网站

## 项目结构

```
bill_qian_portfolio_export/
├── build/              ← 已构建的静态文件（可直接部署到任何Web服务器）
│   ├── index.html
│   └── assets/
│       ├── index-xxx.css
│       └── index-xxx.js
├── source/             ← 完整源代码（可用 VS Code 修改）
│   ├── client/
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── pages/Home.tsx        ← 主页面（修改内容在这里）
│   │   │   ├── contexts/LanguageContext.tsx  ← 中英文翻译数据
│   │   │   ├── components/           ← UI 组件
│   │   │   ├── index.css             ← 全局样式
│   │   │   └── App.tsx               ← 路由配置
│   │   └── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md           ← 本文件
```

## 快速部署（无需编程）

将 `build/` 文件夹中的所有文件上传到任何静态网站托管服务即可：
- **GitHub Pages**：将 build 文件夹内容推送到 gh-pages 分支
- **Netlify**：拖拽 build 文件夹到 Netlify 面板
- **Vercel**：连接仓库并设置输出目录为 build
- **阿里云 OSS / 腾讯云 COS**：上传 build 文件夹内容

> **注意**：build 中的资源文件（简历PDF、PPT文档、微信二维码图片）引用的是 `/manus-storage/` 路径。如果脱离 Manus 部署，需要将这些文件下载后放到您的服务器上，并修改 `index.html` 或源代码中的路径。

## 本地开发（使用 VS Code）

### 环境要求
- Node.js 18+ （推荐 20 或 22）
- pnpm（推荐）或 npm

### 安装步骤

```bash
# 1. 进入源代码目录
cd source

# 2. 安装依赖
pnpm install
# 或使用 npm：npm install

# 3. 启动开发服务器
pnpm dev
# 或：npm run dev

# 4. 浏览器打开 http://localhost:3000
```

### 修改内容

| 修改目标 | 文件位置 |
|---------|---------|
| 页面文字内容 | `client/src/pages/Home.tsx` |
| 中英文翻译 | `client/src/contexts/LanguageContext.tsx` |
| 全局样式/颜色 | `client/src/index.css` |
| 字体引入 | `client/index.html` |
| 页面标题/SEO | `client/index.html` |

### 重新构建

```bash
cd source
pnpm build
# 构建产物在 dist/public/ 目录
```

## 技术栈

- **React 19** + **TypeScript**
- **Tailwind CSS 4** — 原子化样式
- **Vite 7** — 构建工具
- **Recharts** — 雷达图/数据可视化
- **Lucide React** — 图标库
- **shadcn/ui** — UI 组件库

## 资源文件说明

网站中引用的以下文件存储在 Manus 平台：
- 简历 PDF：`/manus-storage/bill_qian_resume_c40f30d2.pdf`
- 微信二维码：`/manus-storage/wechat_qrcode_860e3e5c.png`
- SMT培训PPT：`/manus-storage/smt_training_5095346e.pptx`
- BGA报告PPT：`/manus-storage/bga_report_b625d137.pptx`
- 设备分析报告PPT：`/manus-storage/smt_equipment_report_fa18316b.pptx`

如需独立部署，请将这些文件放到您的服务器对应路径下，或修改源代码中的引用路径。

## 联系方式

- 邮箱：gang3603326@gmail.com
- LinkedIn：https://www.linkedin.com/in/bill-qian/
