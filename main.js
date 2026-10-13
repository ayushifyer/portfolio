// main.js — interactions (ES module)
import { initFluid } from './fluid.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Theme ---------- */
const root = document.documentElement;
let saved = null;
try { saved = localStorage.getItem('am-theme'); } catch {}
const initialTheme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
root.dataset.theme = initialTheme;

const fluid = initFluid($('#fluid'), { reducedMotion: reduced });
fluid.setTheme(initialTheme);

$('#themeToggle')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  fluid.setTheme(next);
  try { localStorage.setItem('am-theme', next); } catch {}
});

/* ---------- Split text (ReactBits SplitText-style) ---------- */
$$('[data-split]').forEach((el) => {
  const html = el.innerHTML;
  // keep <em> accents: walk text nodes only
  const wrapText = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'word';
          [...part].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            w.append(c);
          });
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrapText(n);
    });
  };
  wrapText(el);
  $$('.char', el).forEach((c, i) => (c.style.transitionDelay = `${i * 0.035}s`));
  el.dataset.original = html;
});

/* ---------- Rolling link text ---------- */
$$('.roll, .roll-big').forEach((el) => {
  const text = el.dataset.roll || el.textContent;
  el.innerHTML = `<span class="roll__inner" data-roll="${text}">${el.innerHTML}</span>`;
});

/* ---------- Scroll-scrubbed word highlight ---------- */
$$('[data-words]').forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
});
const words = $$('[data-words] .w');

/* ---------- GSAP scroll effects ---------- */
const { gsap, ScrollTrigger } = window;
const useGsap = !!(gsap && ScrollTrigger) && !reduced;
if (useGsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero: the name splits apart and the copy lifts away as you scroll out
  const hero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__name .split:first-child', { xPercent: -16, ease: 'none', scrollTrigger: hero });
  gsap.to('.hero__name .split--right', { xPercent: 16, ease: 'none', scrollTrigger: hero });
  gsap.to('.hero__row', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: hero });

  // About: words light up one by one, tied to scroll position
  gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // Section headings rise in with a slight skew
  gsap.utils.toArray('.h2').forEach((h) => gsap.from(h, {
    yPercent: 50, skewY: 4, opacity: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: h, start: 'top 85%' } }));

  // Skills slide in, staggered
  gsap.from('.skill', { x: -60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.skill-list', start: 'top 80%' } });

  // Cards wipe up (clip-path, so it doesn't fight the hover tilt's transform)
  gsap.from('.card', { clipPath: 'inset(100% 0% 0% 0% round 22px)', opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
    scrollTrigger: { trigger: '.cards', start: 'top 80%' } });

  // CTA headline zoom-punches into place
  gsap.fromTo('.cta__title', { scale: 0.7 }, { scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true } });

  // Marquee skews with scroll speed, settles when you stop
  const skew = gsap.quickTo('.marquee', 'skewX', { duration: 0.5, ease: 'power3' });
  let settle;
  ScrollTrigger.create({ onUpdate: (self) => {
    skew(gsap.utils.clamp(-10, 10, self.getVelocity() / -200));
    clearTimeout(settle); settle = setTimeout(() => skew(0), 120);
  } });

  // Giant footer name rises as the page ends
  gsap.from('.footer__giant', { yPercent: 60, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
} else {
  words.forEach((w) => w.classList.add('on'));
}

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    if (e.target.matches('.stat')) countUp($('[data-count]', e.target));
    io.unobserve(e.target);
  });
}, { threshold: 0.2 });

function countUp(el) {
  if (!el) return;
  const end = +el.dataset.count;
  if (reduced) { el.textContent = end; return; }
  const dur = 1600, t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Preloader ---------- */
const loader = $('#loader');
const count = $('#loaderCount');
document.body.classList.add('is-loading');
const finishLoad = () => {
  loader.classList.add('is-done');
  document.body.classList.remove('is-loading');
  if (useGsap) ScrollTrigger.refresh(); // fonts are in now, so measure again
  setTimeout(() => {
    $$('.hero [data-split]').forEach((el) => el.classList.add('is-in'));
    $$('.reveal, .split, .stat').filter((el) => !el.closest('.hero') || el.matches('.reveal')).forEach((el) => io.observe(el));
  }, 250);
};
if (reduced) { count.textContent = '100%'; finishLoad(); }
else {
  // Time-based counter (can't stall), then wait for fonts — but never longer than 1.5s
  const DUR = 1400, t0 = performance.now();
  let done = false;
  const end = () => {
    if (done) return; done = true;
    count.textContent = '100%';
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
      .then(() => setTimeout(finishLoad, 180));
  };
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / DUR);
    count.textContent = `${Math.round(100 * (1 - Math.pow(1 - p, 3)))}%`;
    p < 1 ? requestAnimationFrame(tick) : end();
  };
  requestAnimationFrame(tick);
  setTimeout(end, DUR + 800); // safety net if rAF is throttled
}

/* ---------- Scroll progress + words ---------- */
const bar = $('#progress');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Custom cursor ---------- */
if (finePointer && !reduced) {
  const cursor = $('#cursor');
  const label = $('#cursorLabel');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  const loop = () => {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.addEventListener('pointerover', (e) => {
    const big = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button');
    cursor.classList.toggle('is-hover', !!big);
    cursor.classList.toggle('is-link', !big && !!link);
    if (big) label.textContent = big.dataset.cursor;
  });
} else {
  $('#cursor')?.remove();
}

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduced) {
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });

  /* 3D tilt cards (21st.dev-style) */
  $$('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}

/* ---------- Marquee: duplicate track for seamless loop ---------- */
$$('.marquee__track').forEach((t) => (t.innerHTML += t.innerHTML));
