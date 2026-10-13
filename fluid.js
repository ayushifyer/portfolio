// fluid.js — WebGL "cosmic glow" background (ES module)
// Dark space, a violet light beam rising from the centre, drifting nebula and
// twinkling star particles that float upward. The glow leans toward the pointer.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // smoothed, 0..1
uniform float u_scroll;  // 0..1 page progress
uniform vec3  u_bg, u_c1, u_c2, u_c3, u_star;

float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

// One layer of sparse twinkling stars on a jittered grid
float stars(vec2 p, float scale, float t) {
  p *= scale;
  vec2 id = floor(p), f = fract(p) - 0.5;
  float h = hash21(id);
  vec2 o = vec2(hash21(id + 1.3), hash21(id + 7.1)) - 0.5;
  float d = length(f - o * 0.7);
  float size = mix(0.03, 0.09, h * h);
  float tw = 0.55 + 0.45 * sin(t * (1.0 + h * 3.0) + h * 40.0);
  return step(0.86, h) * smoothstep(size, 0.0, d) * tw;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time;

  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  vec2 c = vec2(0.0, -0.04) + m * 0.12;          // glow centre leans toward pointer

  // Nebula flowing upward
  vec2 q = p * 1.6 + vec2(0.0, -t * 0.05);
  float n = fbm(q + fbm(q * 1.3 + t * 0.03));
  float neb = 0.55 + 0.45 * n;

  // Light beam (wider at the bottom), soft bloom and bright core
  float beamW = mix(0.10, 0.38, smoothstep(0.5, -0.6, p.y));
  float beam  = exp(-pow((p.x - c.x * 0.6) / beamW, 2.0)) * smoothstep(0.6, -0.5, p.y);
  float bloom = exp(-length((p - c) * vec2(1.0, 1.25)) * 3.0);
  float core  = exp(-length(p - c) * 8.0);
  float glow  = (beam * 0.85 + bloom * 0.85) * neb * (1.0 - u_scroll * 0.3);

  vec3 col = u_bg;
  col = mix(col, u_c1, clamp(glow * 1.25, 0.0, 1.0));
  col = mix(col, u_c2, clamp(glow * glow * 1.4, 0.0, 1.0));
  col = mix(col, u_c3, clamp(core * neb * 1.1, 0.0, 1.0));
  col = mix(col, u_c1, smoothstep(0.35, 0.95, n) * 0.22);   // faint wisps everywhere

  // Stars: two drifting background layers + dense particles rising inside the beam
  vec2 sp = uv * vec2(aspect, 1.0);
  float s = stars(sp + vec2(0.0, -t * 0.010 - u_scroll * 0.35), 16.0, t);
  s += stars(sp + vec2(3.1, -t * 0.022 - u_scroll * 0.7), 30.0, t * 1.3) * 0.7;
  s += stars(sp + vec2(7.0, -t * 0.07), 52.0, t * 2.0) * (beam + bloom) * 1.6;
  col = mix(col, u_star, clamp(s, 0.0, 1.0));

  // Vignette back into the page colour so edges stay calm behind text
  col = mix(col, u_bg, smoothstep(0.5, 1.2, length(p * vec2(0.8, 1.0))) * 0.75);

  gl_FragColor = vec4(col, 1.0);
}
`;

const PALETTES = {
  dark:  { bg: '#07050c', c1: '#2a0b52', c2: '#a33cff', c3: '#f5dcff', star: '#ffffff' },
  light: { bg: '#f1eee7', c1: '#ddd0ff', c2: '#a983ff', c3: '#6b3cff', star: '#4a2bd9' },
};

const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export function initFluid(canvas, { reducedMotion = false } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.style.background = 'radial-gradient(60% 70% at 50% 60%, #a33cff, #2a0b52 45%, #07050c 80%)'; return { setTheme() {} }; }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['u_res', 'u_time', 'u_mouse', 'u_scroll', 'u_bg', 'u_c1', 'u_c2', 'u_c3', 'u_star']
    .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  // Colours tween so theme switches melt; the first call snaps (no flash on load)
  const toRGB = (name) => Object.fromEntries(Object.entries(PALETTES[name] || PALETTES.dark).map(([k, v]) => [k, hex(v)]));
  let current = toRGB('dark');
  let target = current;
  let first = true;
  const setTheme = (name) => {
    target = toRGB(name);
    if (first) { current = toRGB(name); first = false; }
  };

  // Half resolution: the glow is soft, so this is invisible and much cheaper
  const SCALE = 0.5;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr * SCALE);
    canvas.height = Math.floor(innerHeight * dpr * SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  const mouse = [0.5, 0.5], aim = [0.5, 0.5];
  addEventListener('pointermove', (e) => { aim[0] = e.clientX / innerWidth; aim[1] = 1 - e.clientY / innerHeight; }, { passive: true });

  let scroll = 0;
  addEventListener('scroll', () => { scroll = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); }, { passive: true });

  const start = performance.now();
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(frame); });

  function frame(now) {
    const t = reducedMotion ? 8 : (now - start) / 1000;
    mouse[0] += (aim[0] - mouse[0]) * 0.04;
    mouse[1] += (aim[1] - mouse[1]) * 0.04;
    for (const k in current) current[k] = current[k].map((v, i) => v + (target[k][i] - v) * 0.05);

    gl.uniform2f(U.u_res, canvas.width, canvas.height);
    gl.uniform1f(U.u_time, t);
    gl.uniform2f(U.u_mouse, mouse[0], mouse[1]);
    gl.uniform1f(U.u_scroll, scroll);
    for (const k of ['bg', 'c1', 'c2', 'c3', 'star']) gl.uniform3fv(U['u_' + k], current[k]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (visible && !reducedMotion) requestAnimationFrame(frame);
    else if (reducedMotion) setTimeout(() => requestAnimationFrame(frame), 200); // still honours theme changes
  }
  requestAnimationFrame(frame);

  return { setTheme };
}
