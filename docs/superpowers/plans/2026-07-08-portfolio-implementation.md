# 个人作品集网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 lovegood.cool 的视觉与交互风格，实现房宇航（Kai）的个人作品集静态网站。

**Architecture:** 使用纯静态 HTML/CSS/JS 实现 4 页面网站。首页用 SVG 绘制小猫、五线谱与钢琴，通过 Web Audio API 播放音符，长按琴键触发 CSS clip-path 圆形转场。子页共用同一份 CSS 与导航组件，内容从设计文档填充。

**Tech Stack:** HTML5 / CSS3 (Variables, Flexbox, Grid) / Vanilla JS / SVG / Web Audio API

---

## 文件结构

```
/
├── index.html
├── portfolio.html
├── experience.html
├── about.html
├── css/
│   ├── base.css          # 变量、重置、工具类
│   ├── index.css         # 首页深蓝背景与钢琴布局
│   ├── pages.css         # 子页共享样式
│   └── components.css    # 导航、卡片、时间线
├── js/
│   ├── audio.js          # Web Audio 发声
│   ├── piano.js          # 钢琴交互与长按跳转
│   ├── transitions.js    # circle-reveal 页面转场
│   └── nav.js            # 导航高亮与菜单
└── assets/
    ├── images/           # 项目截图、自画像
    └── audio/            # 可选小猫旋律 MP3
```

---

### Task 1: 项目脚手架与全局样式

**Files:**
- Create: `css/base.css`
- Create: `css/components.css`
- Create: `index.html`
- Create: `portfolio.html`
- Create: `experience.html`
- Create: `about.html`

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p css js assets/images assets/audio
```

- [ ] **Step 2: 编写 `css/base.css`**

```css
:root {
  --bg-dark: #0B1A3A;
  --bg-light: #F5F1E8;
  --text-primary: #1A1A1A;
  --text-muted: #6A6A6A;
  --text-on-dark: #FAF3E8;
  --accent: #2E5C4F;
  --accent-hover: #1F4036;
  --key-white: #FAF3E8;
  --key-black: #0B1A3A;

  --font-serif: 'Playfair Display', serif;
  --font-handwriting: 'Caveat', cursive;
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-reveal: 600ms;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--bg-light);
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--accent-hover);
}

img {
  max-width: 100%;
  display: block;
}
```

- [ ] **Step 3: 编写 `css/components.css` 中的导航组件**

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
}

.nav__brand {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--text-primary);
}

.nav__links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__links a {
  position: relative;
  font-size: 0.9rem;
  color: var(--text-primary);
  padding-bottom: 0.25rem;
}

.nav__links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.nav__links a:hover::after,
.nav__links a.is-active::after {
  width: 100%;
}

.nav--dark .nav__brand,
.nav--dark .nav__links a {
  color: var(--text-on-dark);
}

@media (max-width: 768px) {
  .nav {
    padding: 1rem 1.5rem;
  }
  .nav__links {
    gap: 1rem;
  }
}
```

- [ ] **Step 4: 创建 4 个 HTML 骨架文件**

每个文件头部包含：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>房宇航 / Kai — AI 产品开发者</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat&family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
</head>
```

并在 `<body>` 末尾引入共享脚本：

```html
<script src="js/audio.js"></script>
<script src="js/transitions.js"></script>
<script src="js/nav.js"></script>
```

首页额外引入：

```html
<link rel="stylesheet" href="css/index.css">
<script src="js/piano.js"></script>
```

子页额外引入：

```html
<link rel="stylesheet" href="css/pages.css">
```

- [ ] **Step 5: 提交**

```bash
git add css/base.css css/components.css index.html portfolio.html experience.html about.html
git commit -m "chore: scaffold portfolio site with shared styles and nav"
```

---

### Task 2: 实现首页 SVG 与钢琴交互

**Files:**
- Modify: `index.html`
- Create: `css/index.css`
- Create: `js/piano.js`

- [ ] **Step 1: 在 `index.html` body 中添加首页结构**

```html
<body class="page-home">
  <div class="home__bg"></div>

  <header class="nav nav--dark">
    <a href="index.html" class="nav__brand">Kai</a>
    <nav>
      <ul class="nav__links">
        <li><a href="index.html" class="is-active">首页</a></li>
        <li><a href="portfolio.html" data-transition="portfolio">作品集</a></li>
        <li><a href="experience.html" data-transition="experience">足迹</a></li>
        <li><a href="about.html" data-transition="about">关于我</a></li>
      </ul>
    </nav>
  </header>

  <main class="home">
    <div class="home__staff">
      <svg viewBox="0 0 800 120" class="staff-svg">
        <line x1="0" y1="20" x2="800" y2="20" stroke="#FAF3E8" stroke-width="1" opacity="0.4"/>
        <line x1="0" y1="40" x2="800" y2="40" stroke="#FAF3E8" stroke-width="1" opacity="0.4"/>
        <line x1="0" y1="60" x2="800" y2="60" stroke="#FAF3E8" stroke-width="1" opacity="0.4"/>
        <line x1="0" y1="80" x2="800" y2="80" stroke="#FAF3E8" stroke-width="1" opacity="0.4"/>
        <line x1="0" y1="100" x2="800" y2="100" stroke="#FAF3E8" stroke-width="1" opacity="0.4"/>
      </svg>
      <div class="cat" id="cat" role="button" aria-label="播放旋律">
        <svg viewBox="0 0 80 80" class="cat-svg">
          <!-- 简笔小猫：椭圆身体 + 三角耳朵 + 圆眼睛 -->
          <ellipse cx="40" cy="48" rx="26" ry="22" fill="#FAF3E8"/>
          <polygon points="18,32 24,10 34,28" fill="#FAF3E8"/>
          <polygon points="62,32 56,10 46,28" fill="#FAF3E8"/>
          <circle cx="30" cy="44" r="3" fill="#0B1A3A"/>
          <circle cx="50" cy="44" r="3" fill="#0B1A3A"/>
          <path d="M36,54 Q40,58 44,54" stroke="#0B1A3A" stroke-width="2" fill="none"/>
        </svg>
      </div>
    </div>

    <div class="home__hint">
      <p>点击上方小猫，听一段关于研究与产品的旋律</p>
      <p>长按下方琴键，进入对应篇章</p>
    </div>

    <div class="piano" id="piano">
      <svg viewBox="0 0 900 240" class="piano-svg" id="piano-svg">
        <rect x="0" y="0" width="900" height="240" fill="#0B1A3A" rx="8"/>
        <g class="piano-keys" id="piano-keys"></g>
      </svg>
    </div>
  </main>

  <div class="transition-overlay" id="transition-overlay"></div>

  <script src="js/audio.js"></script>
  <script src="js/piano.js"></script>
  <script src="js/transitions.js"></script>
  <script src="js/nav.js"></script>
</body>
```

- [ ] **Step 2: 编写 `css/index.css`**

```css
.page-home {
  background: var(--bg-dark);
  min-height: 100vh;
  overflow: hidden;
}

.home {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem 2rem 2rem;
}

.home__staff {
  position: relative;
  width: min(800px, 90vw);
  padding-top: 2rem;
}

.staff-svg {
  width: 100%;
  height: auto;
}

.cat {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out-expo);
}

.cat:hover {
  transform: translateX(-50%) scale(1.05);
}

.cat.is-playing {
  animation: cat-bob 0.4s ease-in-out 2;
}

@keyframes cat-bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

.home__hint {
  text-align: center;
  color: var(--text-on-dark);
  opacity: 0.8;
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 2rem 0;
}

.piano {
  width: min(900px, 95vw);
  margin-bottom: 2rem;
}

.piano-svg {
  width: 100%;
  height: auto;
  display: block;
}

.piano-key {
  cursor: pointer;
  transition: transform var(--duration-fast) ease-out, fill var(--duration-fast) ease-out;
}

.piano-key:hover {
  fill: #fff8ed;
}

.piano-key.is-pressed {
  transform: translateY(8px);
}

.piano-key-label {
  pointer-events: none;
  font-family: var(--font-sans);
  font-size: 14px;
  fill: var(--text-primary);
  text-anchor: middle;
}

.piano-key-label--sub {
  font-size: 10px;
  fill: var(--text-muted);
}

.transition-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-light);
  clip-path: circle(0% at 50% 50%);
  pointer-events: none;
  z-index: 200;
}

.transition-overlay.is-active {
  clip-path: circle(150% at 50% 50%);
  transition: clip-path var(--duration-reveal) var(--ease-out-expo);
}

@media (max-width: 768px) {
  .home {
    padding-top: 5rem;
  }
  .home__hint {
    font-size: 0.85rem;
  }
}
```

- [ ] **Step 3: 编写 `js/piano.js`**

```javascript
(function () {
  const targets = [
    { label: '作品集', sub: 'Portfolio', href: 'portfolio.html' },
    { label: '足迹', sub: 'Experience', href: 'experience.html' },
    { label: '关于我', sub: 'About', href: 'about.html' }
  ];

  const svg = document.getElementById('piano-keys');
  const overlay = document.getElementById('transition-overlay');
  const pianoContainer = document.getElementById('piano');

  if (!svg) return;

  const totalWidth = 860;
  const startX = 20;
  const keyWidth = totalWidth / targets.length;
  const keyHeight = 200;
  const y = 20;

  targets.forEach((target, index) => {
    const x = startX + index * keyWidth;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'piano-key');
    group.setAttribute('data-href', target.href);
    group.setAttribute('data-note', 261.63 + index * 50);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x + 4);
    rect.setAttribute('y', y);
    rect.setAttribute('width', keyWidth - 8);
    rect.setAttribute('height', keyHeight);
    rect.setAttribute('rx', 6);
    rect.setAttribute('fill', '#FAF3E8');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + keyWidth / 2);
    text.setAttribute('y', y + keyHeight - 48);
    text.setAttribute('class', 'piano-key-label');
    text.textContent = target.label;

    const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sub.setAttribute('x', x + keyWidth / 2);
    sub.setAttribute('y', y + keyHeight - 28);
    sub.setAttribute('class', 'piano-key-label piano-key-label--sub');
    sub.textContent = target.sub;

    group.appendChild(rect);
    group.appendChild(text);
    group.appendChild(sub);
    svg.appendChild(group);

    let pressTimer = null;
    let isPressed = false;

    const startPress = (e) => {
      isPressed = true;
      group.classList.add('is-pressed');
      const freq = parseFloat(group.dataset.note);
      window.playTone(freq, 0.15);

      pressTimer = setTimeout(() => {
        const href = group.dataset.href;
        const rect = group.getBoundingClientRect();
        const containerRect = pianoContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        window.revealTransition(cx, cy, href);
      }, 800);
    };

    const cancelPress = () => {
      if (!isPressed) return;
      isPressed = false;
      group.classList.remove('is-pressed');
      clearTimeout(pressTimer);
    };

    group.addEventListener('mousedown', startPress);
    group.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startPress(e);
    });
    group.addEventListener('mouseleave', cancelPress);
    group.addEventListener('mouseup', cancelPress);
    group.addEventListener('touchend', cancelPress);
  });
})();
```

- [ ] **Step 4: 本地预览首页**

打开 `index.html`，验证：
- 深蓝背景、五线谱、小猫、三个琴键正常显示
- hover 琴键时下沉并发声
- 长按琴键 800ms 后触发圆形转场并跳转

- [ ] **Step 5: 提交**

```bash
git add css/index.css js/piano.js index.html
git commit -m "feat: implement homepage piano interaction and circle-reveal transition"
```

---

### Task 3: 实现音频模块

**Files:**
- Create: `js/audio.js`

- [ ] **Step 1: 编写 `js/audio.js`**

```javascript
(function () {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let ctx = null;

  function ensureContext() {
    if (!ctx) {
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  window.playTone = function (frequency, duration = 0.15, type = 'triangle') {
    ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  };

  window.playMelody = function () {
    ensureContext();
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66];
    notes.forEach((freq, i) => {
      setTimeout(() => window.playTone(freq, 0.18), i * 220);
    });
  };
})();
```

- [ ] **Step 2: 在 `js/piano.js` 中绑定小猫点击播放旋律**

确认首页小猫元素 `id="cat"`，并添加：

```javascript
document.getElementById('cat').addEventListener('click', () => {
  const cat = document.getElementById('cat');
  cat.classList.add('is-playing');
  window.playMelody();
  setTimeout(() => cat.classList.remove('is-playing'), 1000);
});
```

- [ ] **Step 3: 验证**

刷新首页，点击小猫，应听到一段上行旋律。

- [ ] **Step 4: 提交**

```bash
git add js/audio.js js/piano.js
git commit -m "feat: add web audio tone and melody playback"
```

---

### Task 4: 实现页面转场模块

**Files:**
- Create: `js/transitions.js`

- [ ] **Step 1: 编写 `js/transitions.js`**

```javascript
(function () {
  window.revealTransition = function (originX, originY, href) {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay || !href) return;

    overlay.style.clipPath = `circle(0% at ${originX}px ${originY}px)`;
    overlay.classList.add('is-active');

    setTimeout(() => {
      window.location.href = href;
    }, 550);
  };

  document.querySelectorAll('a[data-transition]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      window.revealTransition(cx, cy, href);
    });
  });
})();
```

- [ ] **Step 2: 提交**

```bash
git add js/transitions.js
git commit -m "feat: add circle-reveal page transition"
```

---

### Task 5: 实现子页共享样式

**Files:**
- Create: `css/pages.css`

- [ ] **Step 1: 编写 `css/pages.css`**

```css
.page {
  min-height: 100vh;
  background: var(--bg-light);
  padding-top: 6rem;
  padding-bottom: 4rem;
}

.page__container {
  width: min(1000px, 90vw);
  margin: 0 auto;
}

.page__title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.page__subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
  max-width: 600px;
}

.section {
  margin-bottom: 4rem;
}

.fade-in {
  opacity: 0;
  transform: translateY(24px);
  animation: fade-in-up 0.6s var(--ease-out-expo) forwards;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .page {
    padding-top: 5rem;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add css/pages.css
git commit -m "feat: add shared page layout styles"
```

---

### Task 6: 实现作品集页

**Files:**
- Modify: `portfolio.html`
- Create: `css/pages.css`（继续追加，本任务只新增项目卡片样式）

- [ ] **Step 1: 更新 `portfolio.html` body**

```html
<body class="page">
  <header class="nav">
    <a href="index.html" class="nav__brand">Kai</a>
    <nav>
      <ul class="nav__links">
        <li><a href="index.html">首页</a></li>
        <li><a href="portfolio.html" class="is-active">作品集</a></li>
        <li><a href="experience.html">足迹</a></li>
        <li><a href="about.html">关于我</a></li>
      </ul>
    </nav>
  </header>

  <main class="page__container fade-in">
    <h1 class="page__title">作品集</h1>
    <p class="page__subtitle">AI 产品、可审计研究与教育科技的实践记录。</p>

    <article class="project project--reverse">
      <div class="project__media">
        <img src="assets/images/research-os.png" alt="Research OS Dashboard" class="project__image">
      </div>
      <div class="project__content">
        <h2 class="project__title">深度调研系统 / Research OS</h2>
        <div class="project__tags">
          <span class="tag">Python</span>
          <span class="tag">状态机</span>
          <span class="tag">Validator</span>
          <span class="tag">可审计研究</span>
        </div>
        <p class="project__desc">自建可审计研究操作系统，用状态机驱动 route → plan → collect → evidence → hypothesize → red_team → report 的完整流程。每个强结论必须回链到假设与证据，否则 validator 报 FAIL。已应用于南芥智能等真实研究项目。</p>
        <a href="https://providence-f.github.io/research-os/" target="_blank" rel="noopener" class="project__link">打开看板 →</a>
      </div>
    </article>

    <article class="project">
      <div class="project__media">
        <img src="assets/images/knowledge-tarot.png" alt="知识塔罗界面" class="project__image">
      </div>
      <div class="project__content">
        <h2 class="project__title">知识塔罗</h2>
        <div class="project__tags">
          <span class="tag">Express</span>
          <span class="tag">DeepSeek API</span>
          <span class="tag">腾讯云</span>
          <span class="tag">AI 对话</span>
        </div>
        <p class="project__desc">AI 驱动的自我对话工具。把用户写过的内容切成牌堆，带着当下问题抽牌并由 AI 解读。支持日签 / 三牌阵、多 deck 架构、分享克隆与多源 importer。v1.1 已上线并完成老用户迁移。</p>
        <a href="http://110.40.140.131:8080" target="_blank" rel="noopener" class="project__link">访问产品 →</a>
      </div>
    </article>

    <article class="project project--reverse">
      <div class="project__media project__media--empty">
        <span class="project__placeholder">森林精灵萤火虫科普展会</span>
      </div>
      <div class="project__content">
        <h2 class="project__title">森林精灵萤火虫科普展会</h2>
        <div class="project__tags">
          <span class="tag">项目管理</span>
          <span class="tag">科普策展</span>
          <span class="tag">抖音运营</span>
        </div>
        <p class="project__desc">独立负责 350㎡ 科普展会全链路，包括 7 大板块内容架构、物料管理、讲解/检票团队 SOP、跨职能设计师协调与日复盘。展会抖音热度排名第二，辐射 1 万+ 用户。</p>
      </div>
    </article>
  </main>

  <script src="js/audio.js"></script>
  <script src="js/transitions.js"></script>
  <script src="js/nav.js"></script>
</body>
```

- [ ] **Step 2: 在 `css/pages.css` 追加项目卡片样式**

```css
.project {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 5rem;
}

.project--reverse {
  direction: rtl;
}

.project--reverse > * {
  direction: ltr;
}

.project__media {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}

.project__media:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.project__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  transition: transform var(--duration-normal) var(--ease-out-expo);
}

.project__media:hover .project__image {
  transform: scale(1.02);
}

.project__media--empty {
  aspect-ratio: 16 / 10;
  background: #ede8dd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project__placeholder {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
}

.project__title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  margin: 0 0 0.75rem;
}

.project__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--text-muted);
  color: var(--text-muted);
  border-radius: 999px;
}

.project__desc {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 1.25rem;
}

.project__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: gap var(--duration-fast) var(--ease-out-expo);
}

.project__link:hover {
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .project,
  .project--reverse {
    grid-template-columns: 1fr;
    direction: ltr;
  }
  .project--reverse > * {
    direction: ltr;
  }
  .project__media {
    order: -1;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add portfolio.html css/pages.css
git commit -m "feat: implement portfolio page with project cards"
```

---

### Task 7: 实现足迹页

**Files:**
- Modify: `experience.html`
- Modify: `css/pages.css`

- [ ] **Step 1: 更新 `experience.html` body**

```html
<body class="page">
  <header class="nav">
    <a href="index.html" class="nav__brand">Kai</a>
    <nav>
      <ul class="nav__links">
        <li><a href="index.html">首页</a></li>
        <li><a href="portfolio.html">作品集</a></li>
        <li><a href="experience.html" class="is-active">足迹</a></li>
        <li><a href="about.html">关于我</a></li>
      </ul>
    </nav>
  </header>

  <main class="page__container fade-in">
    <h1 class="page__title">足迹</h1>
    <p class="page__subtitle">教育、实习与项目经历的时间线。</p>

    <div class="timeline">
      <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content">
          <span class="timeline__date">2023 — 2027（预计）</span>
          <h3 class="timeline__title">南京信息工程大学 · 本科 · 物理学（师范）</h3>
          <p class="timeline__desc">核心课程：量子力学、电动力学、固体物理、热力学与统计物理、数学物理方程、普通物理。</p>
        </div>
      </div>

      <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content">
          <span class="timeline__date">2026.06</span>
          <h3 class="timeline__title">南京南芥智能科技有限公司 · 商业研究实习（AI Agent 方向）</h3>
          <p class="timeline__desc">调研中国 AI 创业公司，输出 6 份深度调研报告，全部通过 Research OS 完成。</p>
        </div>
      </div>

      <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content">
          <span class="timeline__date">2025 暑期</span>
          <h3 class="timeline__title">成都好奇教育科技有限公司（好奇学习社区）· 心理疗愈师</h3>
          <p class="timeline__desc">一对一心理疏导与访谈，整理结构化来访档案，参与社群运营与需求洞察。</p>
        </div>
      </div>

      <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content">
          <span class="timeline__date">2023</span>
          <h3 class="timeline__title">南京少年德志网络科技有限公司 · 项目经理 · 森林精灵萤火虫展会</h3>
          <p class="timeline__desc">350㎡ 展会全链路管理，7 大板块内容架构，讲解/检票团队 SOP，跨职能设计师协调。抖音热度第二，辐射 1 万+ 用户。</p>
        </div>
      </div>

      <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content">
          <span class="timeline__date">其他</span>
          <h3 class="timeline__title">多元实践经历</h3>
          <p class="timeline__desc">南京寰宇教育 / 松鼠 AI / 青职云 · 线上电话销售审核组长；自然研学机构主教；物理教培兼职教师。</p>
        </div>
      </div>
    </div>
  </main>

  <script src="js/audio.js"></script>
  <script src="js/transitions.js"></script>
  <script src="js/nav.js"></script>
</body>
```

- [ ] **Step 2: 在 `css/pages.css` 追加时间线样式**

```css
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--text-muted);
  opacity: 0.3;
}

.timeline__item {
  position: relative;
  padding-bottom: 3rem;
}

.timeline__marker {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--bg-light);
  border: 2px solid var(--accent);
}

.timeline__date {
  font-family: var(--font-handwriting);
  font-size: 1.1rem;
  color: var(--accent);
}

.timeline__title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  margin: 0.25rem 0 0.5rem;
}

.timeline__desc {
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 768px) {
  .timeline {
    padding-left: 1.5rem;
  }
  .timeline__marker {
    left: -1.5rem;
    width: 11px;
    height: 11px;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add experience.html css/pages.css
git commit -m "feat: implement experience timeline page"
```

---

### Task 8: 实现关于我页

**Files:**
- Modify: `about.html`
- Modify: `css/pages.css`

- [ ] **Step 1: 更新 `about.html` body**

```html
<body class="page">
  <header class="nav">
    <a href="index.html" class="nav__brand">Kai</a>
    <nav>
      <ul class="nav__links">
        <li><a href="index.html">首页</a></li>
        <li><a href="portfolio.html">作品集</a></li>
        <li><a href="experience.html">足迹</a></li>
        <li><a href="about.html" class="is-active">关于我</a></li>
      </ul>
    </nav>
  </header>

  <main class="page__container fade-in">
    <div class="about">
      <div class="about__portrait">
        <img src="assets/images/portrait.png" alt="房宇航自画像" class="about__image">
      </div>
      <div class="about__content">
        <h1 class="page__title">关于我</h1>
        <div class="about__bio">
          <p><strong>房宇航 / Kai</strong></p>
          <p>物理学师范背景，正在向 AI 产品开发者转型。</p>
          <p>我相信好的 AI 产品不是功能的堆砌，而是对人真实需求的回应。所以同时做两件事：一边用 Research OS 把调研过程变得可审计、可复用；一边用知识塔罗帮人把模糊的自我叙事，转化成可对话的牌面。</p>
          <p>长期目标是经营一人公司，也在关注 AWS Top20 与 MizzenAI 等机会。</p>
          <p>如果你也对 AI 产品、可审计研究或教育科技感兴趣，欢迎联系我。</p>
        </div>
        <div class="about__contact">
          <a href="tel:18951391402" class="contact-link">电话：18951391402</a>
          <a href="mailto:3166831387@qq.com" class="contact-link">邮箱：3166831387@qq.com</a>
        </div>
      </div>
    </div>
  </main>

  <script src="js/audio.js"></script>
  <script src="js/transitions.js"></script>
  <script src="js/nav.js"></script>
</body>
```

- [ ] **Step 2: 在 `css/pages.css` 追加关于我样式**

```css
.about {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;
}

.about__portrait {
  position: sticky;
  top: 7rem;
}

.about__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;
  background: #ede8dd;
}

.about__bio {
  color: var(--text-muted);
  line-height: 1.9;
  font-size: 1.05rem;
}

.about__bio p {
  margin-bottom: 1rem;
}

.about__bio strong {
  color: var(--text-primary);
  font-size: 1.25rem;
}

.about__contact {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.contact-link {
  font-weight: 500;
}

@media (max-width: 768px) {
  .about {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .about__portrait {
    position: static;
    max-width: 280px;
    margin: 0 auto;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add about.html css/pages.css
git commit -m "feat: implement about page with portrait and contact"
```

---

### Task 9: 导航高亮与菜单

**Files:**
- Create: `js/nav.js`

- [ ] **Step 1: 编写 `js/nav.js`**

```javascript
(function () {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
})();
```

- [ ] **Step 2: 提交**

```bash
git add js/nav.js
git commit -m "feat: highlight active nav link"
```

---

### Task 10: 获取项目截图

**Files:**
- Create: `assets/images/research-os.png`
- Create: `assets/images/knowledge-tarot.png`
- Create: `assets/images/portrait.png`（用户后续提供）

- [ ] **Step 1: 截取 Research OS Dashboard**

使用浏览器访问 https://providence-f.github.io/research-os/，截取首页/看板区域，保存为 `assets/images/research-os.png`。

- [ ] **Step 2: 截取知识塔罗界面**

访问 http://110.40.140.131:8080，截取产品主界面，保存为 `assets/images/knowledge-tarot.png`。

- [ ] **Step 3: 提交**

```bash
git add assets/images/research-os.png assets/images/knowledge-tarot.png
git commit -m "assets: add project screenshots"
```

---

### Task 11: 响应式与细节打磨

**Files:**
- Modify: `css/base.css`
- Modify: `css/index.css`
- Modify: `css/pages.css`
- Modify: `js/piano.js`

- [ ] **Step 1: 检查并修复移动端问题**

确保：
- 导航在 768px 以下不折行或正确换行
- 首页小猫和钢琴在手机上居中且不超出视口
- 琴键 touch 长按触发跳转
- 子页图文布局在手机上堆叠

- [ ] **Step 2: 添加 `prefers-reduced-motion` 支持**

在 `css/base.css` 末尾追加：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add css/base.css css/index.css css/pages.css js/piano.js
git commit -m "fix: responsive layout and reduced motion support"
```

---

### Task 12: 本地预览与验收

- [ ] **Step 1: 启动本地服务器**

```bash
python -m http.server 8080
```

或使用 VS Code Live Server 插件。

- [ ] **Step 2: 验收清单**

- [ ] 首页深蓝背景、五线谱、小猫、三个琴键正常显示
- [ ] 点击小猫播放旋律
- [ ] hover 琴键下沉并发声
- [ ] 长按琴键 800ms 触发 circle-reveal 并跳转
- [ ] 子页米色背景、导航高亮正确
- [ ] 作品集三个项目图文正确，链接可点击
- [ ] 足迹时间线内容正确
- [ ] 关于我文案与联系方式正确
- [ ] 桌面 / 平板 / 手机三端布局正常
- [ ] Lighthouse 性能分数 >= 80

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "release: portfolio site v1.0"
```

---

## Spec 覆盖检查

| 设计文档章节 | 实现任务 |
|--------------|----------|
| 首页视觉与钢琴交互 | Task 2 |
| 小猫点击音频 | Task 3 |
| circle-reveal 转场 | Task 4 |
| 子页共享布局 | Task 5 |
| 作品集内容与排版 | Task 6 |
| 足迹时间线 | Task 7 |
| 关于我与联系方式 | Task 8 |
| 设计 Token | Task 1（base.css） |
| 响应式 | Task 11 |
| 项目截图 | Task 10 |

无遗漏。

## Placeholder 扫描

计划内所有代码块均包含可直接运行的内容，无 TBD/TODO/实现 later 等占位符。
