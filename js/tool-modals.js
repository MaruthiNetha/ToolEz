/* ═══════════════════════════════════════════════════
   TOOLEZ — js/tool-modals.js
   Tool registry · openTool() · buildToolUI()
   This file must load AFTER mini-tools.js & pdf-tools.js
   ═══════════════════════════════════════════════════ */

// ─── TOOL REGISTRY ────────────────────────────────
// Each key = tool id used in onclick="openTool('id')"
const toolModals = {
  /* ─ PDF Organize ─ */
  'pdf-merge':        { icon:'🔗', title:'Merge PDF',          type:'multi-upload',      btnText:'Merge PDFs',           action:'mergePDFs',     desc:'Combine multiple PDF files into one. Drag files to reorder them before merging.' },
  'pdf-split':        { icon:'✂️', title:'Split PDF',           type:'split',             btnText:'Split PDF',            action:'splitPDF',      desc:'Split a PDF into individual pages or extract a specific page range.' },
  'pdf-rotate':       { icon:'🔄', title:'Rotate PDF',          type:'rotate',            btnText:'Rotate & Save',        action:'rotatePDF',     desc:'Rotate all pages or specific pages by 90°, 180° or 270°.' },
  'pdf-reorder':      { icon:'📑', title:'Reorder PDF Pages',   type:'single-upload',     btnText:'Reorder Pages',        action:'reorderPDF',    desc:'Drag and drop to rearrange PDF pages in any order you like.' },
  'pdf-delete-pages': { icon:'🗑️', title:'Delete PDF Pages',    type:'single-upload',     btnText:'Delete Pages',         action:'deletePages',   desc:'Remove specific pages from any PDF document.' },
  /* ─ PDF Optimize ─ */
  'pdf-compress':     { icon:'📦', title:'Compress PDF',        type:'single-upload',     btnText:'Compress PDF',         action:'compressPDF',   desc:'Reduce PDF file size significantly while maintaining readability.' },
  'pdf-ocr':          { icon:'🔍', title:'PDF OCR',             type:'single-upload',     btnText:'Run OCR',              action:'pdfOCR',        desc:'Make scanned PDFs searchable with Optical Character Recognition.' },
  'pdf-repair':       { icon:'🔧', title:'Repair PDF',          type:'single-upload',     btnText:'Repair PDF',           action:'repairPDF',     desc:'Fix corrupted or damaged PDF files and attempt content recovery.' },
  /* ─ PDF Convert FROM ─ */
  'pdf-to-word':      { icon:'📝', title:'PDF to Word',         type:'single-upload',     btnText:'Convert to Word',      action:'pdfToWord',     desc:'Convert your PDF to an editable Microsoft Word document (.docx).' },
  'pdf-to-excel':     { icon:'📊', title:'PDF to Excel',        type:'single-upload',     btnText:'Convert to Excel',     action:'pdfToExcel',    desc:'Extract tables and data from PDF into an Excel spreadsheet (.xlsx).' },
  'pdf-to-ppt':       { icon:'🎞️', title:'PDF to PowerPoint',   type:'single-upload',     btnText:'Convert to PPT',       action:'pdfToPPT',      desc:'Convert PDF slides into an editable PowerPoint presentation (.pptx).' },
  'pdf-to-jpg':       { icon:'🖼️', title:'PDF to JPG',          type:'single-upload',     btnText:'Convert to JPG',       action:'pdfToJPG',      desc:'Convert each page of your PDF into high-quality JPEG images.' },
  'pdf-to-png':       { icon:'🏔️', title:'PDF to PNG',          type:'single-upload',     btnText:'Convert to PNG',       action:'pdfToPNG',      desc:'Export PDF pages as transparent-background PNG images.' },
  /* ─ PDF Convert TO ─ */
  'jpg-to-pdf':       { icon:'📸', title:'Images to PDF',       type:'multi-upload-img',  btnText:'Create PDF',           action:'imgToPDF',      desc:'Combine multiple JPG, PNG or image files into a single PDF document.' },
  'word-to-pdf':      { icon:'📄', title:'Word to PDF',         type:'single-upload-doc', btnText:'Convert to PDF',       action:'wordToPDF',     desc:'Convert DOCX/DOC files to PDF preserving all formatting.' },
  'excel-to-pdf':     { icon:'📈', title:'Excel to PDF',        type:'single-upload-doc', btnText:'Convert to PDF',       action:'excelToPDF',    desc:'Turn spreadsheets into shareable, beautifully formatted PDF reports.' },
  'ppt-to-pdf':       { icon:'🎯', title:'PPT to PDF',          type:'single-upload-doc', btnText:'Convert to PDF',       action:'pptToPDF',      desc:'Convert PowerPoint slides to a fixed-layout, shareable PDF file.' },
  'html-to-pdf':      { icon:'🌐', title:'HTML to PDF',         type:'html-pdf',          btnText:'Convert to PDF',       action:'htmlToPDF',     desc:'Convert a web page URL or raw HTML into a PDF document.' },
  /* ─ PDF Security ─ */
  'pdf-protect':      { icon:'🔐', title:'Protect PDF',         type:'protect',           btnText:'Add Password',         action:'protectPDF',    desc:'Add password protection and set permissions for printing and editing.' },
  'pdf-unlock':       { icon:'🔓', title:'Unlock PDF',          type:'unlock',            btnText:'Unlock PDF',           action:'unlockPDF',     desc:'Remove password restrictions from a PDF file. Enter current password to unlock.' },
  'pdf-watermark':    { icon:'💧', title:'Watermark PDF',       type:'watermark',         btnText:'Add Watermark',        action:'watermarkPDF',  desc:'Add text or image watermarks to all pages of your PDF.' },
  'pdf-redact':       { icon:'⬛', title:'Redact PDF',          type:'single-upload',     btnText:'Redact PDF',           action:'redactPDF',     desc:'Permanently remove sensitive information from PDF files.' },
  /* ─ PDF Create / Edit ─ */
  'pdf-create':       { icon:'✏️', title:'Edit PDF',            type:'single-upload',     btnText:'Open Editor',          action:'editPDF',       desc:'Add, edit and delete text, shapes and images in any PDF.' },
  'pdf-sign':         { icon:'✍️', title:'Sign PDF',            type:'sign',              btnText:'Sign Document',        action:'signPDF',       desc:'Draw your signature and place it on any PDF document.' },
  'pdf-annotate':     { icon:'💬', title:'Annotate PDF',        type:'single-upload',     btnText:'Annotate',             action:'annotatePDF',   desc:'Highlight, comment, draw and markup your PDF documents.' },
  'pdf-form':         { icon:'📋', title:'Fill PDF Form',       type:'single-upload',     btnText:'Fill Form',            action:'fillForm',      desc:'Fill and submit interactive PDF forms directly in your browser.' },
  'pdf-number':       { icon:'🔢', title:'Add Page Numbers',    type:'single-upload',     btnText:'Add Numbers',          action:'pageNumbers',   desc:'Insert page numbers with customizable position and style.' },
  /* ─ Image Tools ─ */
  'img-compress':     { icon:'🗜️', title:'Image Compressor',   type:'imgcompress' },
  'img-convert':      { icon:'🔄', title:'Image Converter',    type:'imgconvert' },
  'img-resize':       { icon:'📐', title:'Image Resizer',      type:'imgresize' },
  /* ─ Text & Dev Tools ─ */
  'qr-gen':           { icon:'🔲', title:'QR Code Generator',  type:'qr' },
  'password-gen':     { icon:'🔑', title:'Password Generator', type:'password' },
  'word-counter':     { icon:'🔢', title:'Word Counter',       type:'wordcount' },
  'color-picker':     { icon:'🎨', title:'Color Picker',       type:'colorpicker' },
  'json-format':      { icon:'{ }', title:'JSON Formatter',    type:'json' },
  'base64':           { icon:'⚙️', title:'Base64 Encoder / Decoder', type:'base64' },
  'md-preview':       { icon:'📝', title:'Markdown Editor',   type:'markdown' },
  /* ─ Utility Tools ─ */
  'age-calc':         { icon:'🎂', title:'Age Calculator',     type:'age' },
  'timer':            { icon:'⏱️', title:'Stopwatch / Timer',  type:'timer' },
  'unit-conv':        { icon:'⚖️', title:'Unit Converter',     type:'unit' },
  'ip-lookup':        { icon:'🌐', title:'IP Lookup',          type:'ip' },
  'url-shortener':    { icon:'🔗', title:'URL Shortener',      type:'url' },
};

// ─── OPEN TOOL ────────────────────────────────────
function openTool(id) {
  const t = toolModals[id];
  if (!t) { toast('Tool coming soon! 🚧', 'info'); return; }

  const html = `
    <div class="modal-icon"
      style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);font-size:2rem">
      ${t.icon}
    </div>
    <h2>${t.title}</h2>
    ${t.desc ? `<p class="modal-desc">${t.desc}</p>` : ''}
    ${buildToolUI(t, id)}`;

  openModal(html);
}

// ─── BUILD TOOL UI ────────────────────────────────
function buildToolUI(t, id) {
  const { type } = t;

  // ── Inline utilities ──
  if (type === 'qr')          return buildQR();
  if (type === 'password')    return buildPassword();
  if (type === 'wordcount')   return buildWordCount();
  if (type === 'colorpicker') return buildColorPicker();
  if (type === 'json')        return buildJSON();
  if (type === 'age')         return buildAge();
  if (type === 'timer')       return buildTimer();
  if (type === 'base64')      return buildBase64();
  if (type === 'markdown')    return buildMarkdown();
  if (type === 'unit')        return buildUnit();
  if (type === 'ip')          return buildIP();
  if (type === 'url')         return buildURLShort();
  if (type === 'imgconvert')  return buildImgConvert();
  if (type === 'imgresize')   return buildImgResize();
  if (type === 'imgcompress') return buildImgCompress();
  if (type === 'sign')        return buildSign();

  // ── HTML → PDF special ──
  if (type === 'html-pdf') return `
    <div style="margin:1rem 0">
      <label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.4rem">Enter URL or HTML code</label>
      <input id="htmlPdfInput" type="text" placeholder="https://example.com"
        style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;
               padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif;margin-bottom:0.75rem" />
      <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="htmlToPDF()">
        Convert to PDF
      </button>
    </div>`;

  // ── File-based tools ──
  const accept = type === 'multi-upload-img'  ? 'image/*'
               : type === 'single-upload-doc' ? '.docx,.doc,.xlsx,.xls,.pptx,.ppt'
               : '.pdf';
  const multiple = type.includes('multi') ? 'multiple' : '';

  // ── Extra UI for special types ──
  let extra = '';
  if (type === 'protect')   extra = `<div style="margin:1rem 0"><label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.4rem">Password</label><input id="pdfPwd" type="password" placeholder="Enter password" style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif"></div>`;
  if (type === 'unlock')    extra = `<div style="margin:1rem 0"><label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.4rem">Current Password</label><input id="pdfPwd2" type="password" placeholder="Enter current password" style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif"></div>`;
  if (type === 'watermark') extra = `<div style="margin:1rem 0"><label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.4rem">Watermark Text</label><input id="wmText" type="text" placeholder="e.g. CONFIDENTIAL" style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif"></div>`;
  if (type === 'rotate')    extra = `<div style="display:flex;gap:0.5rem;margin:1rem 0;flex-wrap:wrap"><button class="cat-tab active" data-deg="90" onclick="selectRotate(this,90)">90° CW</button><button class="cat-tab" data-deg="180" onclick="selectRotate(this,180)">180°</button><button class="cat-tab" data-deg="270" onclick="selectRotate(this,270)">90° CCW</button></div>`;
  if (type === 'split')     extra = `<div style="margin:1rem 0"><label style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:0.4rem">Page range (e.g. 1-3, 5, 7-10)</label><input id="splitRange" type="text" placeholder="1-3,5,7-10 or leave blank for all" style="width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 1rem;color:var(--text);font-size:0.9rem;outline:none;font-family:'DM Sans',sans-serif"></div>`;

  return `
    <div class="dropzone" id="dropzone${id}"
      ondragover="doDragOver(event)" ondrop="doDrop(event,'${id}')" ondragleave="doDragLeave(event)">
      <input type="file" accept="${accept}" ${multiple} onchange="handleFileInput(event,'${id}')" />
      <div class="dropzone-icon">☁️</div>
      <h3>Drop ${multiple ? 'files' : 'file'} here or click to browse</h3>
      <p>Supported: ${accept.replace(/\./g,'').toUpperCase().replace(/,/g,', ')}</p>
    </div>
    <div id="fileInfoArea${id}"></div>
    ${extra}
    <div class="progress-bar" id="progress${id}" style="display:none">
      <div class="progress-fill" id="progressFill${id}"></div>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" id="actionBtn${id}"
        onclick="${t.action || 'genericConvert'}('${id}')" disabled>
        ${t.btnText || 'Process'}
      </button>
      <button class="btn btn-ghost" onclick="closeModalDirect()">Cancel</button>
    </div>`;
}

// ─── SEARCH INDEX (built after registry loads) ────
window.allTools = [
  ...Object.entries(toolModals).map(([id, t]) => ({ id, name: t.title, cat: 'Tool', icon: t.icon })),
  { id: 'chatgpt',    name: 'ChatGPT',      cat: 'AI Tool', icon: '🤖', url: 'https://chatgpt.com' },
  { id: 'claude',     name: 'Claude',       cat: 'AI Tool', icon: '◆',  url: 'https://claude.ai' },
  { id: 'gemini',     name: 'Gemini',       cat: 'AI Tool', icon: '✦',  url: 'https://gemini.google.com' },
  { id: 'perplexity', name: 'Perplexity',   cat: 'AI Tool', icon: '⊕',  url: 'https://perplexity.ai' },
  { id: 'midjourney', name: 'Midjourney',   cat: 'AI Tool', icon: '🎨', url: 'https://midjourney.com' },
  { id: 'cursor',     name: 'Cursor',       cat: 'AI Tool', icon: '▌',  url: 'https://cursor.com' },
  { id: 'suno',       name: 'Suno AI',      cat: 'AI Tool', icon: '♪',  url: 'https://suno.com' },
  { id: 'elevenlabs', name: 'ElevenLabs',   cat: 'AI Tool', icon: '🎙️', url: 'https://elevenlabs.io' },
];
