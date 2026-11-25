/* Values transcribe the paper tables and Appendix D raised-plug results.
   The original tables remain the default view and the no-JavaScript fallback. */
(() => {
  'use strict';

  const experiment = document.getElementById('experiment');
  if (!experiment || document.getElementById('experiment-view-toggle')) return;

  const COLORS = ['blue', 'lilac', 'slate', 'amber', 'rose'];
  const models = ['π₀.₅', 'π-Mem', 'MemoryVLA', 'ForceVLA', 'TA-VLA', 'M²AdaptVLA (ours)'];
  const safeMetrics = [
    { key: 10, label: 'Mean stage success', note: 'Mean over all nine stages' },
    { key: 9, label: 'Keypad press success', note: 'Mean over the five keypad stages' },
    { key: 0, label: 'Grasp key' }, { key: 1, label: 'Insert key' },
    { key: 2, label: 'Keypad · 1' }, { key: 3, label: 'Keypad · 3' },
    { key: 4, label: 'Keypad · 7' }, { key: 5, label: 'Keypad · 9' },
    { key: 6, label: 'Keypad · B' }, { key: 7, label: 'Turn key' },
    { key: 8, label: 'Retrieve object' }
  ].map(metric => ({ ...metric, unit: '%', scale: 100, precision: 1 }));

  const taskData = [
    { label: 'Eight-task mean', values: [33.75, 51.25, 33.33, 44.79, 38.75, 82.71], precision: 2 },
    { label: 'Open Safe', values: [0, 0, 26.7, 3.3, 0, 66.7], demos: 2011, trials: 30 },
    { label: 'USB-C Insertion and Removal', values: [25, 30, 15, 50, 40, 65], demos: 454, trials: 20 },
    { label: 'Insert Plug', values: [55, 70, 15, 85, 90, 100], demos: 500, trials: 20 },
    { label: 'Unplug', values: [100, 90, 95, 100, 100, 100], demos: 500, trials: 20 },
    { label: 'Wipe Board', values: [30, 45, 0, 50, 45, 100], demos: 500, trials: 20 },
    { label: 'OpenDrawerMem', values: [40, 75, 50, 50, 25, 90], demos: 627, trials: 20 },
    { label: 'Button Sequence', values: [0, 55, 55, 0, 0, 80], demos: 829, trials: 20 },
    { label: 'Double Press', values: [20, 45, 10, 20, 10, 60], demos: 532, trials: 20 }
  ];
  // Columns: grasp, insert, keypad 1/3/7/9/B, turn, retrieve, press mean, stage mean.
  const visualRows = [
    { name: 'Frame Bank', values: [96.7, 21.7, 31.7, 35, 35, 33.3, 35, 90, 96.7, 34, 52.8] },
    { name: 'RoboTTT-style', values: [96.7, 33.3, 20, 23.3, 10, 3.3, 6.7, 83.3, 93.3, 12.7, 41.1] },
    { name: 'GDN', values: [100, 6.7, 30, 70, 20, 18.3, 36.7, 100, 100, 35, 53.5] },
    { name: 'TTT only', values: [100, 70, 31.7, 43.3, 20, 23.3, 31.7, 100, 100, 30, 57.8] },
    { name: 'TTT bank (ours)', ours: true, values: [91.7, 70, 73.3, 73.3, 71.7, 61.7, 68.3, 91.7, 88.3, 69.7, 76.7] }
  ];
  const recallRows = [
    { name: 'Frame Bank', values: [70, 50] },
    { name: 'TTT only', values: [75, 55] },
    { name: 'RoboTTT-style', values: [55, 60] },
    { name: 'GDN', values: [55, 55] },
    { name: 'TTT bank (ours)', ours: true, values: [90, 80] }
  ];
  const injectionRows = [
    { name: 'VLM input', values: [91.7, 53.3, 8.3, 15, 3.3, 0, 0, 18.3, 93.3, 5.3, 31.5] },
    { name: 'Action expert input', values: [100, 51.7, 68.3, 61.7, 71.7, 63.3, 38.3, 85, 85, 60.7, 69.4] },
    { name: 'GCA', values: [98.3, 38.3, 21.7, 41.7, 18.3, 23.3, 21.7, 88.3, 85, 25.3, 48.5] },
    { name: 'Context gate (ours)', ours: true, values: [93.3, 75, 73.3, 76.7, 71.7, 63.3, 70, 98.3, 95, 71, 79.6] }
  ];
  const predictionRows = [
    { name: 'Without prediction', values: [93.3, 75, 73.3, 76.7, 71.7, 63.3, 70, 98.3, 95, 71, 79.6] },
    { name: 'With prediction (ours)', ours: true, values: [98.3, 76.7, 75, 76.7, 80, 70, 76.7, 98.3, 98.3, 75.7, 83.3] }
  ];
  const adaptationRows = [
    { name: 'Fixed policy', values: [90, 80, 85, 0, null] },
    { name: 'LoRA 1–4 (ours)', ours: true, values: [100, 95, 97.5, 3.18, 159.5], deltas: [11.1, 18.8, 14.7] },
    { name: 'LoRA 1–24', values: [80, 95, 87.5, 19.08, 267.7], deltas: [-11.1, 18.8, 2.9] }
  ];
  const adaptationMetrics = [
    { key: 2, label: 'Mean success', unit: '%', scale: 100, precision: 1 },
    { key: 0, label: 'Board raised', unit: '%', scale: 100 },
    { key: 1, label: 'Flipped, rear edge raised', unit: '%', scale: 100 },
    { key: 3, label: 'Trainable parameters', unit: 'M', scale: 20, precision: 2 },
    { key: 4, label: 'Time per update', unit: 'ms', scale: 300, precision: 1 }
  ];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function formatted(value, metric) {
    if (value === null) return 'n/a';
    const number = metric.precision === undefined ? String(value) : value.toFixed(metric.precision);
    return number + (metric.unit === '%' ? '%' : ' ' + metric.unit);
  }
  function valueBars(rows, metric) {
    const list = element('ul', 'ex-viz-bars');
    rows.forEach((row, index) => {
      const value = row.value !== undefined ? row.value : row.values[metric.key];
      const item = element('li', 'ex-viz-row' + (row.ours ? ' ex-viz-ours' : ''));
      const labels = element('div', 'ex-viz-row-labels');
      labels.append(element('span', 'ex-viz-model', row.name));
      const numbers = element('span', 'ex-viz-numbers');
      numbers.append(element('strong', 'ex-viz-value', formatted(value, metric)));
      if (row.deltas && row.deltas[metric.key] !== undefined) {
        const delta = row.deltas[metric.key];
        numbers.append(element('span', 'ex-viz-delta', `Δ ${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(1)}%`));
      }
      labels.append(numbers);
      item.append(labels);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 10');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('ex-viz-track');
      const background = document.createElementNS(svg.namespaceURI, 'rect');
      background.setAttribute('width', '100'); background.setAttribute('height', '10'); background.setAttribute('rx', '1.5');
      background.classList.add('ex-viz-track-bg');
      svg.append(background);
      if (value !== null) {
        const rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', String(Math.max(0, Math.min(100, value / metric.scale * 100))));
        rect.setAttribute('height', '10'); rect.setAttribute('rx', '1.5');
        rect.classList.add('ex-viz-fill', 'ex-viz-' + (row.ours ? 'teal' : COLORS[index % COLORS.length]));
        svg.append(rect);
      }
      item.append(svg);
      list.append(item);
    });
    return list;
  }
  function scale(metric) {
    const node = element('div', 'ex-viz-scale');
    node.setAttribute('aria-hidden', 'true');
    node.append(element('span', '', '0'), element('span', '', String(metric.scale / 2)), element('span', '', metric.scale + (metric.unit === '%' ? '%' : ' ' + metric.unit)));
    return node;
  }
  function card(title, rows, metric, note) {
    const node = element('section', 'ex-viz-card');
    node.append(element('h5', 'ex-viz-card-title', title));
    if (note) node.append(element('p', 'ex-viz-note', note));
    node.append(valueBars(rows, metric), scale(metric));
    return node;
  }
  function summary(items) {
    const node = element('div', 'ex-viz-summary');
    for (const item of items) {
      const metric = element('div', 'ex-viz-stat');
      metric.append(element('span', 'ex-viz-stat-label', item.label), element('strong', 'ex-viz-stat-value', item.value), element('span', 'ex-viz-stat-note', item.note));
      node.append(metric);
    }
    return node;
  }
  function selector(id, title, options, initial, onChange) {
    const field = element('div', 'ex-viz-field');
    const label = element('label', 'ex-viz-select-label', title);
    label.htmlFor = id;
    const wrapper = element('div', 'ex-viz-select-wrap');
    const select = element('select', 'ex-viz-select');
    select.id = id;
    options.forEach((option, index) => {
      const optionNode = element('option', '', option.label);
      optionNode.value = String(index);
      optionNode.selected = index === initial;
      select.append(optionNode);
    });
    select.addEventListener('change', () => onChange(Number(select.value)));
    wrapper.append(select); field.append(label, wrapper);
    return field;
  }

  const pairs = [];
  function mount(imageName, title, builder) {
    const img = experiment.querySelector(`img[src="assets/figures/${imageName}"]`);
    if (!img) return;
    const table = img.closest('.image-section');
    mountTable(table, 'chart-' + imageName.replace('.webp', ''), title, builder);
  }
  function mountTable(table, id, title, builder) {
    if (!table) return;
    const chart = element('div', 'ex-viz');
    chart.id = id;
    chart.setAttribute('role', 'group');
    chart.setAttribute('aria-label', title);
    chart.hidden = true;
    builder(chart);
    table.after(chart);
    pairs.push({ table, chart });
  }

  mount('table-1.webp', 'Success rates across eight real-robot tasks', chart => {
    chart.append(summary([
      { label: 'Eight-task mean', value: '82.71%', note: 'M²AdaptVLA' },
      { label: 'Above the strongest baseline', value: '+31.46 pp', note: 'Absolute gain over π-Mem' },
      { label: 'Task results', value: '7 first · 1 tied', note: 'Across eight real-robot tasks' }
    ]));
    const content = element('div', 'ex-viz-chart-content');
    content.setAttribute('aria-live', 'polite');
    function render(index) {
      const task = taskData[index];
      const metric = { unit: '%', scale: 100, precision: task.precision };
      const rows = models.map((name, i) => ({ name, value: task.values[i], ours: i === 5 }));
      const note = index === 0 ? 'Whole-task success · mean over eight tasks' : `Whole-task success · ${task.trials} trials per policy · ${task.demos.toLocaleString('en-US')} demonstrations`;
      content.replaceChildren(card(task.label, rows, metric, note));
    }
    chart.append(selector('ex-task', 'Task', taskData, 0, render), content);
    render(0);
  });

  mount('table-2-visual.webp', 'Open Safe visual memory ablations by stage', chart => {
    chart.append(summary([
      { label: 'TTT bank · keypad presses', value: '69.7%', note: 'Five keypad stages' },
      { label: 'Compared with GDN', value: '+34.7 pp', note: '69.7% vs. 35.0% press success' }
    ]));
    const content = element('div', 'ex-viz-chart-content');
    content.setAttribute('aria-live', 'polite');
    function render(index) {
      const metric = safeMetrics[index];
      content.replaceChildren(card(metric.label, visualRows, metric, (metric.note || 'Stage success') + ' · 60 trials per stage and variant'));
    }
    chart.append(selector('ex-visual-stage', 'Open Safe metric', safeMetrics, 1, render), content);
    render(1);
  });

  mount('table-3.webp', 'Visual memory for drawer recall and button following', chart => {
    const grid = element('div', 'ex-viz-card-grid');
    grid.append(
      card('OpenDrawerMem', recallRows, { key: 0, unit: '%', scale: 100 }, 'Initial-scene recall · 20 trials per variant'),
      card('Button Sequence', recallRows, { key: 1, unit: '%', scale: 100 }, 'Demonstration following · 20 trials per variant')
    );
    chart.append(grid);
  });

  mount('table-2-wrench.webp', 'Wrench history injection and future prediction ablations', chart => {
    chart.append(summary([
      { label: 'Context gate · mean stage success', value: '79.6%', note: '+10.2 pp over action expert input' },
      { label: 'With future wrench prediction', value: '83.3%', note: '+3.7 pp mean stage success' }
    ]));
    const content = element('div', 'ex-viz-chart-content');
    content.setAttribute('aria-live', 'polite');
    function render(index) {
      const metric = safeMetrics[index];
      const grid = element('div', 'ex-viz-card-grid');
      grid.append(
        card('Wrench history injection', injectionRows, metric, 'TTT bank fixed · ' + metric.label.toLowerCase()),
        card('Future wrench prediction', predictionRows, metric, 'TTT bank + context gate · ' + metric.label.toLowerCase())
      );
      content.replaceChildren(grid, element('p', 'ex-viz-footnote', (metric.note || 'Stage success') + ' · 60 trials per stage and variant.'));
    }
    chart.append(selector('ex-wrench-stage', 'Open Safe metric', safeMetrics, 0, render), content);
    render(0);
  });

  mount('table-4.webp', 'Predictive test-time adaptation under contact shifts', chart => {
    chart.append(summary([
      { label: 'Four-layer adaptation', value: '97.5%', note: 'Mean success across both contact shifts' },
      { label: 'Compared with the fixed policy', value: '+12.5 pp', note: '14.7% relative improvement' },
      { label: 'Time per update', value: '159.5 ms', note: 'LoRA 1–4 · one RTX 5090' }
    ]));
    const content = element('div', 'ex-viz-chart-content');
    content.setAttribute('aria-live', 'polite');
    function render(index) {
      const metric = adaptationMetrics[index];
      const note = metric.key < 3 ? 'Whole-task success · 20 trials per policy and condition' : metric.key === 3 ? 'Trainable LoRA parameters · lower is smaller' : 'Online update latency on one RTX 5090 · lower is faster';
      const explanation = metric.key < 3 ? 'Δ denotes relative change from the fixed policy.' : metric.key === 4 ? 'The fixed policy performs no online update (n/a).' : 'Both LoRA variants cover the corresponding VLM and action-expert layers.';
      content.replaceChildren(card(metric.label, adaptationRows, metric, note), element('p', 'ex-viz-footnote', explanation));
    }
    chart.append(selector('ex-adaptation-metric', 'Wipe Board metric', adaptationMetrics, 0, render), content);
    render(0);
  });

  mountTable(experiment.querySelector('#raised-plug-table'), 'chart-raised-plug', 'Plug insertion with a raised power strip', chart => {
    chart.append(summary([
      { label: 'Four-layer adaptation', value: '85%', note: '17 successful trials out of 20' },
      { label: 'Compared with the fixed policy', value: '+10 pp', note: '13.3% relative improvement' }
    ]));
    chart.append(card('Raised power strip', [
      { name: 'Fixed policy', values: [75] },
      { name: 'LoRA 1–4 (ours)', ours: true, values: [85], deltas: [13.3] },
      { name: 'LoRA 1–24', values: [70], deltas: [-6.7] }
    ], { key: 0, unit: '%', scale: 100 }, 'Whole-task success · 20 trials per policy'));
    chart.append(element('p', 'ex-viz-footnote', 'Δ denotes relative change from the fixed policy. Success requires fully inserting and releasing the plug.'));
  });

  if (!pairs.length) return;
  const controls = element('div', 'experiment-view-controls');
  const description = element('span', 'experiment-view-label', 'Results view');
  const toggle = element('button', 'experiment-view-toggle', 'View charts');
  toggle.id = 'experiment-view-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('aria-controls', pairs.map(pair => pair.chart.id).join(' '));
  const status = element('span', 'ex-viz-status', 'Showing original tables');
  status.setAttribute('role', 'status');
  controls.append(description, toggle, status);
  const heading = document.getElementById('experiment-heading');
  if (heading) heading.after(controls); else experiment.prepend(controls);
  function setResultsView(showCharts) {
    toggle.setAttribute('aria-pressed', String(showCharts));
    toggle.textContent = showCharts ? 'View tables' : 'View charts';
    status.textContent = showCharts ? 'Showing interactive charts' : 'Showing original tables';
    pairs.forEach(pair => { pair.table.hidden = showCharts; pair.chart.hidden = !showCharts; });
  }
  toggle.addEventListener('click', () => setResultsView(toggle.getAttribute('aria-pressed') !== 'true'));
  // Always begin with the paper tables, including a page restored from the back-forward cache.
  setResultsView(false);
  window.addEventListener('pageshow', () => setResultsView(false));
})();
