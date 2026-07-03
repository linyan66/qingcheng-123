const screen = document.getElementById("screen");
const navButtons = Array.from(document.querySelectorAll(".nav-item"));
const overlay = document.getElementById("overlay");
const sheet = document.getElementById("sheet");
const dialog = document.getElementById("dialog");
const toast = document.getElementById("toast");

let currentRoute = "home";
let toastTimer = null;

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v8.5h11V10"/><path d="M10 18.5v-5h4v5"/></svg>',
  focus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M8 14h8"/></svg>',
  trip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 0-6h2a3 3 0 0 0 3-3V8"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 7 1.5 1.5L9 6M12 7h7M5 13l1.5 1.5L9 12M12 13h7M6 19h.01M12 19h7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 12 3 3 7-7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 3"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 0-6h2a3 3 0 0 0 3-3V8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2 7.5 14 3 9.6l6.2-.9z"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 19 7v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7z"/><path d="m9 12 2 2 4-5"/></svg>',
  growth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V9"/><path d="M12 13c-4 0-6-2-7-6 4 0 6 2 7 6z"/><path d="M12 11c3.5 0 5.5-1.7 6.5-5"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M4.8 6.2 7 8.3M17 15.7l2.2 2.1M4.8 17.8 7 15.7M17 8.3l2.2-2.1"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m7 7 10 10M17 7 7 17"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6v12M15 6v12"/></svg>'
};

function icon(name) {
  return icons[name] || icons.focus;
}

function setInlineIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = icon(node.dataset.icon);
  });
}

function activateNav(route) {
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.route === route);
  });
}

function render(route) {
  currentRoute = route;
  closeLayer();
  activateNav(baseRoute(route));
  screen.classList.remove("screen-enter");
  void screen.offsetWidth;
  screen.innerHTML = views[route]();
  screen.classList.add("screen-enter");
  setInlineIcons(screen);
}

function baseRoute(route) {
  if (route.startsWith("focus")) return "focus";
  return route;
}

function closeLayer() {
  overlay.classList.remove("show");
  sheet.classList.remove("show");
  dialog.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  sheet.innerHTML = "";
  dialog.innerHTML = "";
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function showSheet(kind) {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  sheet.innerHTML = sheets[kind]();
  setInlineIcons(sheet);
  requestAnimationFrame(() => sheet.classList.add("show"));
}

function showDialog(kind) {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  dialog.innerHTML = dialogs[kind]();
  setInlineIcons(dialog);
  requestAnimationFrame(() => dialog.classList.add("show"));
}

const views = {
  home: () => `
    <header class="page-header">
      <div class="title-block">
        <h2>早上好，A</h2>
        <p>今天也慢慢靠近更好的自己</p>
      </div>
      <div class="avatar">青</div>
    </header>

    <section class="card overview soft-card">
      <div class="label">今日专注</div>
      <div class="big-number">2h 30m</div>
      <div class="muted">本周任务完成率 78%</div>
      <div class="progress-track"><div class="progress-fill"></div></div>
    </section>

    <div class="section-title"><h3>快捷入口</h3></div>
    <div class="quick-grid">
      <button class="quick-action" type="button" data-action="go-focus">
        <div class="icon" data-icon="focus"></div><span>开始专注</span>
      </button>
      <button class="quick-action" type="button" data-action="add-task">
        <div class="icon" data-icon="add"></div><span>添加任务</span>
      </button>
      <button class="quick-action" type="button" data-action="go-trip">
        <div class="icon" data-icon="trip"></div><span>查看行程</span>
      </button>
    </div>

    <div class="section-title"><h3>今日课程</h3><span>全部</span></div>
    ${courseRow("08:30", "高等数学")}
    ${courseRow("10:20", "专业设计课")}
    ${courseRow("14:00", "大学英语")}

    <div class="section-title"><h3>今日任务</h3></div>
    ${taskRow("完成 UI 设计草图")}
    ${taskRow("整理课程笔记")}
    ${taskRow("复盘今日专注", true)}
  `,

  focus: () => focusView("专注模式", "专注一小段，成长一大步", "25:00", "准备开始", "开始专注", "start-focus"),
  focusRunning: () => focusView("专注中", "把注意力留给眼前这一段", "18:42", "保持专注，慢慢进入状态", null, null, "running"),
  focusPaused: () => focusView("已暂停", "休息一下，再轻轻回来", "18:42", "休息一下也没关系", null, null, "paused"),

  plan: () => `
    <header class="page-header">
      <div class="title-block">
        <h2>今日计划</h2>
        <p>把任务放进时间里，而不是堆在脑子里</p>
      </div>
    </header>
    <div class="date-strip">
      ${["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, index) => `<div class="date-chip ${index === 2 ? "active" : ""}"><span>${day}</span><strong>${8 + index}</strong></div>`).join("")}
    </div>
    <div class="tag-strip">
      ${["全部", "学习", "生活", "紧急"].map((tag, index) => `<button class="tag ${index === 0 ? "active" : ""}" type="button">${tag}</button>`).join("")}
    </div>
    <div class="section-title"><h3>今日时间轴</h3></div>
    <div class="timeline">
      ${timelineItem("08:30", "高等数学", "学习")}
      ${timelineItem("10:20", "专业设计课", "学习")}
      ${timelineItem("14:00", "小组作业", "紧急")}
      ${timelineItem("19:30", "自习计划", "学习")}
      ${timelineItem("22:00", "今日复盘", "生活")}
    </div>
    <button class="fab" type="button" data-action="add-task" aria-label="添加任务">${icon("add")}</button>
  `,

  trip: () => `
    <header class="page-header">
      <div class="title-block">
        <h2>行程策划</h2>
        <p>学习之外，也要好好安排生活</p>
      </div>
    </header>
    <section class="card trip-overview blue-card">
      <div class="icon" data-icon="trip"></div>
      <div>
        <div class="label">本周行程概览</div>
        <strong>本周 3 个计划</strong>
        <p class="muted">预计用时 5h 20m</p>
      </div>
    </section>
    <button class="row-card card" type="button" data-action="trip-detail">
      <span class="icon" data-icon="calendar"></span>
      <span><strong>周末图书馆计划</strong><br><span class="muted">复习专业课 + 整理设计素材 · 预计 2h 30m</span></span>
    </button>
    <button class="row-card card blue-card" type="button" data-action="trip-detail">
      <span class="icon" data-icon="route"></span>
      <span><strong>宿舍 → 教学楼 → 图书馆</strong><br><span class="muted">步行约 12 分钟</span><span class="route-line"></span></span>
    </button>
    <div class="section-title"><h3>活动计划</h3></div>
    ${activityRow("社团讨论会", "growth")}
    ${activityRow("操场夜跑", "route")}
    ${activityRow("周末作品集整理", "task")}
  `,

  profile: () => `
    <section class="profile-head">
      <div class="profile-avatar">A</div>
      <div>
        <h2>A</h2>
        <p class="muted">视觉传达设计</p>
      </div>
      <span class="state-pill">学习中</span>
    </section>
    <section class="card goals">
      <div class="section-title" style="margin-top:0"><h3>成长数据</h3></div>
      <div class="stats-grid">
        ${stat("36h", "总专注")}
        ${stat("128", "完成任务")}
        ${stat("7 天", "连续打卡")}
      </div>
    </section>
    <div class="section-title"><h3>成就徽章</h3></div>
    <div class="badge-grid">
      ${badge("专注新星", "star", "badge-detail")}
      ${badge("计划达人", "badge")}
      ${badge("连续打卡", "growth")}
    </div>
    <div class="section-title"><h3>未来目标</h3></div>
    <section class="card goals">
      ${goalLine("本周完成 UI 设计方案")}
      ${goalLine("本月整理作品集")}
      ${goalLine("期末前完成课程复盘")}
    </section>
    <div class="section-title"><h3>设置入口</h3></div>
    <section class="card settings">
      ${settingLine("个人资料", "profile")}
      ${settingLine("通知设置", "clock")}
      ${settingLine("专注偏好", "focus")}
      ${settingLine("数据导出", "growth")}
    </section>
  `
};

function focusView(title, subtitle, time, state, buttonLabel, action, mode = "ready") {
  const paused = mode === "paused";
  const running = mode === "running";
  return `
    <header class="page-header">
      <div class="title-block">
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
    </header>
    <div class="timer-wrap">
      <div class="timer-ring ${paused ? "paused" : ""}">
        <div>
          <div class="timer-time">${time}</div>
          <div class="timer-state">${state}</div>
        </div>
      </div>
    </div>
    ${
      buttonLabel
        ? `<button class="primary-btn" type="button" data-action="${action}" style="width:218px;margin:8px auto 0;display:block">${buttonLabel}</button>`
        : running
          ? `<div class="button-row"><button class="primary-btn" data-action="pause-focus" type="button">暂停</button><button class="secondary-btn" data-action="end-focus" type="button">结束</button></div>`
          : `<div class="button-row"><button class="primary-btn" data-action="resume-focus" type="button">继续专注</button><button class="secondary-btn" data-action="end-focus" type="button">结束本次</button></div>`
    }
    <section class="card task-summary">
      <div class="icon-shell" data-icon="task"></div>
      <div>
        <p>当前任务</p>
        <h3>UI 首页结构优化</h3>
      </div>
    </section>
    <div class="section-title"><h3>${running || paused ? "本次专注状态" : "今日专注统计"}</h3></div>
    <div class="stats-grid">
      ${stat(running || paused ? "18m" : "2 次", running || paused ? "剩余时间" : "今日专注")}
      ${stat(running || paused ? "86" : "50 分钟", running || paused ? "能量值" : "累计时长")}
      ${stat(running || paused ? "短休" : "7 天", running || paused ? "下次休息" : "连续专注")}
    </div>
  `;
}

function courseRow(time, title) {
  return `<div class="row-card"><span class="time">${time}</span><span>${title}</span><span style="margin-left:auto;color:var(--secondary)" data-icon="calendar"></span></div>`;
}

function taskRow(title, done = false) {
  return `<div class="row-card"><span class="check-dot ${done ? "done" : ""}">${done ? icon("check") : ""}</span><span>${title}</span></div>`;
}

function timelineItem(time, title, tag) {
  return `<button class="timeline-item" type="button" data-action="task-detail"><span class="timeline-time">${time}</span><span class="timeline-title">${title}</span><br><span class="mini-tag">${tag}</span></button>`;
}

function activityRow(title, iconName) {
  return `<div class="row-card"><span class="icon" data-icon="${iconName}"></span><span>${title}</span></div>`;
}

function stat(value, label) {
  return `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`;
}

function badge(title, iconName, action = "") {
  return `<button class="badge-card" type="button" ${action ? `data-action="${action}"` : ""}><div class="icon" data-icon="${iconName}"></div><strong>${title}</strong></button>`;
}

function goalLine(text) {
  return `<div class="goal-line">${icon("growth")}<span>${text}</span></div>`;
}

function settingLine(text, iconName) {
  return `<div class="setting-line"><span data-icon="${iconName}"></span><span>${text}</span></div>`;
}

const sheets = {
  addTask: () => `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h3>添加新任务</h3>
      <button class="icon-btn" type="button" data-action="close-layer">${icon("close")}</button>
    </div>
    <div class="form-field"><label>任务名称</label><div class="fake-input">完成交互原型整理</div></div>
    <div class="form-field"><label>类型</label><div class="fake-input">学习 / 生活 / 紧急</div></div>
    <div class="form-field"><label>时间</label><div class="fake-input">今天 19:30</div></div>
    <div class="button-row">
      <button class="ghost-btn" type="button" data-action="close-layer">取消</button>
      <button class="primary-btn" type="button" data-action="save-task">保存</button>
    </div>
  `,
  taskDetail: () => `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h3>UI 设计草图</h3>
      <button class="icon-btn" type="button" data-action="close-layer">${icon("close")}</button>
    </div>
    <div class="detail-list">
      <div class="detail-line"><span>类型</span><strong>学习任务</strong></div>
      <div class="detail-line"><span>时间</span><strong>今天 19:30</strong></div>
      <div class="detail-line"><span>状态</span><strong>进行中</strong></div>
    </div>
    <p class="muted">整理首页结构与组件布局</p>
    <div class="button-row">
      <button class="primary-btn" type="button" data-action="complete-task">标记完成</button>
      <button class="secondary-btn" type="button" data-action="close-layer">编辑任务</button>
    </div>
  `,
  tripDetail: () => `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h3>周末图书馆计划</h3>
      <button class="icon-btn" type="button" data-action="close-layer">${icon("close")}</button>
    </div>
    <div class="detail-list">
      <div class="detail-line"><span>路线</span><strong>宿舍 → 教学楼 → 图书馆</strong></div>
      <div class="detail-line"><span>预计用时</span><strong>2h 30m</strong></div>
      <div class="detail-line"><span>步行时间</span><strong>12 分钟</strong></div>
    </div>
    <div class="card blue-card" style="padding:14px 16px;box-shadow:none">
      <strong>计划内容</strong>
      <p class="muted">复习专业课 · 整理设计素材 · 完成作品集页面</p>
    </div>
    <div class="button-row">
      <button class="primary-btn" type="button" data-action="close-layer">开始行程</button>
      <button class="secondary-btn" type="button" data-action="close-layer">关闭</button>
    </div>
  `
};

const dialogs = {
  badgeDetail: () => `
    <article class="dialog-card">
      <div class="dialog-icon" data-icon="star"></div>
      <h3>专注新星</h3>
      <p>连续完成 7 天专注任务</p>
      <p><strong>本周累计专注 8h 20m</strong></p>
      <button class="primary-btn" type="button" data-action="close-layer" style="width:100%">知道了</button>
    </article>
  `
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-route]");
  if (!target) return;
  const route = target.dataset.route;
  const action = target.dataset.action;

  if (route) render(route);
  if (action === "go-focus") render("focus");
  if (action === "go-trip") render("trip");
  if (action === "start-focus") render("focusRunning");
  if (action === "pause-focus") render("focusPaused");
  if (action === "resume-focus") render("focusRunning");
  if (action === "end-focus") render("focus");
  if (action === "add-task") showSheet("addTask");
  if (action === "task-detail") showSheet("taskDetail");
  if (action === "trip-detail") showSheet("tripDetail");
  if (action === "badge-detail") showDialog("badgeDetail");
  if (action === "close-layer") closeLayer();
  if (action === "save-task") {
    closeLayer();
    if (baseRoute(currentRoute) !== "plan") render("plan");
    showToast("已保存任务");
  }
  if (action === "complete-task") {
    closeLayer();
    showToast("已标记完成");
  }
});

overlay.addEventListener("click", closeLayer);

setInlineIcons(document);
render("home");
