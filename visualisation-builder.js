/* ============================================================
   REPORTR — Visualisation Builder
   visualisation-builder.js
   ============================================================ */

/* ── PALETTES ──────────────────────────────────────────────── */

const PALETTES = {
  default:   ['#16A34A','#06B6D4','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6'],
  warm:      ['#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#22C55E','#10B981','#14B8A6'],
  cool:      ['#06B6D4','#3B82F6','#6366F1','#8B5CF6','#A855F7','#EC4899','#64748B','#0EA5E9'],
  monochrome:['#1E293B','#334155','#475569','#64748B','#94A3B8','#CBD5E1','#E2E8F0','#F1F5F9'],
};

let activePalette = PALETTES.default;

/* ── MOCK DATA ─────────────────────────────────────────────── */

const DATASETS = {
  orders: {
    label: 'Order Revenue',
    dims:  [{v:'product_category',l:'Product Category'},{v:'region',l:'Region'},{v:'order_month',l:'Order Month'},{v:'status',l:'Order Status'},{v:'customer_name',l:'Customer Name'}],
    msrs:  [{v:'revenue',l:'Revenue (Sum)'},{v:'quantity',l:'Quantity (Sum)'},{v:'orders',l:'Order Count'},{v:'discount',l:'Avg Discount'}],
  },
  customers: {
    label: 'Customer Segments',
    dims:  [{v:'segment',l:'Segment'},{v:'country',l:'Country'},{v:'signup_year',l:'Signup Year'}],
    msrs:  [{v:'ltv',l:'LTV (Avg)'},{v:'cust_count',l:'Customer Count'},{v:'orders_per_cust',l:'Orders / Customer'}],
  },
  campaigns: {
    label: 'Marketing Campaigns',
    dims:  [{v:'channel',l:'Channel'},{v:'campaign',l:'Campaign'},{v:'month',l:'Month'}],
    msrs:  [{v:'spend',l:'Spend (Sum)'},{v:'impressions',l:'Impressions'},{v:'conversions',l:'Conversions'},{v:'cpa',l:'CPA (Avg)'}],
  },
};

const CHART_DATA = {
  bar: {
    orders: {
      product_category: {
        labels: ['Electronics','Furniture','Software','Office Supplies','Other'],
        datasets: [{ label:'Revenue',data:[482350,234100,187900,98400,43200] }],
      },
      order_month: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{ label:'Revenue', data:[89000,102000,134000,118000,156000,143000,178000,160000,142000,188000,210000,195000] }],
      },
      region: {
        labels: ['EMEA','NAM','APAC','LATAM'],
        datasets: [{ label:'Revenue', data:[412000,356000,189000,89000] }],
      },
    },
  },
  pie: {
    orders: {
      product_category: {
        labels: ['Electronics','Furniture','Software','Office Supplies','Other'],
        data:   [482350,234100,187900,98400,43200],
      },
      region: {
        labels: ['EMEA','NAM','APAC','LATAM'],
        data:   [412000,356000,189000,89000],
      },
      status: {
        labels: ['Delivered','Processing','Returned','Cancelled'],
        data:   [8204,2847,1043,753],
      },
    },
  },
  line: {
    orders: {
      order_month: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{ label:'Revenue', data:[89000,102000,134000,118000,156000,143000,178000,160000,142000,188000,210000,195000] }],
      },
    },
  },
};

const TABLE_DATA = {
  orders: {
    cols: ['Order ID','Customer','Category','Date','Region','Status','Revenue'],
    rows: [
      [10821,'Helena Marsh','Electronics','2025-11-03','EMEA','Delivered','$1,249'],
      [10822,'James Okafor','Furniture','2025-11-03','NAM','Delivered','$399'],
      [10823,'Helena Marsh','Software','2025-11-04','EMEA','Delivered','$267'],
      [10824,'Riya Kapoor','Electronics','2025-11-04','APAC','Returned','$749'],
      [10825,'Miguel Ferreira','Office Supplies','2025-11-05','EMEA','Delivered','$312'],
      [10826,'Sara Chen','Electronics','2025-11-05','APAC','Delivered','$2,199'],
    ],
  },
};

/* ── STATE ─────────────────────────────────────────────────── */

let state = {
  dataset:     'orders',
  type:        'bar',
  dimField:    'product_category',
  msrField:    'revenue',
  dim2:        null,
  stacking:    'none',
  orientation: 'vertical',
  donut:       false,
  maxSlices:   8,
  showLabels:  true,
  showLegend:  true,
  showGrid:    true,
  sortDir:     'desc',
  pageSize:    25,
  showTotals:  false,
  bgColor:     '#ffffff',
  title:       'Revenue by Product Category',
};

let chartInstance = null;
let updateTimer   = null;

/* ── INIT ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('visualisations');
  lucide.createIcons();
  renderPaletteGrid();
  onDatasetChange();
  renderFieldConfig();
  renderDisplayConfig();
  setTimeout(renderPreview, 100);
});

/* ── DATASET ───────────────────────────────────────────────── */

function onDatasetChange() {
  const val = document.getElementById('sel-dataset').value;
  if (!val) return;
  state.dataset = val;
  const ds = DATASETS[val];

  // Reset fields to first available
  state.dimField = ds.dims[0]?.v || null;
  state.msrField = ds.msrs[0]?.v || null;

  // Show chips
  const meta = document.getElementById('ds-meta');
  const chips = document.getElementById('ds-chips');
  meta.style.display = '';
  chips.innerHTML = [
    `<span class="badge badge-blue">${ds.dims.length} dimensions</span>`,
    `<span class="badge badge-accent">${ds.msrs.length} measures</span>`,
  ].join('');

  document.getElementById('preview-ds-badge').textContent = ds.label;
  document.getElementById('footer-ds').textContent = ds.label;

  renderFieldConfig();
  renderDisplayConfig();
  schedulePreview();
  lucide.createIcons();
}

/* ── VIZ TYPE ──────────────────────────────────────────────── */

function selectType(type) {
  state.type = type;
  document.querySelectorAll('.viz-type-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.type === type);
  });
  document.getElementById('footer-type').textContent =
    type === 'bar' ? 'Bar / Column' : type === 'pie' ? 'Pie / Donut' : type === 'line' ? 'Line' : 'Table';
  renderFieldConfig();
  renderDisplayConfig();
  schedulePreview();
}

/* ── FIELD CONFIG ──────────────────────────────────────────── */

function renderFieldConfig() {
  const body = document.getElementById('field-config-body');
  const ds   = DATASETS[state.dataset];
  if (!ds) { body.innerHTML = '<div class="option-hint">Select a dataset first.</div>'; return; }

  const dimOpts = ds.dims.map(d =>
    `<option value="${d.v}"${d.v === state.dimField ? ' selected' : ''}>${d.l}</option>`).join('');
  const msrOpts = ds.msrs.map(m =>
    `<option value="${m.v}"${m.v === state.msrField ? ' selected' : ''}>${m.l}</option>`).join('');

  let html = '';

  if (state.type === 'table') {
    html = `
      <div style="font-size:12px;color:var(--text-3);margin-bottom:4px;">Drag to reorder columns</div>
      <div class="col-list" id="col-list">
        ${ds.dims.concat(ds.msrs).map(f => `
          <div class="col-list-item">
            <input type="checkbox" checked onchange="schedulePreview()">
            <span class="col-list-item-name">${f.l}</span>
            <div class="drag-handle"><i data-lucide="grip-vertical"></i></div>
          </div>`).join('')}
      </div>
    `;
  } else if (state.type === 'pie') {
    html = `
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-string">Dim</span> Slice By (Dimension)</label>
        <select class="field-select" onchange="state.dimField=this.value;schedulePreview()">
          ${dimOpts}
        </select>
      </div>
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-number">Msr</span> Size By (Measure)</label>
        <select class="field-select" onchange="state.msrField=this.value;schedulePreview()">
          ${msrOpts}
        </select>
      </div>
    `;
  } else if (state.type === 'line') {
    html = `
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-date">Dim</span> X Axis</label>
        <select class="field-select" onchange="state.dimField=this.value;schedulePreview()">
          ${dimOpts}
        </select>
      </div>
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-number">Msr</span> Y Axis</label>
        <select class="field-select" onchange="state.msrField=this.value;schedulePreview()">
          ${msrOpts}
        </select>
      </div>
      <div class="field-row">
        <label class="field-label">Break down by</label>
        <select class="field-select" onchange="state.dim2=this.value;schedulePreview()">
          <option value="">(none)</option>
          ${dimOpts}
        </select>
        <span class="option-hint">Splits into multiple lines</span>
      </div>
    `;
  } else {
    // bar / column
    html = `
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-string">Dim</span> X Axis</label>
        <select class="field-select" onchange="state.dimField=this.value;schedulePreview()">
          ${dimOpts}
        </select>
      </div>
      <div class="field-row">
        <label class="field-label"><span class="ftype ftype-number">Msr</span> Y Axis</label>
        <select class="field-select" onchange="state.msrField=this.value;schedulePreview()">
          ${msrOpts}
        </select>
      </div>
      <div class="field-row">
        <label class="field-label">Group by (optional)</label>
        <select class="field-select" onchange="state.dim2=this.value;schedulePreview()">
          <option value="">(none — single series)</option>
          ${dimOpts}
        </select>
        <span class="option-hint">Splits bars into grouped/stacked series</span>
      </div>
    `;
  }

  body.innerHTML = html;
  lucide.createIcons();
}

/* ── DISPLAY CONFIG ────────────────────────────────────────── */

function renderDisplayConfig() {
  const body = document.getElementById('display-config-body');
  let html = '';

  if (state.type === 'bar' || state.type === 'line') {
    html += `
      <div class="option-row">
        <span class="option-label">Orientation</span>
        <div class="seg-control">
          <button class="seg-btn${state.orientation==='vertical'?' active':''}" onclick="state.orientation='vertical';this.parentElement.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');schedulePreview()">Vertical</button>
          <button class="seg-btn${state.orientation==='horizontal'?' active':''}" onclick="state.orientation='horizontal';this.parentElement.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');schedulePreview()">Horizontal</button>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Stacking</span>
        <div class="seg-control">
          <button class="seg-btn active" onclick="setStack('none',this)">None</button>
          <button class="seg-btn" onclick="setStack('stacked',this)">Stack</button>
          <button class="seg-btn" onclick="setStack('100',this)">100%</button>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Show grid lines</span>
        <label class="toggle"><input type="checkbox" id="toggle-grid" checked onchange="state.showGrid=this.checked;schedulePreview()"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row">
        <span class="option-label">Data labels</span>
        <label class="toggle"><input type="checkbox" onchange="state.showLabels=this.checked;schedulePreview()"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
    `;
  } else if (state.type === 'pie') {
    html += `
      <div class="option-row">
        <span class="option-label">Donut mode</span>
        <label class="toggle"><input type="checkbox" id="toggle-donut" onchange="state.donut=this.checked;schedulePreview()"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row">
        <span class="option-label">Max slices</span>
        <div class="stepper">
          <button class="stepper-btn" onclick="adjustSlices(-1)">−</button>
          <input class="stepper-val" id="slice-val" value="${state.maxSlices}" readonly>
          <button class="stepper-btn" onclick="adjustSlices(1)">+</button>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Slice labels</span>
        <div class="seg-control">
          <button class="seg-btn active" onclick="setSegs(this,'label')">Label</button>
          <button class="seg-btn" onclick="setSegs(this,'value')">Value</button>
          <button class="seg-btn" onclick="setSegs(this,'pct')">%</button>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Legend</span>
        <label class="toggle"><input type="checkbox" checked onchange="state.showLegend=this.checked;schedulePreview()"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
    `;
  } else if (state.type === 'table') {
    html += `
      <div class="option-row">
        <span class="option-label">Rows per page</span>
        <div class="seg-control">
          <button class="seg-btn" onclick="setSegs(this,'25')">25</button>
          <button class="seg-btn active" onclick="setSegs(this,'50')">50</button>
          <button class="seg-btn" onclick="setSegs(this,'100')">100</button>
        </div>
      </div>
      <div class="option-row">
        <span class="option-label">Show totals row</span>
        <label class="toggle"><input type="checkbox" onchange="state.showTotals=this.checked;schedulePreview()"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row">
        <span class="option-label">Striped rows</span>
        <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row">
        <span class="option-label">Conditional formatting</span>
        <button class="btn btn-secondary btn-sm" style="font-size:11.5px;">Configure</button>
      </div>
    `;
  } else if (state.type === 'line') {
    html += `
      <div class="option-row">
        <span class="option-label">Fill area</span>
        <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row">
        <span class="option-label">Smooth curves</span>
        <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
    `;
  }

  body.innerHTML = html;
}

/* ── PALETTE ───────────────────────────────────────────────── */

const PALETTE_SETS = [
  { key: 'default',   colors: PALETTES.default },
  { key: 'warm',      colors: PALETTES.warm },
  { key: 'cool',      colors: PALETTES.cool },
  { key: 'monochrome',colors: PALETTES.monochrome },
];

function renderPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = PALETTE_SETS.map(p => `
    <div style="display:flex;gap:2px;cursor:pointer;border-radius:5px;padding:3px;border:1.5px solid transparent;transition:border-color 0.15s;"
         onclick="selectPalette('${p.key}',this)"
         data-palette="${p.key}"
         title="${p.key}">
      ${p.colors.slice(0,5).map(c =>
        `<div style="width:16px;height:16px;border-radius:3px;background:${c};"></div>`
      ).join('')}
    </div>
  `).join('');
  // Select default
  grid.querySelector('[data-palette="default"]').style.borderColor = 'var(--accent)';
}

function selectPalette(key, el) {
  activePalette = PALETTES[key];
  document.querySelectorAll('[data-palette]').forEach(e => e.style.borderColor = 'transparent');
  el.style.borderColor = 'var(--accent)';
  schedulePreview();
}

/* ── CHART RENDERING ───────────────────────────────────────── */

function schedulePreview() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(renderPreview, 250);
}

function renderPreview() {
  const body = document.getElementById('preview-card-body');
  const ds   = DATASETS[state.dataset];
  if (!ds) return;

  // Update footer
  document.getElementById('preview-card').style.backgroundColor = state.bgColor;

  if (state.type === 'table') {
    renderTablePreview(body);
    return;
  }

  body.innerHTML = '<div id="chart-wrap" style="position:relative;height:320px;"><canvas id="main-chart"></canvas></div>';

  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const ctx = document.getElementById('main-chart').getContext('2d');

  if (state.type === 'pie') {
    renderPieChart(ctx);
  } else if (state.type === 'bar') {
    renderBarChart(ctx);
  } else if (state.type === 'line') {
    renderLineChart(ctx);
  }

  updateFooterMeta();
}

function renderBarChart(ctx) {
  const dimField = state.dimField || 'product_category';
  const src = CHART_DATA.bar.orders?.[dimField] || CHART_DATA.bar.orders.product_category;

  const datasets = src.datasets.map((ds, i) => ({
    ...ds,
    backgroundColor: activePalette[i % activePalette.length] + 'CC',
    borderColor:      activePalette[i % activePalette.length],
    borderWidth: 1.5,
    borderRadius: 4,
  }));

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels: src.labels, datasets },
    options: {
      indexAxis: state.orientation === 'horizontal' ? 'y' : 'x',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: datasets.length > 1, position: 'top', labels: { font: { family: 'Inter', size: 12 }, padding: 12 }},
        tooltip: { bodyFont: { family: 'Inter' }, titleFont: { family: 'Inter', weight: '600' }},
      },
      scales: {
        x: { grid: { display: state.orientation !== 'vertical' || state.showGrid, color: '#E5E7EB' }, ticks: { font: { family: 'Inter', size: 12 }, color: '#6B7280' }, stacked: state.stacking !== 'none' },
        y: { grid: { display: state.orientation === 'vertical' || state.showGrid, color: '#E5E7EB' }, ticks: { font: { family: 'Inter', size: 12 }, color: '#6B7280' }, stacked: state.stacking !== 'none',
             beginAtZero: true,
             ticks: { callback: v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}k` : v, font: { family: 'Inter', size: 12 }, color: '#6B7280' }},
      },
    },
  });
}

function renderPieChart(ctx) {
  const dimField = state.dimField || 'product_category';
  const src = CHART_DATA.pie.orders?.[dimField] || CHART_DATA.pie.orders.product_category;
  let labels = [...src.labels];
  let data   = [...src.data];

  if (labels.length > state.maxSlices) {
    const topLabels = labels.slice(0, state.maxSlices - 1);
    const topData   = data.slice(0, state.maxSlices - 1);
    const otherSum  = data.slice(state.maxSlices - 1).reduce((a,b) => a+b, 0);
    labels = [...topLabels, 'Other'];
    data   = [...topData, otherSum];
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: activePalette.slice(0, labels.length).map(c => c + 'DD'),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 3,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: state.donut ? '62%' : '0%',
      plugins: {
        legend: {
          display: state.showLegend,
          position: 'right',
          labels: { font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, pointStyleWidth: 10 },
        },
        tooltip: {
          bodyFont: { family: 'Inter' }, titleFont: { family: 'Inter', weight: '600' },
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
              const pct   = ((ctx.raw / total) * 100).toFixed(1);
              return ` $${ctx.raw.toLocaleString()} (${pct}%)`;
            }
          }
        },
      },
    },
  });
}

function renderLineChart(ctx) {
  const dimField = state.dimField || 'order_month';
  const src = CHART_DATA.line.orders?.[dimField] || CHART_DATA.line.orders.order_month;

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: src.labels,
      datasets: src.datasets.map((ds, i) => ({
        ...ds,
        borderColor:     activePalette[i % activePalette.length],
        backgroundColor: activePalette[i % activePalette.length] + '22',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: activePalette[i % activePalette.length],
        tension: 0.4,
        fill: false,
      })),
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { bodyFont: { family: 'Inter' }, titleFont: { family: 'Inter', weight: '600' },
          callbacks: { label: ctx => ` $${ctx.raw.toLocaleString()}` }
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 }, color: '#6B7280' }},
        y: { grid: { color: '#E5E7EB' }, beginAtZero: true,
          ticks: { callback: v => `$${(v/1000).toFixed(0)}k`, font: { family: 'Inter', size: 12 }, color: '#6B7280' }},
      },
    },
  });
}

function renderTablePreview(body) {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  const tableData = TABLE_DATA[state.dataset] || TABLE_DATA.orders;
  body.innerHTML = `
    <div class="preview-table-wrap">
      <table class="prev-table">
        <thead><tr>${tableData.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${tableData.rows.map(r =>
            `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
          ).join('')}
          ${state.showTotals ? `<tr style="font-weight:600;background:var(--surface-2);">
            <td colspan="${tableData.cols.length - 1}" style="text-align:right;color:var(--text-2);">Total</td>
            <td>$5,175</td></tr>` : ''}
        </tbody>
      </table>
    </div>
    <div style="padding:10px 0 0;font-size:12px;color:var(--text-3);">
      Showing 6 rows · Page 1 of ${state.pageSize === 25 ? '2' : '1'}
    </div>
  `;
  updateFooterMeta();
}

function updateFooterMeta() {
  const ds   = DATASETS[state.dataset];
  const dim  = ds?.dims.find(d => d.v === state.dimField);
  const msr  = ds?.msrs.find(m => m.v === state.msrField);
  const el   = document.getElementById('footer-rows');
  if (!el) return;
  if (state.type === 'table') {
    el.textContent = `${ds?.dims.length + ds?.msrs.length || 0} columns configured`;
  } else if (state.type === 'pie') {
    el.textContent = `${dim?.l || '—'} · ${msr?.l || '—'}`;
  } else {
    el.textContent = `${dim?.l || '—'} × ${msr?.l || '—'}`;
  }
}

/* ── HELPERS ───────────────────────────────────────────────── */

function toggleSection(head) {
  head.classList.toggle('collapsed');
  const body = head.nextElementSibling;
  body.classList.toggle('collapsed');
}

function setStack(val, btn) {
  state.stacking = val;
  btn.closest('.seg-control').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  schedulePreview();
}

function setSegs(btn, val) {
  btn.closest('.seg-control').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  schedulePreview();
}

function adjustSlices(delta) {
  state.maxSlices = Math.max(2, Math.min(12, state.maxSlices + delta));
  document.getElementById('slice-val').value = state.maxSlices;
  schedulePreview();
}

function setPreviewSize(size, btn) {
  const canvas = document.getElementById('preview-card');
  btn.closest('.seg-control').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const widths = { desktop: '780px', tablet: '540px', mobile: '340px' };
  canvas.style.maxWidth = widths[size] || '780px';
  schedulePreview();
}

function refreshPreview() {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  renderPreview();
}

function onTitleChange() {
  state.title = document.getElementById('vis-title').value;
  document.getElementById('vis-name-bc').textContent = state.title || 'New Visualisation';
  document.title = `${state.title || 'New Visualisation'} — Reportr`;
}

function duplicateVis() {
  const t = document.getElementById('vis-title');
  t.value = t.value + ' (copy)';
  onTitleChange();
}

function updatePreview() { schedulePreview(); }

function saveVis() {
  const btn = document.getElementById('btn-save-vis');
  btn.classList.add('loading'); btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('loading'); btn.disabled = false;
    // Flash the button green briefly
    btn.classList.add('btn-success'); btn.classList.remove('btn-primary');
    setTimeout(() => { btn.classList.remove('btn-success'); btn.classList.add('btn-primary'); }, 1500);
  }, 900);
}
