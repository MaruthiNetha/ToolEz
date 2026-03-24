/* ═══════════════════════════════════════════════════
   TOOLEZ — js/main.js
   Core: theme toggle · navigation · toast notifications
         modal system · search · category filters
         scroll reveal
   ═══════════════════════════════════════════════════ */

// ─── THEME TOGGLE ─────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
}

// ─── NAVIGATION ───────────────────────────────────
function setNav(el) {
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

// ─── TOAST NOTIFICATIONS ──────────────────────────
function toast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  const icons = { info: 'ℹ️', success: '✅', error: '❌' };
  el.className = `toast ${type}`;
  el.innerHTML = `${icons[type]} ${msg}`;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ─── MODAL SYSTEM ─────────────────────────────────
function openModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ─── CATEGORY FILTERS ─────────────────────────────
function filterPDF(cat, btn) {
  document.querySelectorAll('#pdf-tools .cat-tabs .cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#pdfGrid .tool-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
  });
}

function filterAI(cat, btn) {
  document.querySelectorAll('#ai-tools .cat-tabs .cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#aiGrid .ai-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
  });
}

// ─── SEARCH ───────────────────────────────────────
// allTools is built after tool-modals.js loads (see bottom of tool-modals.js)
function handleHeaderSearch(val) {
  const dropdown = document.getElementById('searchDropdown');
  if (!val.trim()) { dropdown.style.display = 'none'; return; }

  const results = (window.allTools || [])
    .filter(t => t.name.toLowerCase().includes(val.toLowerCase()))
    .slice(0, 8);

  if (!results.length) { dropdown.style.display = 'none'; return; }

  dropdown.innerHTML = results.map(t => `
    <div class="search-result-item" onclick="
      ${t.url ? `window.open('${t.url}','_blank')` : `openTool('${t.id}')`};
      document.getElementById('searchDropdown').style.display='none';
      document.getElementById('headerSearch').value=''">
      <span class="sr-icon">${t.icon}</span>
      <div>
        <div class="sr-name">${t.name}</div>
        <div class="sr-cat">${t.cat}</div>
      </div>
    </div>`).join('');

  dropdown.style.display = 'block';
}

function triggerSearch() {
  const val = document.getElementById('heroSearch').value.trim();
  if (!val) { toast('Enter a tool name to search', 'info'); return; }
  document.getElementById('headerSearch').value = val;
  handleHeaderSearch(val);
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown.style.display === 'block') {
    const first = dropdown.querySelector('.search-result-item');
    if (first) first.click();
  }
}

// Close search on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.search-pill'))
    document.getElementById('searchDropdown').style.display = 'none';
});

// ─── FILE HANDLING (shared by pdf-tools + mini-tools) ─
window.fileStore = {};

function doDragOver(e)  { e.preventDefault(); e.currentTarget.classList.add('dragging'); }
function doDragLeave(e) { e.currentTarget.classList.remove('dragging'); }
function doDrop(e, id)  {
  e.preventDefault();
  e.currentTarget.classList.remove('dragging');
  setFiles([...e.dataTransfer.files], id);
}
function handleFileInput(e, id) { setFiles([...e.target.files], id); }

function setFiles(files, id) {
  window.fileStore[id] = files;
  const area = document.getElementById('fileInfoArea' + id);
  if (area) {
    area.innerHTML = files.map(f => `
      <div class="file-info">
        <span class="file-info-icon">📄</span>
        <span class="file-info-name">${f.name}</span>
        <span class="file-info-size">${(f.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>`).join('');
  }
  const btn = document.getElementById('actionBtn' + id);
  if (btn) btn.disabled = false;
  toast(`${files.length} file(s) ready`, 'success');
}

// ─── PROGRESS HELPERS ─────────────────────────────
function showProgress(id) {
  const p = document.getElementById('progress' + id);
  if (p) p.style.display = 'block';
}
function hideProgress(id) {
  const p = document.getElementById('progress' + id);
  if (p) p.style.display = 'none';
}
function updateProgress(id, pct) {
  const f = document.getElementById('progressFill' + id);
  if (f) f.style.width = pct + '%';
}
function animateProgress(id, to, dur) {
  const f = document.getElementById('progressFill' + id);
  if (!f) return;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    f.style.width = (to * prog) + '%';
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── DOWNLOAD BYTES HELPER ────────────────────────
function downloadBytes(bytes, filename, mime) {
  const blob = new Blob([bytes], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── SCROLL REVEAL ────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
