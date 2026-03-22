
// ─── وضع ليلي ───
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

// ─── تمييز الفصل المقروء في الشريط الجانبي ───
const sections = document.querySelectorAll('.lesson-box');
const sideLinks = document.querySelectorAll('.sidebar-nav a');
const readLessons = JSON.parse(localStorage.getItem('readLessons') || '[]');

// علّم الفصول المقروءة سابقاً
sideLinks.forEach(link => {
  const id = link.getAttribute('href')?.replace('#', '');
  if (readLessons.includes(id)) {
    link.style.opacity = '1';
    link.innerHTML = link.innerHTML.replace('fas fa-circle-dot', 'fas fa-check-circle');
  }
});

// تتبع التمرير والتمييز
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  sideLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
      if (current && !readLessons.includes(current)) {
        readLessons.push(current);
        localStorage.setItem('readLessons', JSON.stringify(readLessons));
        link.innerHTML = link.innerHTML.replace('fas fa-circle-dot', 'fas fa-check-circle');
      }
    }
  });
});

// ─── إغلاق القائمة عند النقر على رابط (جوال) ───
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.remove('open');
  });
});

// ─── Hamburger Menu ───
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });
  // إغلاق عند الضغط خارج القائمة
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}
