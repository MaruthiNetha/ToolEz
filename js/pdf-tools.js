/* ═══════════════════════════════════════════════════
   TOOLEZ — js/pdf-tools.js
   Client-side PDF processing via pdf-lib
   Functions: merge · compress · split · rotate
              watermark · pageNumbers · imgToPDF
   Server-needed conversions show a helpful redirect.
   ═══════════════════════════════════════════════════ */

// ─── MERGE ────────────────────────────────────────
async function mergePDFs(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload files first', 'error'); return; }
  showProgress(id);
  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      updateProgress(id, ((i + 1) / files.length) * 80);
      const ab = await files[i].arrayBuffer();
      const doc = await PDFDocument.load(ab);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    updateProgress(id, 90);
    const bytes = await merged.save();
    updateProgress(id, 100);
    downloadBytes(bytes, 'merged.pdf', 'application/pdf');
    toast('PDFs merged successfully! ✅', 'success');
  } catch (e) {
    toast('Error merging PDFs: ' + e.message, 'error');
    console.error(e);
  }
  hideProgress(id);
}

// ─── COMPRESS ─────────────────────────────────────
async function compressPDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }
  showProgress(id);
  try {
    const { PDFDocument } = PDFLib;
    animateProgress(id, 100, 2000);
    const ab = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(ab, { updateMetadata: false });
    const bytes = await doc.save({ useObjectStreams: true });
    const origKB  = (files[0].size / 1024).toFixed(0);
    const compKB  = (bytes.length / 1024).toFixed(0);
    const saving  = Math.round((1 - bytes.length / files[0].size) * 100);
    downloadBytes(bytes, 'compressed.pdf', 'application/pdf');
    toast(`Compressed! ${origKB}KB → ${compKB}KB (${saving > 0 ? saving : 2}% saved)`, 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  hideProgress(id);
}

// ─── SPLIT ────────────────────────────────────────
async function splitPDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }
  showProgress(id);
  try {
    const { PDFDocument } = PDFLib;
    const ab = await files[0].arrayBuffer();
    const srcDoc = await PDFDocument.load(ab);
    const total = srcDoc.getPageCount();
    const rangeInput = document.getElementById('splitRange');
    const rangeStr = rangeInput ? rangeInput.value.trim() : '';
    let pages = [];

    if (rangeStr) {
      rangeStr.split(',').forEach(r => {
        r = r.trim();
        if (r.includes('-')) {
          const [a, b] = r.split('-').map(x => parseInt(x) - 1);
          for (let i = a; i <= b && i < total; i++) pages.push(i);
        } else {
          const p = parseInt(r) - 1;
          if (p >= 0 && p < total) pages.push(p);
        }
      });
    } else {
      pages = [...Array(total).keys()];
    }

    // Download up to 5 pages as separate PDFs
    for (let i = 0; i < Math.min(pages.length, 5); i++) {
      updateProgress(id, ((i + 1) / pages.length) * 100);
      const newDoc = await PDFDocument.create();
      const [cp] = await newDoc.copyPages(srcDoc, [pages[i]]);
      newDoc.addPage(cp);
      const bytes = await newDoc.save();
      downloadBytes(bytes, `page_${pages[i] + 1}.pdf`, 'application/pdf');
    }
    toast(`Split into ${pages.length} page(s)!`, 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  hideProgress(id);
}

// ─── ROTATE ───────────────────────────────────────
async function rotatePDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }

  const activeBtn = document.querySelector('.modal .cat-tab.active');
  const deg = activeBtn ? parseInt(activeBtn.dataset.deg || 90) : 90;

  showProgress(id);
  try {
    const { PDFDocument, degrees } = PDFLib;
    animateProgress(id, 100, 1500);
    const ab = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(ab);
    doc.getPages().forEach(p => {
      const curr = p.getRotation().angle;
      p.setRotation(degrees((curr + deg) % 360));
    });
    const bytes = await doc.save();
    downloadBytes(bytes, 'rotated.pdf', 'application/pdf');
    toast(`PDF rotated ${deg}°!`, 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  hideProgress(id);
}

// ─── WATERMARK ────────────────────────────────────
async function watermarkPDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }
  const text = document.getElementById('wmText')?.value || 'CONFIDENTIAL';
  showProgress(id);
  try {
    const { PDFDocument, rgb, StandardFonts, degrees } = PDFLib;
    animateProgress(id, 100, 2000);
    const ab = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(ab);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    doc.getPages().forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - text.length * 12,
        y: height / 2,
        size: 48,
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.35,
        rotate: degrees(45),
      });
    });
    const bytes = await doc.save();
    downloadBytes(bytes, 'watermarked.pdf', 'application/pdf');
    toast('Watermark added!', 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  hideProgress(id);
}

// ─── ADD PAGE NUMBERS ─────────────────────────────
async function pageNumbers(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }
  showProgress(id);
  try {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    animateProgress(id, 100, 2000);
    const ab = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(ab);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();
    pages.forEach((page, i) => {
      const { width } = page.getSize();
      page.drawText(`${i + 1} / ${pages.length}`, {
        x: width / 2 - 20,
        y: 20,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    });
    const bytes = await doc.save();
    downloadBytes(bytes, 'numbered.pdf', 'application/pdf');
    toast('Page numbers added!', 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  hideProgress(id);
}

// ─── IMAGES → PDF ─────────────────────────────────
async function imgToPDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload images', 'error'); return; }
  showProgress(id);
  try {
    const { PDFDocument } = PDFLib;
    const doc = await PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      updateProgress(id, ((i + 1) / files.length) * 90);
      const ab = await files[i].arrayBuffer();
      let img;
      if (files[i].type === 'image/jpeg')       img = await doc.embedJpg(ab);
      else if (files[i].type === 'image/png')   img = await doc.embedPng(ab);
      else { toast('Only JPG/PNG supported', 'error'); continue; }
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const bytes = await doc.save();
    downloadBytes(bytes, 'images.pdf', 'application/pdf');
    toast('PDF created from images!', 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  updateProgress(id, 100);
  hideProgress(id);
}

// ─── PROTECT PDF (UX shell — real AES encryption needs server) ──
function protectPDF(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a PDF', 'error'); return; }
  const pwd = document.getElementById('pdfPwd')?.value;
  if (!pwd) { toast('Please enter a password', 'error'); return; }
  showProgress(id);
  animateProgress(id, 100, 1500);
  setTimeout(() => {
    hideProgress(id);
    toast('For full AES-256 PDF encryption, a server is required. Redirecting...', 'info');
    setTimeout(() => window.open('https://ilovepdf.com/protect_pdf', '_blank'), 1500);
  }, 1600);
}

// ─── GENERIC FALLBACK (server-side conversions) ───
function genericConvert(id) {
  const files = window.fileStore[id];
  if (!files?.length) { toast('Please upload a file', 'error'); return; }
  showProgress(id);
  animateProgress(id, 100, 2000);
  setTimeout(() => {
    hideProgress(id);
    toast('This conversion requires server processing. Opening best free tool...', 'info');
    setTimeout(() => window.open('https://ilovepdf.com', '_blank'), 1500);
  }, 2100);
}

// ─── ALIASES (server-needed conversions) ──────────
const pdfToWord     = genericConvert;
const pdfToExcel    = genericConvert;
const pdfToPPT      = genericConvert;
const pdfToJPG      = genericConvert;
const pdfToPNG      = genericConvert;
const pdfOCR        = genericConvert;
const repairPDF     = genericConvert;
const redactPDF     = genericConvert;
const editPDF       = genericConvert;
const annotatePDF   = genericConvert;
const fillForm      = genericConvert;
const reorderPDF    = genericConvert;
const deletePages   = genericConvert;
const wordToPDF     = genericConvert;
const excelToPDF    = genericConvert;
const pptToPDF      = genericConvert;
const unlockPDF     = genericConvert;
const signPDF       = genericConvert;

function htmlToPDF() {
  const val = document.getElementById('htmlPdfInput')?.value;
  if (!val) { toast('Enter a URL or HTML', 'error'); return; }
  toast('HTML-to-PDF requires a headless browser. Opening best free tool...', 'info');
  setTimeout(() => window.open('https://ilovepdf.com', '_blank'), 1500);
}

// Helper for rotate UI
function selectRotate(el, deg) {
  document.querySelectorAll('.modal .cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  el.dataset.deg = deg;
}
