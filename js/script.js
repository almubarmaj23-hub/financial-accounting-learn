
/* ════════════════════════════════
   Main Script — تعلم المحاسبة
════════════════════════════════ */

// ── Dark Mode ────────────────────
const darkToggle = document.getElementById('darkToggle');
const body = document.body;
if(localStorage.getItem('dark')==='1') enableDark();
darkToggle.addEventListener('click',()=>{
  body.classList.toggle('dark');
  const on = body.classList.contains('dark');
  localStorage.setItem('dark', on?'1':'0');
  darkToggle.innerHTML = on ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});
function enableDark(){ body.classList.add('dark'); darkToggle.innerHTML='<i class="fas fa-sun"></i>'; }

// ── Nav Toggle ───────────────────
document.getElementById('navToggle').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});

// ── Scroll Effects ───────────────
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll',()=>{
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,.1)' : 'none';
});

// ── Render Topics ────────────────
const grid = document.getElementById('topicsGrid');
TOPICS.forEach(t=>{
  grid.innerHTML += `
  <div class="topic-card" style="--card-color:${t.color}">
    <div class="topic-icon"><i class="fas ${t.icon}"></i></div>
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
    <div class="topic-meta">
      <span><i class="fas fa-book"></i> ${t.lessons} دروس</span>
      <span><i class="fas fa-signal"></i> ${t.level}</span>
    </div>
  </div>`;
});

// ── Lesson Tabs ──────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const lessonContent = document.getElementById('lessonContent');
function loadLesson(tab){
  const l = LESSONS[tab];
  lessonContent.innerHTML = l ? l.content : '';
}
loadLesson('basics');
tabBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    tabBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    loadLesson(btn.dataset.tab);
  });
});

// ── Journal Editor ───────────────
function addRow(){
  const tbody = document.getElementById('journalBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="وصف القيد" class="j-input"/></td>
    <td><input type="text" placeholder="اسم الحساب" class="j-input"/></td>
    <td><input type="number" placeholder="0.00" class="j-input debit" oninput="updateTotals()"/></td>
    <td><input type="number" placeholder="0.00" class="j-input credit" oninput="updateTotals()"/></td>
    <td><button class="btn-remove" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>`;
  tbody.appendChild(tr);
}
function removeRow(btn){ btn.closest('tr').remove(); updateTotals(); }
function updateTotals(){
  let d=0,c=0;
  document.querySelectorAll('.debit').forEach(i=>d+=parseFloat(i.value)||0);
  document.querySelectorAll('.credit').forEach(i=>c+=parseFloat(i.value)||0);
  document.getElementById('totalDebit').textContent  = d.toFixed(2);
  document.getElementById('totalCredit').textContent = c.toFixed(2);
}
function checkBalance(){
  const d=parseFloat(document.getElementById('totalDebit').textContent);
  const c=parseFloat(document.getElementById('totalCredit').textContent);
  const el=document.getElementById('balanceResult');
  if(d===c && d>0){
    el.className='balance-result balance-ok';
    el.innerHTML='<i class="fas fa-check-circle"></i> القيد متوازن! مجموع المدين = مجموع الدائن = '+d.toFixed(2);
  } else {
    el.className='balance-result balance-err';
    el.innerHTML='<i class="fas fa-times-circle"></i> القيد غير متوازن! المدين: '+d.toFixed(2)+' — الدائن: '+c.toFixed(2);
  }
}
function clearJournal(){
  document.getElementById('journalBody').innerHTML=`
    <tr>
      <td><input type="text" placeholder="وصف القيد" class="j-input"/></td>
      <td><input type="text" placeholder="اسم الحساب" class="j-input"/></td>
      <td><input type="number" placeholder="0.00" class="j-input debit" oninput="updateTotals()"/></td>
      <td><input type="number" placeholder="0.00" class="j-input credit" oninput="updateTotals()"/></td>
      <td><button class="btn-remove" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
    </tr>`;
  updateTotals();
  const el=document.getElementById('balanceResult');
  el.className='balance-result'; el.innerHTML='';
}

// ── Quiz ─────────────────────────
let qIndex=0, score=0, answered=false;
function renderQuestion(){
  if(qIndex>=QUIZ.length){ showResult(); return; }
  const q=QUIZ[qIndex];
  const fill=((qIndex/QUIZ.length)*100)+'%';
  document.getElementById('progressFill').style.width=fill;
  document.getElementById('qProgress').textContent=`السؤال ${qIndex+1} / ${QUIZ.length}`;
  document.getElementById('qScore').textContent=`النقاط: ${score}`;
  document.getElementById('questionCard').innerHTML=`
    <h3>${q.q}</h3>
    <div class="options">${q.opts.map((o,i)=>`
      <button class="option-btn" onclick="selectAnswer(${i})">${o}</button>`).join('')}
    </div>`;
  answered=false;
  document.getElementById('nextBtn').style.display='none';
}
function selectAnswer(i){
  if(answered) return;
  answered=true;
  const q=QUIZ[qIndex];
  const btns=document.querySelectorAll('.option-btn');
  btns.forEach((b,idx)=>{ b.disabled=true; if(idx===q.ans) b.classList.add('correct'); });
  if(i===q.ans) score++;
  else btns[i].classList.add('wrong');
  document.getElementById('nextBtn').style.display='inline-flex';
  document.getElementById('qScore').textContent=`النقاط: ${score}`;
}
function nextQuestion(){ qIndex++; renderQuestion(); }
function showResult(){
  document.getElementById('quizBox').style.display='none';
  const r=document.getElementById('quizResult');
  r.style.display='block';
  const pct=Math.round((score/QUIZ.length)*100);
  let msg = pct>=80 ? '🎉 ممتاز! أداء رائع في المحاسبة المالية!' :
            pct>=60 ? '👍 جيد! راجع بعض المواضيع وأعد المحاولة' :
                     '📚 تحتاج لمزيد من الدراسة، لا تيأس!';
  r.innerHTML=`
    <h3>${score} / ${QUIZ.length}</h3>
    <p style="font-size:1.3rem;font-weight:700;margin-bottom:.5rem">${pct}%</p>
    <p>${msg}</p>
    <button class="btn btn-primary" onclick="restartQuiz()"><i class="fas fa-redo"></i> أعد الاختبار</button>`;
}
function restartQuiz(){
  qIndex=0; score=0;
  document.getElementById('quizBox').style.display='block';
  document.getElementById('quizResult').style.display='none';
  renderQuestion();
}
renderQuestion();

// ── Glossary ─────────────────────
function renderGlossary(list){
  const g=document.getElementById('glossaryGrid');
  g.innerHTML = list.map(t=>`
    <div class="glossary-card">
      <div class="term-ar">${t.ar}</div>
      <div class="term-en">${t.en}</div>
      <div class="term-def">${t.def}</div>
    </div>`).join('');
}
renderGlossary(GLOSSARY);
function filterGlossary(){
  const q=document.getElementById('glossarySearch').value.toLowerCase();
  renderGlossary(GLOSSARY.filter(t=>
    t.ar.includes(q)||t.en.toLowerCase().includes(q)||t.def.includes(q)));
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const el=document.querySelector(a.getAttribute('href'));
    if(el) el.scrollIntoView({behavior:'smooth'});
    document.getElementById('navLinks').classList.remove('open');
  });
});
