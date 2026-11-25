/* The paper image is unchanged. Signals illustrate existing directed edges only. */
(() => {
  'use strict';
  const slot = document.querySelector('#method figure .image-section');
  const original = slot && slot.querySelector('img');
  if (!slot || !original || slot.querySelector('.method-flow')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const imageURL = original.getAttribute('src');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    { label: 'TTT bank', duration: 7200, box: '0 0 1210 840',
      title: 'Write visual memory',
      note: 'Current features update the fast weights and combine with their readout. The new bank entry is first read at the next decision.' },
    { label: 'Context gate', duration: 8600, box: '1250 0 1250 870',
      title: 'Aggregate context and wrench history',
      note: 'At decision t, the policy reads the previous bank and current views. VLM context and TCN memory gate the expert’s wrench residual.' },
    { label: 'Online adaptation', duration: 10000, box: '0 875 2500 380',
      title: 'Adapt through the final denoising step',
      note: 'Measured wrench feedback updates LoRA in layers 1–4. Earlier denoising states are detached; the base weights stay frozen.' }
  ];
  const total = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const root = document.createElement('div');
  root.className = 'method-flow';
  root.setAttribute('aria-label', 'Animated M²AdaptVLA information flow');

  function element(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function svgElement(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  const toolbar = element('div', { class: 'mf-toolbar' });
  const tabs = element('div', { class: 'mf-tabs', role: 'group', 'aria-label': 'Architecture views' });
  const tabButtons = ['Overview', ...scenes.map(scene => scene.label)].map((label, index) => {
    const button = element('button', { type: 'button', 'aria-pressed': String(index === 0) }, label);
    tabs.append(button);
    button.addEventListener('click', () => selectView(index - 1));
    return button;
  });
  const playback = element('div', { class: 'mf-playback', role: 'group', 'aria-label': 'Animation playback' });
  const playButton = element('button', { type: 'button' }, reduced.matches ? 'Play' : 'Pause');
  const replayButton = element('button', { type: 'button' }, 'Replay');
  playback.append(playButton, replayButton);
  toolbar.append(tabs, playback);

  const canvas = element('div', { class: 'mf-canvas' });
  const svg = svgElement('svg', { class: 'mf-svg', viewBox: '0 0 2500 1255', role: 'img', 'aria-labelledby': 'mf-title mf-desc' });
  const title = svgElement('title', { id: 'mf-title' });
  title.textContent = 'M²AdaptVLA architecture with animated information flow';
  const description = svgElement('desc', { id: 'mf-desc' });
  description.textContent = 'Blue signals encode current views; teal signals write visual memory for the next decision. Gold signals carry wrench history through a context gate. Rose signals update low-rank adapters by replaying only the final denoising step. Select a module above to enlarge it.';
  const raster = svgElement('image', { href: imageURL, x: 0, y: 0, width: 2500, height: 1255 });
  svg.append(title, description, raster);

  // Signal paths follow the arrows in the original image, in its native coordinates.
  // Each interval is local to its explanatory scene, not a claim about runtime latency.
  const paths = [];
  function signal(scene, tone, d, start, end, passes = 1) {
    const line = svgElement('path', { d, class: `mf-signal mf-tone-${tone}`, opacity: 0 });
    const halo = svgElement('circle', { r: 13, class: 'mf-halo', opacity: 0 });
    const point = svgElement('circle', { r: 8, class: `mf-particle mf-tone-${tone}`, opacity: 0 });
    svg.append(line, halo, point);
    paths.push({ scene, line, halo, point, start, end, passes, length: 0 });
  }
  // Visual write: current frame and fast-weight readout meet only at the residual sum.
  signal(0, 'blue', 'M704 229H750 M897 229H948', .02, .22);
  signal(0, 'blue', 'M1023 251V298Q1023 360 961 360H509Q473 360 473 400V475', .18, .41);
  signal(0, 'teal', 'M290 511H353', .27, .42);
  signal(0, 'teal', 'M591 511H641', .42, .52);
  signal(0, 'teal', 'M771 511H847', .53, .66);
  signal(0, 'teal', 'M1027 511H1053', .66, .76);
  signal(0, 'blue', 'M1077 251V486', .38, .75);
  signal(0, 'teal', 'M1077 536V666', .76, .97);
  // Policy aggregation: the visual input here is the previous bank, not the new write.
  signal(1, 'teal', 'M1322 152V162H1584V184', .00, .18);
  signal(1, 'blue', 'M1495 152V162H1584V184', .00, .18);
  signal(1, 'blue', 'M1570 335V374', .18, .32);
  signal(1, 'purple', 'M2172 152V184 M2166 335V374', .06, .32);
  signal(1, 'amber', 'M1548 788H1596 M1750 788H1810', .00, .23);
  signal(1, 'amber', 'M1867 773V540H2096', .20, .53);
  signal(1, 'amber', 'M1867 773V540H1802', .20, .51);
  signal(1, 'blue', 'M1664 435V510', .32, .51);
  signal(1, 'purple', 'M2357 335V511', .32, .54);
  signal(1, 'amber', 'M1767 513V500Q1767 478 1789 478H2054V585Q2054 607 2077 607H2124', .52, .73);
  signal(1, 'amber', 'M2145 570V585', .55, .72);
  signal(1, 'amber', 'M2166 607H2328', .73, .86);
  signal(1, 'blue', 'M2275 435V452Q2275 474 2297 474H2420V585Q2420 607 2398 607H2370', .45, .85);
  signal(1, 'purple', 'M2348 628V659 M2182 708V756 M2182 810V826', .86, .99);
  // Denoising is iterative; the feedback gradient reaches only the final replay.
  signal(2, 'blue', 'M154 1028H207', .00, .08);
  signal(2, 'blue', 'M522 1028H568V1090Q568 1128 529 1128H338Q299 1128 299 1089V1068', .08, .34, 2);
  signal(2, 'blue', 'M568 1028H649', .34, .43);
  signal(2, 'blue', 'M999 1028H1040V980H1091', .43, .56);
  signal(2, 'blue', 'M999 1028H1040V1074H1091', .43, .56);
  signal(2, 'blue', 'M1379 980H1475', .56, .66);
  signal(2, 'blue', 'M1379 1074H1475', .56, .68);
  signal(2, 'amber', 'M1617 1009V1044', .66, .73);
  signal(2, 'rose', 'M1617 1105V1115Q1617 1148 1584 1148H908Q871 1148 871 1111V1084', .73, .88);
  signal(2, 'rose', 'M748 1084V1185Q748 1223 786 1223H1877Q1913 1223 1913 1187V1004Q1913 985 1933 985H1948', .88, .99);
  signal(2, 'rose', 'M1913 1074H1948', .95, .99);

  // Highlight only an existing module boundary; no added computational edges.
  const outlines = [
    svgElement('rect', { x: 28, y: 637, width: 1174, height: 194, rx: 21, class: 'mf-module-outline mf-tone-teal' }),
    svgElement('rect', { x: 1518, y: 504, width: 289, height: 73, rx: 34, class: 'mf-module-outline mf-tone-amber' }),
    svgElement('rect', { x: 644, y: 967, width: 361, height: 121, rx: 20, class: 'mf-module-outline mf-tone-rose' })
  ];
  outlines.forEach(outline => svg.append(outline));
  canvas.append(svg);
  const progress = svgElement('svg', { class: 'mf-progress', viewBox: '0 0 1000 3', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  const progressRect = svgElement('rect', { x: 0, y: 0, width: 0, height: 3 });
  progress.append(progressRect);
  const footer = element('div', { class: 'mf-footer' });
  const status = element('p', { class: 'mf-status' });
  const statusTitle = element('strong');
  const statusText = document.createTextNode('');
  status.append(statusTitle, document.createTextNode(' — '), statusText);
  const originalLink = element('a', { class: 'mf-original', href: imageURL, target: '_blank', rel: 'noopener' }, 'Paper figure');
  footer.append(status, originalLink);
  root.append(toolbar, canvas, progress, footer);
  slot.replaceChildren(root);
  paths.forEach(path => { path.length = path.line.getTotalLength(); });

  let selected = -1;
  let elapsed = 0;
  let previous = null;
  let playing = !reduced.matches;
  let inView = false;
  let frame = null;
  let currentScene = -1;
  function selectView(scene) {
    selected = scene;
    root.dataset.view = String(scene);
    elapsed = 0;
    previous = null;
    svg.setAttribute('viewBox', scene < 0 ? '0 0 2500 1255' : scenes[scene].box);
    tabButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === scene + 1)));
    render();
    schedule();
  }
  function render() {
    let scene = selected;
    let local = elapsed;
    if (selected < 0) {
      local %= total;
      scene = 0;
      while (local >= scenes[scene].duration) local -= scenes[scene++].duration;
    } else local %= scenes[scene].duration;
    const fraction = local / scenes[scene].duration;
    if (scene !== currentScene) {
      currentScene = scene;
      root.dataset.scene = String(scene);
      statusTitle.textContent = scenes[scene].title;
      statusText.nodeValue = scenes[scene].note;
      outlines.forEach((outline, index) => outline.setAttribute('visibility', index === scene ? 'visible' : 'hidden'));
    }
    progressRect.setAttribute('width', String(fraction * 1000));
    paths.forEach(path => {
      const active = path.scene === scene && fraction >= path.start && fraction <= path.end;
      path.line.setAttribute('opacity', active ? '.45' : '0');
      path.halo.setAttribute('visibility', active ? 'visible' : 'hidden');
      path.point.setAttribute('visibility', active ? 'visible' : 'hidden');
      if (active) {
        const distance = (((fraction - path.start) / (path.end - path.start)) * path.passes) % 1;
        const position = path.line.getPointAtLength(distance * path.length);
        [path.halo, path.point].forEach(point => {
          point.setAttribute('cx', String(position.x));
          point.setAttribute('cy', String(position.y));
          point.setAttribute('opacity', '1');
        });
      }
    });
  }
  function tick(now) {
    frame = null;
    if (!playing || !inView || document.hidden) { previous = null; return; }
    if (previous !== null) elapsed += Math.min(now - previous, 100);
    previous = now;
    render();
    schedule();
  }
  function schedule() {
    if (playing && inView && !document.hidden && frame === null) frame = requestAnimationFrame(tick);
  }
  function setPlaying(value) {
    playing = value;
    previous = null;
    playButton.textContent = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-label', playing ? 'Pause information-flow animation' : 'Play information-flow animation');
    if (!playing && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    schedule();
  }
  playButton.addEventListener('click', () => setPlaying(!playing));
  replayButton.addEventListener('click', () => { elapsed = 0; render(); setPlaying(true); });
  document.addEventListener('visibilitychange', () => { previous = null; schedule(); });
  reduced.addEventListener('change', event => { if (event.matches) setPlaying(false); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      previous = null;
      schedule();
    }, { rootMargin: '80px' });
    observer.observe(root);
  } else inView = true;
  render();
  setPlaying(playing);
})();
