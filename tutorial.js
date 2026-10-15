const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Moves boxes smoothly from their old to their new position (FLIP technique).
function snapshot(parents) {
  return parents.flatMap((parent) => [...parent.children].map((el) => [el, el.getBoundingClientRect()]));
}
function glide(before) {
  if (reducedMotion.matches) return;
  for (const [el, from] of before) {
    if (el.offsetParent === null) continue;
    const to = el.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 380, easing: 'ease-out' });
  }
}

// Interactive labs: controls set CSS on a target and a code panel shows the matching CSS.
for (const lab of document.querySelectorAll('.lab[data-lab]')) {
  const inputs = [...lab.querySelectorAll('[data-prop]')];
  const counters = [...lab.querySelectorAll('[data-count]')];
  const code = lab.querySelector('.lab-code code');
  const targets = [...lab.querySelectorAll('.lab-target')];
  for (const target of targets) {
    for (const part of (target.dataset.base || '').split(';')) {
      const [prop, ...rest] = part.split(':');
      if (prop && rest.length) target.style.setProperty(prop.trim(), rest.join(':').trim());
    }
  }
  const targetOf = (input) => (input.dataset.target ? lab.querySelector(input.dataset.target) : targets[0]);
  const valueOf = (input) => {
    if (input.type === 'checkbox') return input.checked ? input.dataset.on : (input.dataset.off || '');
    const raw = input.dataset.template ? input.dataset.template.replaceAll('{v}', input.value) : input.value + (input.dataset.unit || '');
    return raw;
  };
  const update = (animate) => {
    const before = animate ? snapshot(targets) : null;
    for (const input of inputs) {
      const target = targetOf(input);
      const value = valueOf(input);
      if (value) target.style.setProperty(input.dataset.prop, value);
      else target.style.removeProperty(input.dataset.prop);
      const out = input.parentElement.querySelector('output');
      if (out) out.textContent = input.type === 'range' ? valueOf(input) : '';
    }
    for (const counter of counters) {
      const target = lab.querySelector(counter.dataset.target) || targets[0];
      [...target.children].forEach((child, i) => { child.hidden = i >= Number(counter.value); });
      const out = counter.parentElement.querySelector('output');
      if (out) out.textContent = counter.value;
    }
    if (code) {
      const blocks = new Map();
      for (const target of targets) {
        const sel = target.dataset.selector;
        if (sel) blocks.set(sel, (target.dataset.base || '').split(';').map((s) => s.trim()).filter(Boolean).map((s) => `${s};`));
      }
      for (const input of inputs) {
        const value = valueOf(input);
        if (!value || input.dataset.hide !== undefined) continue;
        const sel = input.dataset.codeSelector || targetOf(input).dataset.selector;
        if (!blocks.has(sel)) blocks.set(sel, []);
        blocks.get(sel).push(`${input.dataset.codeProp || input.dataset.prop}: ${value};`);
      }
      code.textContent = [...blocks].map(([sel, lines]) => `${sel} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`).join('\n\n');
    }
    if (before) glide(before);
  };
  lab.addEventListener('input', () => update(true));
  lab.addEventListener('change', () => update(true));
  lab.querySelector('[data-lab-reset]')?.addEventListener('click', () => {
    for (const input of [...inputs, ...counters]) {
      if (input.type === 'checkbox') input.checked = input.defaultChecked;
      else if (input.tagName === 'SELECT') input.selectedIndex = Math.max(0, [...input.options].findIndex((o) => o.defaultSelected));
      else input.value = input.defaultValue;
    }
    update(true);
  });
  update(false);
}

// Responsive lab: a slider changes the pretend screen width, and the matching media queries light up.
for (const lab of document.querySelectorAll('.lab[data-bp]')) {
  const slider = lab.querySelector('input[type="range"]');
  const stage = lab.querySelector('.bp-stage');
  const frame = lab.querySelector('.bp-frame');
  const grid = lab.querySelector('.bp-grid');
  const readout = lab.querySelector('.bp-readout');
  const bar = lab.querySelector('.bp-bar b');
  const marks = [...lab.querySelectorAll('pre [data-min]')];
  const breaks = lab.dataset.bp.split(',').map(Number);
  const cols = lab.dataset.cols.split('|');
  let last = -1;
  const draw = (animate) => {
    const width = Number(slider.value);
    const level = breaks.filter((b) => width >= b).length;
    const before = animate && level !== last ? snapshot([grid]) : null;
    const scale = Math.min(1, stage.clientWidth / (width + 8));
    frame.style.width = `${width}px`;
    frame.style.transform = `scale(${scale})`;
    grid.style.gridTemplateColumns = cols[level];
    stage.style.height = `${frame.offsetHeight * scale + 16}px`;
    marks.forEach((m) => m.classList.toggle('on', width >= Number(m.dataset.min)));
    const out = slider.parentElement.querySelector('output');
    if (out) out.textContent = `${width}px`;
    if (bar) bar.textContent = `${width}px wide`;
    if (readout) readout.textContent = `At ${width}px: ${level + 1 === 1 ? 'the base rule gives' : 'a media query gives'} ${lab.dataset.labels.split(',')[level]}.`;
    if (before) glide(before);
    last = level;
  };
  slider.addEventListener('input', () => draw(true));
  window.addEventListener('resize', () => draw(false));
  draw(false);
}

// Live editors: type HTML/CSS and see the result straight away. Scripts are blocked in the result,
// except a tiny helper for form editors: the submit event only fires once the browser's own checks pass.
// Both boxes grow to fit their content, so nothing scrolls separately from the page.
const FORM_SCRIPT = '<script>document.addEventListener("submit",function(e){e.preventDefault();var p=document.getElementById("ok");if(!p){p=document.createElement("p");p.id="ok";p.style.cssText="margin-top:1rem;padding:.6rem;border-radius:6px;background:#e4f3ed;color:#00502a;font-weight:700";document.body.appendChild(p);}p.textContent="\\u2713 All checks passed. A real site would send the data now.";});'
  + 'function send(){parent.postMessage({liveHeight:document.body.offsetHeight+24},"*");}'
  + 'addEventListener("DOMContentLoaded",function(){new ResizeObserver(send).observe(document.body);send();});</script>';
for (const live of document.querySelectorAll('[data-live]')) {
  const area = live.querySelector('textarea');
  const frame = live.querySelector('iframe');
  const isForm = live.hasAttribute('data-forms');
  const start = area.value;
  const base = '<!doctype html><meta charset="utf-8"><style>body{font:16px/1.5 system-ui,sans-serif;margin:12px;color:#182b3a}' + (live.dataset.css || '') + '</style>'
    + (isForm ? FORM_SCRIPT : '');
  frame.removeAttribute('style');
  area.removeAttribute('style');
  frame.setAttribute('sandbox', isForm ? 'allow-scripts allow-forms' : 'allow-same-origin');
  const fitText = () => { area.style.height = 'auto'; area.style.height = `${area.scrollHeight + 2}px`; };
  const fitFrame = (height) => { frame.style.height = `${Math.max(120, height)}px`; };
  let timer;
  const render = () => { frame.srcdoc = base + area.value; };
  frame.addEventListener('load', () => {
    if (!isForm) {
      const body = frame.contentDocument?.body;
      if (body) fitFrame(body.offsetHeight + 24);
    }
  });
  window.addEventListener('message', (event) => {
    if (isForm && event.source === frame.contentWindow && event.data && event.data.liveHeight) fitFrame(event.data.liveHeight);
  });
  area.addEventListener('input', () => { fitText(); clearTimeout(timer); timer = setTimeout(render, 150); });
  window.addEventListener('resize', fitText);
  live.querySelector('[data-reset]')?.addEventListener('click', () => { area.value = start; fitText(); render(); });
  fitText();
  render();
}

const lessonMenu = document.querySelector('.lesson-menu');
if (lessonMenu) {
  const smallScreen = window.matchMedia('(max-width: 800px)');
  const setMenuDefault = () => { lessonMenu.open = !smallScreen.matches; };
  setMenuDefault();
  smallScreen.addEventListener('change', setMenuDefault);
}

// Local practice checks: no scores, personal data or network requests.
for (const quiz of document.querySelectorAll('.quiz')) {
  const options = [...quiz.querySelectorAll('.quiz-option')];
  const feedback = quiz.querySelector('.quiz-feedback');
  for (const option of options) {
    option.disabled = false;
    option.addEventListener('click', () => {
      for (const other of options) other.setAttribute('aria-pressed', String(other === option));
      feedback.textContent = option.dataset.feedback;
      feedback.dataset.result = option.dataset.correct === 'true' ? 'correct' : 'retry';
    });
  }
}
