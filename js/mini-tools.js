/* ═══════════════════════════════════════════════════
   TOOLEZ — js/mini-tools.js
   Inline tools: QR Code · Password Generator ·
   Word Counter · Color Picker · JSON Formatter ·
   Age Calculator · Timer · Base64 · Markdown ·
   Unit Converter · IP Lookup · URL Shortener ·
   Image Converter · Image Resizer · Image Compressor ·
   Signature Pad
   ═══════════════════════════════════════════════════ */

// ─── QR CODE GENERATOR ────────────────────────────
function buildQR() {
  return `
<div style="text-align:center">
  <div style="margin:1rem 0">
    <input id="qrText" type="text" placeholder="Enter URL or text..."
      style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
             padding:0.8rem 1rem;color:var(--text);font-size:0.95rem;outline:none;font-family:'DM Sans',sans-serif"
      oninput="generateQR()" />
  </div>
  <canvas id="qrCanvas" width="240" height="240"
    style="border-radius:12px;background:#fff;padding:12px;max-width:240px;display:none"></canvas>
  <div id="qrPlaceholder"
    style="width:240px;height:240px;margin:0 auto;background:var(--bg3);border-radius:12px;
           display:flex;align-items:center;justify-content:center;color:var(--text-dim);font-size:3rem">🔲</div>
  <div class="btn-group" style="justify-content:center;margin-top:1rem">
    <button class="btn btn-primary" onclick="downloadQR()">⬇ Download QR</button>
  </div>
</div>`;
}

function generateQR() {
  const text = document.getElementById('qrText')?.value;
  if (!text) {
    document.getElementById('qrPlaceholder').style.display = 'flex';
    document.getElementById('qrCanvas').style.display = 'none';
    return;
  }
  const canvas = document.getElementById('qrCanvas');
  const ph = document.getElementById('qrPlaceholder');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = 240; canvas.height = 240;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 240, 240);
    ctx.drawImage(img, 0, 0, 240, 240);
    canvas.style.display = 'block';
    ph.style.display = 'none';
  };
  img.onerror = () => { ph.style.display = 'flex'; canvas.style.display = 'none'; };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}`;
}

function downloadQR() {
  const canvas = document.getElementById('qrCanvas');
  if (canvas.style.display === 'none') { toast('Generate a QR first', 'error'); return; }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'qrcode.png';
  a.click();
  toast('QR downloaded!', 'success');
}

// ─── PASSWORD GENERATOR ───────────────────────────
function buildPassword() {
  return `
<div>
  <div id="pwdDisplay"
    style="display:flex;align-items:center;gap:0.75rem;background:var(--bg3);border:1.5px solid var(--border);
           border-radius:12px;padding:1rem 1.25rem;font-size:1.1rem;font-family:monospace;letter-spacing:0.08em">
    Click Generate →
  </div>
  <div style="margin:1.25rem 0">
    <label style="font-size:0.85rem;color:var(--text-muted)">Length: <span id="pwdLenVal">16</span></label>
    <input type="range" min="8" max="64" value="16" id="pwdLen"
      oninput="document.getElementById('pwdLenVal').textContent=this.value"
      style="width:100%;margin-top:0.4rem;accent-color:var(--accent)" />
  </div>
  <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem">
    <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;cursor:pointer">
      <input type="checkbox" id="pwdUpper" checked style="accent-color:var(--accent)"> Uppercase
    </label>
    <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;cursor:pointer">
      <input type="checkbox" id="pwdNum" checked style="accent-color:var(--accent)"> Numbers
    </label>
    <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;cursor:pointer">
      <input type="checkbox" id="pwdSym" checked style="accent-color:var(--accent)"> Symbols
    </label>
  </div>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="genPassword()">⚡ Generate</button>
    <button class="btn btn-ghost" onclick="copyPwd()">📋 Copy</button>
  </div>
</div>`;
}

function genPassword() {
  const len = parseInt(document.getElementById('pwdLen')?.value || 16);
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if (document.getElementById('pwdUpper')?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (document.getElementById('pwdNum')?.checked)   chars += '0123456789';
  if (document.getElementById('pwdSym')?.checked)   chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
  let pwd = '';
  for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  const d = document.getElementById('pwdDisplay');
  if (d) d.textContent = pwd;
}

function copyPwd() {
  const t = document.getElementById('pwdDisplay')?.textContent;
  if (!t || t === 'Click Generate →') { toast('Generate a password first', 'error'); return; }
  navigator.clipboard.writeText(t).then(() => toast('Copied!', 'success'));
}

// ─── WORD COUNTER ─────────────────────────────────
function buildWordCount() {
  return `
<div>
  <textarea id="wcText" placeholder="Paste or type your text here..." oninput="updateWC()"
    style="width:100%;height:180px;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:1rem;color:var(--text);font-size:0.9rem;resize:vertical;outline:none;
           font-family:'DM Sans',sans-serif;line-height:1.6"></textarea>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-top:1rem">
    ${['wcWords:0:Words','wcChars:0:Chars','wcSents:0:Sentences','wcRead:0:Min Read'].map(s => {
      const [id, val, label] = s.split(':');
      return `<div style="background:var(--bg3);border-radius:12px;padding:1rem;text-align:center">
        <div style="font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:700" id="${id}">${val}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${label}</div>
      </div>`;
    }).join('')}
  </div>
</div>`;
}

function updateWC() {
  const t = document.getElementById('wcText')?.value || '';
  document.getElementById('wcWords').textContent = t.trim().split(/\s+/).filter(w => w).length;
  document.getElementById('wcChars').textContent = t.length;
  document.getElementById('wcSents').textContent = t.split(/[.!?]+/).filter(s => s.trim()).length;
  document.getElementById('wcRead').textContent  = Math.ceil(t.trim().split(/\s+/).filter(w => w).length / 200) || 0;
}

// ─── COLOR PICKER ─────────────────────────────────
function buildColorPicker() {
  return `
<div style="text-align:center">
  <input type="color" id="colorInput" value="#6c63ff" oninput="updateColor(this.value)"
    style="width:100%;height:80px;border:none;border-radius:12px;cursor:pointer;background:none" />
  <div id="colorResult" style="margin:1rem 0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem"></div>
  <script>setTimeout(()=>updateColor('#6c63ff'),100)<\/script>
</div>`;
}

function updateColor(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const [h, s, l] = rgbToHsl(r, g, b);
  const d = document.getElementById('colorResult');
  if (!d) return;
  const swatches = [['HEX', hex], ['RGB', `rgb(${r},${g},${b})`], [`HSL`, `hsl(${h},${s}%,${l}%)`]];
  d.innerHTML = swatches.map(([label, val]) => `
    <div style="background:var(--bg3);border-radius:10px;padding:0.85rem;cursor:pointer"
         onclick="navigator.clipboard.writeText('${val}').then(()=>toast('Copied!','success'))">
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.3rem">${label}</div>
      <div style="font-size:0.85rem;font-weight:600;font-family:monospace">${val}</div>
    </div>`).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

// ─── JSON FORMATTER ───────────────────────────────
function buildJSON() {
  return `
<div>
  <textarea id="jsonInput" placeholder='{"key": "value", "array": [1,2,3]}'
    style="width:100%;height:160px;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:1rem;color:var(--text);font-size:0.85rem;font-family:monospace;resize:vertical;outline:none"></textarea>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="formatJSON()">Format</button>
    <button class="btn btn-ghost" onclick="minifyJSON()">Minify</button>
    <button class="btn btn-ghost" onclick="validateJSON()">Validate</button>
  </div>
  <pre id="jsonOutput"
    style="background:var(--bg3);border-radius:12px;padding:1rem;font-size:0.8rem;overflow-x:auto;
           margin-top:0.75rem;max-height:200px;white-space:pre-wrap;display:none"></pre>
</div>`;
}

function formatJSON()  {
  try { const o = JSON.parse(document.getElementById('jsonInput').value); showJSONOut(JSON.stringify(o, null, 2)); toast('Formatted!','success'); }
  catch(e) { toast('Invalid JSON: ' + e.message, 'error'); }
}
function minifyJSON()  {
  try { const o = JSON.parse(document.getElementById('jsonInput').value); showJSONOut(JSON.stringify(o)); toast('Minified!', 'success'); }
  catch(e) { toast('Invalid JSON: ' + e.message, 'error'); }
}
function validateJSON(){
  try { JSON.parse(document.getElementById('jsonInput').value); toast('✅ Valid JSON!', 'success'); }
  catch(e) { toast('❌ Invalid: ' + e.message, 'error'); }
}
function showJSONOut(txt) { const o = document.getElementById('jsonOutput'); o.textContent = txt; o.style.display = 'block'; }

// ─── AGE CALCULATOR ───────────────────────────────
function buildAge() {
  return `
<div>
  <label style="font-size:0.875rem;color:var(--text-muted);display:block;margin-bottom:0.5rem">Date of Birth</label>
  <input type="date" id="dobInput"
    style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:0.85rem 1rem;color:var(--text);font-size:1rem;outline:none;font-family:'DM Sans',sans-serif;margin-bottom:1rem" />
  <button class="btn btn-primary" onclick="calcAge()">Calculate Age</button>
  <div id="ageResult" style="margin-top:1rem;display:none"></div>
</div>`;
}

function calcAge() {
  const dob = new Date(document.getElementById('dobInput')?.value);
  if (isNaN(dob)) { toast('Enter a valid date', 'error'); return; }
  const today = new Date();
  let y = today.getFullYear() - dob.getFullYear();
  let m = today.getMonth() - dob.getMonth();
  let d = today.getDate() - dob.getDate();
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const daysUntil = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  const r = document.getElementById('ageResult');
  if (r) {
    r.style.display = 'grid';
    r.style.gridTemplateColumns = '1fr 1fr';
    r.style.gap = '0.75rem';
    r.innerHTML = `
      <div style="background:var(--bg3);border-radius:12px;padding:1rem;text-align:center">
        <div style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800">${y}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Years</div>
      </div>
      <div style="background:var(--bg3);border-radius:12px;padding:1rem;text-align:center">
        <div style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800">${m}m ${d}d</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Remaining</div>
      </div>
      <div style="background:var(--bg3);border-radius:12px;padding:1rem;text-align:center;grid-column:1/-1">
        <div style="font-size:0.875rem;color:var(--text-muted)">
          Next birthday in <strong style="color:var(--accent3)">${daysUntil} days</strong>
        </div>
      </div>`;
  }
}

// ─── TIMER / STOPWATCH ────────────────────────────
let timerInterval = null, timerSeconds = 0, timerRunning = false;

function buildTimer() {
  return `
<div style="text-align:center">
  <div id="timerDisplay"
    style="font-family:'Syne',sans-serif;font-size:4rem;font-weight:800;
           letter-spacing:0.05em;margin:1.5rem 0">00:00:00</div>
  <div class="btn-group" style="justify-content:center">
    <button class="btn btn-primary" id="timerStartBtn" onclick="timerToggle()">▶ Start</button>
    <button class="btn btn-ghost" onclick="timerReset()">↺ Reset</button>
  </div>
  <div style="margin-top:1.5rem">
    <label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.5rem">
      Countdown from (seconds):
    </label>
    <div style="display:flex;gap:0.5rem">
      <input type="number" id="countdownInput" placeholder="e.g. 300 for 5 min"
        style="flex:1;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
               padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif" />
      <button class="btn btn-ghost" onclick="setCountdown()">Set</button>
    </div>
  </div>
</div>`;
}

function timerToggle() {
  if (timerRunning) {
    clearInterval(timerInterval); timerRunning = false;
    document.getElementById('timerStartBtn').textContent = '▶ Start';
  } else {
    timerRunning = true;
    document.getElementById('timerStartBtn').textContent = '⏸ Pause';
    timerInterval = setInterval(() => { timerSeconds++; updateTimerDisplay(); }, 1000);
  }
}
function timerReset() {
  clearInterval(timerInterval); timerRunning = false; timerSeconds = 0;
  updateTimerDisplay();
  const b = document.getElementById('timerStartBtn');
  if (b) b.textContent = '▶ Start';
}
function setCountdown() {
  const v = parseInt(document.getElementById('countdownInput')?.value);
  if (v > 0) { timerSeconds = v; updateTimerDisplay(); }
}
function updateTimerDisplay() {
  const h = Math.floor(timerSeconds / 3600);
  const m = Math.floor((timerSeconds % 3600) / 60);
  const s = timerSeconds % 60;
  const d = document.getElementById('timerDisplay');
  if (d) d.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  if (timerSeconds <= 0 && timerRunning) {
    clearInterval(timerInterval); timerRunning = false;
    toast('⏰ Timer finished!', 'success');
  }
}

// ─── BASE64 ───────────────────────────────────────
function buildBase64() {
  return `
<div>
  <textarea id="b64Input" placeholder="Enter text or paste Base64 to decode..."
    style="width:100%;height:120px;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:1rem;color:var(--text);font-size:0.875rem;font-family:monospace;resize:vertical;
           outline:none;margin-bottom:0.75rem"></textarea>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="encodeB64()">Encode →</button>
    <button class="btn btn-ghost" onclick="decodeB64()">← Decode</button>
    <button class="btn btn-ghost" onclick="copyB64Result()">📋 Copy</button>
  </div>
  <textarea id="b64Output" placeholder="Result appears here..." readonly
    style="width:100%;height:120px;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:1rem;color:var(--text);font-size:0.875rem;font-family:monospace;resize:vertical;
           outline:none;margin-top:0.75rem"></textarea>
</div>`;
}

function encodeB64() {
  const i = document.getElementById('b64Input')?.value;
  if (!i) { toast('Enter text', 'error'); return; }
  try { document.getElementById('b64Output').value = btoa(unescape(encodeURIComponent(i))); toast('Encoded!', 'success'); }
  catch(e) { toast('Encoding error', 'error'); }
}
function decodeB64() {
  const i = document.getElementById('b64Input')?.value;
  if (!i) { toast('Enter Base64', 'error'); return; }
  try { document.getElementById('b64Output').value = decodeURIComponent(escape(atob(i))); toast('Decoded!', 'success'); }
  catch(e) { toast('Invalid Base64', 'error'); }
}
function copyB64Result() {
  const v = document.getElementById('b64Output')?.value;
  if (v) navigator.clipboard.writeText(v).then(() => toast('Copied!', 'success'));
}

// ─── MARKDOWN EDITOR ──────────────────────────────
function buildMarkdown() {
  return `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;height:300px">
  <textarea id="mdInput" placeholder="# Hello&#10;&#10;Write **markdown** here..." oninput="renderMD()"
    style="background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;padding:1rem;
           color:var(--text);font-size:0.875rem;font-family:monospace;resize:none;outline:none"></textarea>
  <div id="mdPreview"
    style="background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;padding:1rem;
           overflow-y:auto;font-size:0.875rem;line-height:1.7"></div>
</div>`;
}

function renderMD() {
  const txt = document.getElementById('mdInput')?.value || '';
  const html = txt
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm,  '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,    '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,     '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,      '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,  '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,      '<em>$1</em>')
    .replace(/`(.+?)`/g,        '<code style="background:rgba(255,255,255,0.1);padding:0.1em 0.3em;border-radius:4px">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--accent)">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1rem">$1</li>')
    .replace(/\n/g, '<br>');
  const p = document.getElementById('mdPreview');
  if (p) p.innerHTML = html;
}

// ─── UNIT CONVERTER ───────────────────────────────
const unitData = {
  Length:      { m:1, km:0.001, cm:100, mm:1000, ft:3.28084, in:39.3701, mi:0.000621371, yd:1.09361 },
  Weight:      { kg:1, g:1000, lb:2.20462, oz:35.274, mg:1e6, ton:0.001 },
  Temperature: 'special',
  Area:        { m2:1, km2:1e-6, cm2:1e4, ft2:10.7639, acre:0.000247105, ha:0.0001 },
  Volume:      { l:1, ml:1000, m3:0.001, gal:0.264172, cup:4.22675, fl_oz:33.814 },
};
let currentUnitCat = 'Length';

function buildUnit() {
  return `
<div>
  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
    ${['Length','Weight','Temperature','Area','Volume'].map((u, i) =>
      `<button class="cat-tab ${i === 0 ? 'active' : ''}" onclick="setUnitCat(this,'${u}')">${u}</button>`
    ).join('')}
  </div>
  <div style="display:flex;gap:0.75rem;align-items:center;margin:1rem 0">
    <input type="number" id="unitFrom" placeholder="0" oninput="convertUnit()"
      style="flex:1;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
             padding:0.8rem;color:var(--text);font-size:1rem;outline:none;font-family:'DM Sans',sans-serif" />
    <select id="unitFromSel" onchange="convertUnit()"
      style="background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.8rem;
             color:var(--text);font-size:0.875rem;outline:none;min-width:100px"></select>
  </div>
  <div style="display:flex;gap:0.75rem;align-items:center">
    <input type="number" id="unitTo" readonly placeholder="Result"
      style="flex:1;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
             padding:0.8rem;color:var(--text);font-size:1rem;outline:none;font-family:'DM Sans',sans-serif" />
    <select id="unitToSel" onchange="convertUnit()"
      style="background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.8rem;
             color:var(--text);font-size:0.875rem;outline:none;min-width:100px"></select>
  </div>
  <script>setTimeout(()=>setUnitCat(document.querySelector('.modal .cat-tab.active'),'Length'),100)<\/script>
</div>`;
}

function setUnitCat(el, cat) {
  document.querySelectorAll('.modal .cat-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  currentUnitCat = cat;
  const units = cat === 'Temperature' ? ['°C','°F','K'] : Object.keys(unitData[cat] || {});
  ['unitFromSel','unitToSel'].forEach((sel, idx) => {
    const s = document.getElementById(sel);
    if (!s) return;
    s.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    if (idx === 1 && s.options.length > 1) s.selectedIndex = 1;
  });
}

function convertUnit() {
  const v = parseFloat(document.getElementById('unitFrom')?.value);
  const from = document.getElementById('unitFromSel')?.value;
  const to   = document.getElementById('unitToSel')?.value;
  const out  = document.getElementById('unitTo');
  if (isNaN(v) || !from || !to || !out) return;
  if (currentUnitCat === 'Temperature') {
    let c = from === '°C' ? v : from === '°F' ? (v - 32) / 1.8 : v - 273.15;
    out.value = (to === '°C' ? c : to === '°F' ? c * 1.8 + 32 : c + 273.15).toFixed(4);
  } else {
    const d = unitData[currentUnitCat];
    if (!d) return;
    out.value = ((v / d[from]) * d[to]).toFixed(6);
  }
}

// ─── IP LOOKUP ────────────────────────────────────
function buildIP() {
  return `
<div>
  <div style="background:var(--bg3);border-radius:12px;padding:1.25rem;margin-bottom:1rem">
    <span style="color:var(--text-muted)">Your IP: </span>
    <span id="myIp" style="font-family:monospace;font-weight:600">Loading...</span>
  </div>
  <div style="display:flex;gap:0.5rem;margin-bottom:1rem">
    <input type="text" id="ipInput" placeholder="Enter any IP address..."
      style="flex:1;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
             padding:0.8rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif" />
    <button class="btn btn-primary" onclick="lookupIP()">Lookup</button>
  </div>
  <div id="ipResult"
    style="display:none;background:var(--bg3);border-radius:12px;padding:1.25rem;
           font-size:0.875rem;line-height:2"></div>
  <script>
    fetch('https://api.ipify.org?format=json')
      .then(r=>r.json())
      .then(d=>{const el=document.getElementById('myIp');if(el)el.textContent=d.ip;})
      .catch(()=>{const el=document.getElementById('myIp');if(el)el.textContent='Unable to detect';});
  <\/script>
</div>`;
}

function lookupIP() {
  const ip = document.getElementById('ipInput')?.value.trim();
  if (!ip) { toast('Enter an IP address', 'error'); return; }
  toast('Looking up IP...', 'info');
  fetch(`https://ipapi.co/${ip}/json/`)
    .then(r => r.json())
    .then(d => {
      const r = document.getElementById('ipResult');
      if (r) {
        r.style.display = 'block';
        r.innerHTML = `
          <strong>IP:</strong> ${d.ip || ip}<br>
          <strong>Country:</strong> ${d.country_name || 'N/A'}<br>
          <strong>City:</strong> ${d.city || 'N/A'}<br>
          <strong>ISP:</strong> ${d.org || 'N/A'}<br>
          <strong>Timezone:</strong> ${d.timezone || 'N/A'}`;
      }
    }).catch(() => toast('Lookup failed', 'error'));
}

// ─── URL SHORTENER ────────────────────────────────
function buildURLShort() {
  return `
<div>
  <input type="url" id="urlInput" placeholder="https://your-long-url.com/with/many/params"
    style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:12px;
           padding:0.9rem 1rem;color:var(--text);font-size:0.9rem;outline:none;
           font-family:'DM Sans',sans-serif;margin-bottom:0.75rem" />
  <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="shortenURL()">
    ✂️ Shorten URL
  </button>
  <div id="urlResult"
    style="display:none;margin-top:1rem;background:var(--bg3);border-radius:12px;
           padding:1rem;align-items:center;gap:0.75rem">
    <span id="shortUrl" style="flex:1;font-family:monospace;font-size:0.9rem;color:var(--accent)"></span>
    <button class="btn btn-ghost" style="padding:0.5rem 0.9rem;font-size:0.8rem" onclick="copyShortUrl()">Copy</button>
  </div>
</div>`;
}

function shortenURL() {
  const url = document.getElementById('urlInput')?.value.trim();
  if (!url) { toast('Enter a URL', 'error'); return; }
  toast('Shortening...', 'info');
  fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`)
    .then(r => r.json())
    .then(d => {
      if (d.shorturl) {
        const r = document.getElementById('urlResult');
        const s = document.getElementById('shortUrl');
        if (r && s) { r.style.display = 'flex'; s.textContent = d.shorturl; toast('URL shortened!', 'success'); }
      } else toast('Could not shorten', 'error');
    }).catch(() => toast('Service unavailable', 'error'));
}

function copyShortUrl() {
  const v = document.getElementById('shortUrl')?.textContent;
  if (v) navigator.clipboard.writeText(v).then(() => toast('Copied!', 'success'));
}

// ─── IMAGE CONVERTER ──────────────────────────────
let imgConvFile = null, imgConvMime = 'image/png';

function buildImgConvert() {
  return `
<div>
  <div class="dropzone" style="margin-bottom:1rem"
    ondragover="doDragOver(event)" ondrop="doDropImgC(event)" ondragleave="doDragLeave(event)">
    <input type="file" accept="image/*" onchange="handleImgConvert(event)" />
    <div class="dropzone-icon">🖼️</div>
    <h3>Drop image here</h3>
    <p>JPG, PNG, WebP supported</p>
  </div>
  <label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.5rem">Convert to:</label>
  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
    <button class="cat-tab" data-mime="image/jpeg" onclick="selectImgFormat(this)">JPG</button>
    <button class="cat-tab active" data-mime="image/png" onclick="selectImgFormat(this)">PNG</button>
    <button class="cat-tab" data-mime="image/webp" onclick="selectImgFormat(this)">WEBP</button>
  </div>
  <div id="imgConvertResult" style="display:none">
    <canvas id="imgConvCanvas" style="display:none"></canvas>
    <img id="imgConvPreview" style="max-width:100%;border-radius:12px;margin-bottom:0.75rem" />
    <button class="btn btn-primary" onclick="downloadConvertedImg()">⬇ Download</button>
  </div>
</div>`;
}

function selectImgFormat(el) {
  document.querySelectorAll('.modal .cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  imgConvMime = el.dataset.mime;
  if (imgConvFile) convertImgNow();
}
function handleImgConvert(e) { imgConvFile = e.target.files[0]; if (imgConvFile) convertImgNow(); }
function doDropImgC(e) { e.preventDefault(); e.currentTarget.classList.remove('dragging'); imgConvFile = e.dataTransfer.files[0]; if (imgConvFile) convertImgNow(); }
function convertImgNow() {
  if (!imgConvFile) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const c = document.getElementById('imgConvCanvas');
      const prev = document.getElementById('imgConvPreview');
      const r = document.getElementById('imgConvertResult');
      if (!c || !prev || !r) return;
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      prev.src = c.toDataURL(imgConvMime, 0.92);
      r.style.display = 'block';
      toast('Image converted!', 'success');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(imgConvFile);
}
function downloadConvertedImg() {
  const c = document.getElementById('imgConvCanvas');
  if (!c) return;
  const ext = imgConvMime.split('/')[1];
  const a = document.createElement('a');
  a.href = c.toDataURL(imgConvMime, 0.92);
  a.download = `converted.${ext}`;
  a.click();
}

// ─── IMAGE RESIZER ────────────────────────────────
let imgRFile = null;

function buildImgResize() {
  return `
<div>
  <div class="dropzone" style="margin-bottom:1rem"
    ondragover="doDragOver(event)" ondrop="doDropImgR(event)" ondragleave="doDragLeave(event)">
    <input type="file" accept="image/*" onchange="handleImgResize(event)" />
    <div class="dropzone-icon">📐</div>
    <h3>Drop image here</h3>
    <p>Any image format</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin:1rem 0">
    <div>
      <label style="font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:0.3rem">Width (px)</label>
      <input type="number" id="imgRW" placeholder="800"
        style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
               padding:0.7rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif" />
    </div>
    <div>
      <label style="font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:0.3rem">Height (px)</label>
      <input type="number" id="imgRH" placeholder="600"
        style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
               padding:0.7rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif" />
    </div>
  </div>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="resizeNow()">Resize &amp; Download</button>
  </div>
</div>`;
}

function handleImgResize(e)  { imgRFile = e.target.files[0]; }
function doDropImgR(e) { e.preventDefault(); e.currentTarget.classList.remove('dragging'); imgRFile = e.dataTransfer.files[0]; }
function resizeNow() {
  if (!imgRFile) { toast('Upload an image first', 'error'); return; }
  const w = parseInt(document.getElementById('imgRW')?.value);
  const h = parseInt(document.getElementById('imgRH')?.value);
  if (!w || !h) { toast('Enter width and height', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      const url = c.toDataURL('image/jpeg', 0.92);
      const a = document.createElement('a'); a.href = url; a.download = `resized_${w}x${h}.jpg`; a.click();
      toast(`Resized to ${w}×${h}!`, 'success');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(imgRFile);
}

// ─── IMAGE COMPRESSOR ─────────────────────────────
let icFile = null;

function buildImgCompress() {
  return `
<div>
  <div class="dropzone" style="margin-bottom:1rem"
    ondragover="doDragOver(event)" ondrop="doDropIC(event)" ondragleave="doDragLeave(event)">
    <input type="file" accept="image/*" onchange="handleIC(event)" />
    <div class="dropzone-icon">🗜️</div>
    <h3>Drop image here</h3>
    <p>JPG, PNG, WebP</p>
  </div>
  <label style="font-size:0.85rem;color:var(--text-muted)">Quality: <span id="icQVal">80</span>%</label>
  <input type="range" min="10" max="99" value="80" id="icQ"
    oninput="document.getElementById('icQVal').textContent=this.value"
    style="width:100%;margin:0.5rem 0 1rem;accent-color:var(--accent)" />
  <div id="icResult" style="display:none">
    <div style="display:flex;gap:1rem;font-size:0.875rem;margin-bottom:0.75rem">
      <span>Original: <strong id="icOrig">—</strong></span>
      <span>Compressed: <strong id="icComp" style="color:var(--accent3)">—</strong></span>
      <span>Savings: <strong id="icSave" style="color:var(--accent3)">—</strong></span>
    </div>
  </div>
  <button class="btn btn-primary" onclick="compressImgNow()">🗜 Compress &amp; Download</button>
</div>`;
}

function handleIC(e) { icFile = e.target.files[0]; }
function doDropIC(e) { e.preventDefault(); e.currentTarget.classList.remove('dragging'); icFile = e.dataTransfer.files[0]; }
function compressImgNow() {
  if (!icFile) { toast('Upload an image first', 'error'); return; }
  const q = parseInt(document.getElementById('icQ')?.value || 80) / 100;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      const url = c.toDataURL('image/jpeg', q);
      const compSize = Math.round(atob(url.split(',')[1]).length / 1024);
      const origSize = Math.round(icFile.size / 1024);
      const save = Math.round((1 - compSize / origSize) * 100);
      const r = document.getElementById('icResult');
      if (r) {
        r.style.display = 'block';
        document.getElementById('icOrig').textContent = origSize + 'KB';
        document.getElementById('icComp').textContent = compSize + 'KB';
        document.getElementById('icSave').textContent = (save > 0 ? save : 0) + '%';
      }
      const a = document.createElement('a'); a.href = url; a.download = 'compressed.jpg'; a.click();
      toast(`Compressed! Saved ${save > 0 ? save : 0}%`, 'success');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(icFile);
}

// ─── SIGNATURE PAD ────────────────────────────────
function buildSign() {
  return `
<div>
  <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem">Draw your signature below:</p>
  <canvas id="sigCanvas" width="560" height="180"
    style="width:100%;background:rgba(255,255,255,0.04);border:1.5px solid var(--border);
           border-radius:12px;cursor:crosshair;touch-action:none"></canvas>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="downloadSig()">⬇ Download Signature</button>
    <button class="btn btn-ghost" onclick="clearSig()">Clear</button>
  </div>
  <script>
    (function(){
      const c = document.getElementById('sigCanvas');
      const ctx = c.getContext('2d');
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c63ff';
      ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      let drawing = false;
      function pos(e) {
        const r = c.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - r.left) * (c.width / r.width), y: (src.clientY - r.top) * (c.height / r.height) };
      }
      c.addEventListener('mousedown', e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
      c.addEventListener('mousemove', e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      c.addEventListener('mouseup', () => drawing = false);
      c.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, { passive: false });
      c.addEventListener('touchmove',  e => { e.preventDefault(); if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
      c.addEventListener('touchend', () => drawing = false);
    })();
  <\/script>
</div>`;
}

function clearSig() {
  const c = document.getElementById('sigCanvas');
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
}
function downloadSig() {
  const c = document.getElementById('sigCanvas');
  if (!c) return;
  const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'signature.png'; a.click();
  toast('Signature downloaded!', 'success');
}
