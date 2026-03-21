
// ── Dark Mode ──
const darkToggle = document.getElementById('darkToggle');
const body = document.body;
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  if (darkToggle) darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// ── Mobile Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.innerHTML = mobileNav.classList.contains('open')
      ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
}

// ── Toast Notification ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Progress Tracking (mark lessons done) ──
function initProgress() {
  document.querySelectorAll('.mark-done-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (localStorage.getItem('done_' + id)) {
      btn.classList.add('done');
      btn.textContent = '✅ مكتمل';
      const link = document.querySelector('.sidebar-nav a[href="#' + id + '"]');
      if (link) link.classList.add('done');
    }
    btn.addEventListener('click', () => {
      const isDone = btn.classList.toggle('done');
      localStorage.setItem('done_' + id, isDone ? '1' : '');
      btn.textContent = isDone ? '✅ مكتمل' : 'وضع علامة مكتمل';
      const link = document.querySelector('.sidebar-nav a[href="#' + id + '"]');
      if (link) link.classList.toggle('done', isDone);
      if (isDone) showToast('✅ تم حفظ تقدمك في هذا الفصل!');
    });
  });
}
document.addEventListener('DOMContentLoaded', initProgress);

// ── Sidebar active on scroll ──
const sections = document.querySelectorAll('.lesson-box');
const sideLinks = document.querySelectorAll('.sidebar-nav a');
if (sections.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 110) current = sec.id; });
    sideLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

// ── Animate stats counter ──
function animateCounters() {
  document.querySelectorAll('.stat h2[data-target]').forEach(el => {
    const target = +el.dataset.target, suffix = el.dataset.suffix || '';
    let count = 0, step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + suffix;
      if (count >= target) clearInterval(timer);
    }, 30);
  });
}
const statsEl = document.querySelector('.stats');
if (statsEl) {
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { animateCounters(); obs.disconnect(); } }, { threshold: .3 });
  obs.observe(statsEl);
}

// ── Update home progress bars ──
function updateHomeProgress() {
  const chapters = ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10','ch11','ch12'];
  const done = chapters.filter(c => localStorage.getItem('done_' + c)).length;
  const pct = Math.round((done / chapters.length) * 100);
  const fill = document.getElementById('mainProgressFill');
  const label = document.getElementById('mainProgressLabel');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
}
document.addEventListener('DOMContentLoaded', updateHomeProgress);
