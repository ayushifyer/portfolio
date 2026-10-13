// resume.js — theme, fluid background and PDF download (ES module)
import { initFluid } from './fluid.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let theme = 'dark';
try { theme = localStorage.getItem('am-theme') || theme; } catch {}
root.dataset.theme = theme;

const fluid = initFluid(document.getElementById('fluid'), { reducedMotion: reduced });
fluid.setTheme(theme);

document.getElementById('themeToggle').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = theme;
  fluid.setTheme(theme);
  try { localStorage.setItem('am-theme', theme); } catch {}
});

// Download: prefer a real PDF file if one is shipped alongside, else print-to-PDF
const PDF_FILE = 'Ayush-Mishra-Resume.pdf';
const btn = document.getElementById('downloadBtn');

btn.addEventListener('click', async () => {
  btn.setAttribute('aria-busy', 'true');
  try {
    const res = await fetch(PDF_FILE, { method: 'HEAD', cache: 'no-store' });
    const type = res.headers.get('content-type') || '';
    if (res.ok && type.includes('pdf')) {
      const a = document.createElement('a');
      a.href = PDF_FILE;
      a.download = PDF_FILE;
      document.body.append(a);
      a.click();
      a.remove();
      return;
    }
  } catch {
    /* file:// or offline — fall through to print */
  } finally {
    btn.removeAttribute('aria-busy');
  }
  const prevTitle = document.title;
  document.title = 'Ayush-Mishra-Resume'; // becomes the default PDF filename
  window.print();
  document.title = prevTitle;
});

// Ctrl/Cmd+P gets the same filename
addEventListener('beforeprint', () => { document.title = 'Ayush-Mishra-Resume'; });
addEventListener('afterprint', () => { document.title = 'Ayush Mishra · Resume'; });
