/* ============================================================
   REPORTR — Dashboard Builder
   dashboard-builder.js
   ============================================================ */

/* ── PALETTE ──────────────────────────────────────────────── */
const P = ['#16A34A','#06B6D4','#3B82F6','#F59E0B','#EF4444','#8B5CF6'];

/* ── DASHBOARD STATE ───────────────────────────────────────── */
let dashboard = {
  name: 'Sales Performance',
  page: { bg: '#F0F2F8', padT: 24, padR: 24, padB: 24, padL: 24 },
  rows: [
    {
      id: 'r1', cols: 4, gap: 12,
      bg: 'transparent', padT: 0, padR: 0, padB: 0, padL: 0,
      borderW: 0, borderColor: '#E5E7EB', borderRadius: 0,
      containers: ['c-kpi1','c-kpi2','c-kpi3','c-kpi4'],
    },
    {
      id: 'r2', cols: 2, gap: 12,
      bg: 'transparent', padT: 0, padR: 0, padB: 0, padL: 0,
      borderW: 0, borderColor: '#E5E7EB', borderRadius: 0,
      colWidths: [40, 60],
      containers: ['c-pie','c-bar'],
    },
    {
      id: 'r3', cols: 1, gap: 12,
      bg: 'transparent', padT: 0, padR: 0, padB: 0, padL: 0,
      borderW: 0, borderColor: '#E5E7EB', borderRadius: 0,
      containers: ['c-table'],
    },
  ],
  containers: {
    'c-kpi1': { id:'c-kpi1', type:'kpi',   title:'Total Revenue',  bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{value:'$2.41M', trend:'+14.3%', up:true} },
    'c-kpi2': { id:'c-kpi2', type:'kpi',   title:'Total Orders',   bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{value:'12,847', trend:'+8.1%', up:true} },
    'c-kpi3': { id:'c-kpi3', type:'kpi',   title:'Avg Order Value', bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{value:'$187', trend:'+5.6%', up:true} },
    'c-kpi4': { id:'c-kpi4', type:'kpi',   title:'Return Rate',    bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{value:'4.2%', trend:'-0.8pp', up:false} },
    'c-pie':  { id:'c-pie',  type:'pie',   title:'Revenue by Category', bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{} },
    'c-bar':  { id:'c-bar',  type:'bar',   title:'Monthly Revenue Trend', bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{} },
    'c-table':{ id:'c-table',type:'table', title:'Recent Orders',  bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{} },
  },
};

let selectedType = 'page';
let selectedId   = null;
let zoom         = 100;
let leftTab      = 'elements';
let miniCharts   = {};

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('dashboards');
  lucide.createIcons();
  renderCanvas();
  renderStylePanel();
  renderLeftPanel();
  setTimeout(renderMiniCharts, 200);
});

/* ── CANVAS ────────────────────────────────────────────────── */
function renderCanvas() {
  const rc  = document.getElementById('rows-container');
  const pf  = document.getElementById('page-frame');
  pf.style.background = dashboard.page.bg;
  pf.style.padding    = `${dashboard.page.padT}px ${dashboard.page.padR}px ${dashboard.page.padB}px ${dashboard.page.padL}px`;

  rc.innerHTML = dashboard.rows.map(row => renderRow(row)).join('');
  lucide.createIcons();
}

function renderRow(row) {
  const colCount = row.cols;
  const widths   = row.colWidths || Array(colCount).fill(100 / colCount);
  const containerHtml = row.containers.map((cid, i) => {
    const c = dashboard.containers[cid];
    if (!c) return '';
    const w = widths[i] !== undefined ? `flex:0 0 calc(${widths[i]}% - ${row.gap}px)` : 'flex:1';
    return renderContainer(c, w);
  }).join('');

  return `
    <div class="db-row" id="row-${row.id}" data-rowid="${row.id}"
         style="${rowStyle(row)}"
         onclick="onRowClick(event,'${row.id}')">
      <div class="row-controls">
        <button class="row-ctrl-btn" onclick="event.stopPropagation();addColToRow('${row.id}')">
          <i data-lucide="columns"></i> ${row.cols} col${row.cols!==1?'s':''}
        </button>
        <button class="row-ctrl-btn" onclick="event.stopPropagation();moveRow('${row.id}',-1)">
          <i data-lucide="arrow-up"></i>
        </button>
        <button class="row-ctrl-btn" onclick="event.stopPropagation();moveRow('${row.id}',1)">
          <i data-lucide="arrow-down"></i>
        </button>
        <button class="row-ctrl-btn danger" onclick="event.stopPropagation();removeRow('${row.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
      <div class="row-inner" style="gap:${row.gap}px;padding:${row.padT}px ${row.padR}px ${row.padB}px ${row.padL}px;">
        ${containerHtml}
      </div>
    </div>
  `;
}

function rowStyle(row) {
  let s = '';
  if (row.bg && row.bg !== 'transparent') s += `background:${row.bg};`;
  if (row.borderW > 0) s += `border:${row.borderW}px solid ${row.borderColor};`;
  if (row.borderRadius) s += `border-radius:${row.borderRadius}px;`;
  return s;
}

function renderContainer(c, widthStyle) {
  const shadowMap = { sm:'0 1px 4px rgba(16,24,40,0.08)', md:'0 4px 16px rgba(16,24,40,0.10)', lg:'0 12px 32px rgba(16,24,40,0.14)', none:'' };
  const shadow = shadowMap[c.shadow] || '';
  const isSelected = selectedType === 'container' && selectedId === c.id;

  return `
    <div class="db-container${isSelected?' selected':''}"
         id="cont-${c.id}" data-cid="${c.id}"
         style="background:${c.bg};
                padding:${c.padT}px ${c.padR}px ${c.padB}px ${c.padL}px;
                border:${c.borderW}px solid ${c.borderColor};
                border-radius:${c.borderRadius}px;
                box-shadow:${shadow};
                ${widthStyle};"
         onclick="onContainerClick(event,'${c.id}')">
      <div class="container-header">
        <span class="container-header-title">${c.title}</span>
        <span class="container-type-badge">${c.type}</span>
      </div>
      <div class="container-body" id="cbody-${c.id}">
        ${renderContainerContent(c)}
      </div>
    </div>
  `;
}

function renderContainerContent(c) {
  if (c.type === 'kpi') {
    return `
      <div class="kpi-card">
        <div class="kpi-label">${c.title}</div>
        <div class="kpi-value">${c.data.value}</div>
        <div class="kpi-trend ${c.data.up?'up':'down'}">
          <i data-lucide="${c.data.up?'trending-up':'trending-down'}"></i>
          ${c.data.trend} vs last period
        </div>
      </div>`;
  }
  if (c.type === 'text') {
    return `<div class="text-block">${c.data.content || 'Text block — click to edit.'}</div>`;
  }
  if (c.type === 'empty') {
    return `
      <div class="drop-zone" onclick="event.stopPropagation();addVisToContainer('${c.id}')">
        <i data-lucide="plus-circle"></i>
        <span>Add visualisation or text</span>
      </div>`;
  }
  // Chart types (pie, bar, table) — canvas rendered later by renderMiniCharts
  return `<div class="mini-chart-wrap" id="mini-${c.id}"><canvas id="chart-${c.id}"></canvas></div>`;
}

/* ── MINI CHARTS ───────────────────────────────────────────── */
function renderMiniCharts() {
  Object.values(dashboard.containers).forEach(c => {
    const canvasEl = document.getElementById(`chart-${c.id}`);
    if (!canvasEl) return;
    if (miniCharts[c.id]) { miniCharts[c.id].destroy(); }

    const ctx = canvasEl.getContext('2d');
    const opts = {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 600 },
    };

    if (c.type === 'pie') {
      miniCharts[c.id] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Electronics','Furniture','Software','Office','Other'],
          datasets: [{ data:[482,234,188,98,43], backgroundColor:P.map(c=>c+'CC'), borderColor:'#fff', borderWidth:2 }],
        },
        options: { ...opts, cutout:'55%', plugins: { legend: { display: true, position:'right', labels:{ font:{family:'Inter',size:11}, padding:8, usePointStyle:true, pointStyleWidth:8 }}, tooltip:{enabled:true, bodyFont:{family:'Inter'}} } },
      });
    } else if (c.type === 'bar') {
      miniCharts[c.id] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          datasets: [{ label:'Revenue', data:[89,102,134,118,156,143,178,160,142,188,210,195],
            backgroundColor: P[0]+'BB', borderColor: P[0], borderWidth:1, borderRadius:3 }],
        },
        options: { ...opts,
          plugins: { legend:{display:false}, tooltip:{ enabled:true, bodyFont:{family:'Inter'}, callbacks:{label:c=>`$${c.raw}k`} } },
          scales: {
            x: { grid:{display:false}, ticks:{font:{family:'Inter',size:10},color:'#9CA3AF'} },
            y: { grid:{color:'#E5E7EB'}, ticks:{font:{family:'Inter',size:10},color:'#9CA3AF', callback:v=>`$${v}k`}, beginAtZero:true },
          },
        },
      });
    } else if (c.type === 'table') {
      // render a mini HTML table
      const el = document.getElementById(`mini-${c.id}`);
      if (el) {
        el.innerHTML = `
          <div style="overflow:auto;border:1px solid var(--border);border-radius:var(--r-sm);">
            <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
              <thead><tr style="background:var(--surface-2);">
                <th style="padding:6px 10px;text-align:left;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;">Order ID</th>
                <th style="padding:6px 10px;text-align:left;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;">Customer</th>
                <th style="padding:6px 10px;text-align:left;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;">Category</th>
                <th style="padding:6px 10px;text-align:left;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;">Revenue</th>
                <th style="padding:6px 10px;text-align:left;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;">Status</th>
              </tr></thead>
              <tbody>
                <tr><td style="padding:5px 10px;border-bottom:1px solid var(--border);">10821</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">Helena Marsh</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">Electronics</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">$1,249</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);"><span style="color:#065F46;background:#D1FAE5;padding:1px 6px;border-radius:99px;font-size:10.5px;font-weight:500;">Delivered</span></td></tr>
                <tr><td style="padding:5px 10px;border-bottom:1px solid var(--border);">10822</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">James Okafor</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">Furniture</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">$399</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);"><span style="color:#065F46;background:#D1FAE5;padding:1px 6px;border-radius:99px;font-size:10.5px;font-weight:500;">Delivered</span></td></tr>
                <tr><td style="padding:5px 10px;border-bottom:1px solid var(--border);">10824</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">Riya Kapoor</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">Electronics</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);">$749</td><td style="padding:5px 10px;border-bottom:1px solid var(--border);"><span style="color:#991B1B;background:#FEE2E2;padding:1px 6px;border-radius:99px;font-size:10.5px;font-weight:500;">Returned</span></td></tr>
                <tr><td style="padding:5px 10px;">10826</td><td style="padding:5px 10px;">Sara Chen</td><td style="padding:5px 10px;">Electronics</td><td style="padding:5px 10px;">$2,199</td><td style="padding:5px 10px;"><span style="color:#065F46;background:#D1FAE5;padding:1px 6px;border-radius:99px;font-size:10.5px;font-weight:500;">Delivered</span></td></tr>
              </tbody>
            </table>
          </div>`;
      }
    }
  });
  lucide.createIcons();
}

/* ── SELECTION ─────────────────────────────────────────────── */
function onCanvasClick(e) {
  if (e.target === document.getElementById('db-canvas') ||
      e.target === document.getElementById('page-frame') ||
      e.target.id === 'rows-container') {
    selectPage();
  }
}

function selectPage() {
  clearSelection();
  selectedType = 'page'; selectedId = null;
  document.getElementById('page-frame').classList.add('selected');
  renderStylePanel();
}

function onRowClick(e, rowId) {
  e.stopPropagation();
  clearSelection();
  selectedType = 'row'; selectedId = rowId;
  document.getElementById(`row-${rowId}`)?.classList.add('selected');
  renderStylePanel();
}

function onContainerClick(e, cid) {
  e.stopPropagation();
  clearSelection();
  selectedType = 'container'; selectedId = cid;
  document.getElementById(`cont-${cid}`)?.classList.add('selected');
  renderStylePanel();
}

function clearSelection() {
  document.querySelectorAll('.db-row.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.db-container.selected').forEach(el => el.classList.remove('selected'));
  document.getElementById('page-frame').classList.remove('selected');
}

/* ── STYLE PANEL ───────────────────────────────────────────── */
function renderStylePanel() {
  const title = document.getElementById('style-panel-title');
  const body  = document.getElementById('style-panel-body');

  if (selectedType === 'page') {
    title.textContent = 'Page';
    body.innerHTML = buildPagePanel();
  } else if (selectedType === 'row') {
    const row = dashboard.rows.find(r => r.id === selectedId);
    title.textContent = 'Row';
    body.innerHTML = buildRowPanel(row);
  } else if (selectedType === 'container') {
    const c = dashboard.containers[selectedId];
    title.textContent = c ? c.title : 'Container';
    body.innerHTML = buildContainerPanel(c);
  }
  lucide.createIcons();
}

/* ── PANEL BUILDERS ────────────────────────────────────────── */

function buildPagePanel() {
  return `
    <div class="selection-indicator">
      <i data-lucide="layout"></i> Page — global canvas settings
    </div>
    ${styleSection('Background', `
      <div class="form-group">
        <label class="form-label">Page Background</label>
        ${colorControl('page-bg', dashboard.page.bg, 'applyPageBg')}
      </div>
    `)}
    ${styleSection('Spacing', `
      <div class="form-group">
        <label class="form-label">Outer Padding</label>
        ${spacingControl('page-pad', [dashboard.page.padT, dashboard.page.padR, dashboard.page.padB, dashboard.page.padL], 'applyPagePadding')}
      </div>
    `)}
    ${styleSection('Theme', `
      <div class="form-group">
        <label class="form-label">Accent Colour</label>
        ${colorControl('theme-accent','#16A34A','applyThemeAccent')}
      </div>
      <div class="form-group">
        <label class="form-label" style="margin-top:4px;">Default card background</label>
        ${colorControl('card-bg-default','#FFFFFF','x')}
      </div>
      <div class="form-group">
        <label class="form-label" style="margin-top:4px;">Default font</label>
        <select class="form-input form-select" style="font-size:12.5px;padding:6px 10px;">
          <option>Inter (System)</option><option>Roboto</option><option>DM Sans</option><option>Poppins</option>
        </select>
      </div>
      <button class="btn btn-secondary w-full" style="margin-top:4px;font-size:12.5px;">
        <i data-lucide="palette"></i> Manage Themes
      </button>
    `)}
  `;
}

function buildRowPanel(row) {
  if (!row) return '<div style="padding:20px;color:var(--text-3);">Row not found.</div>';
  const widths = row.colWidths || Array(row.cols).fill(Math.round(100/row.cols));
  return `
    <div class="selection-indicator">
      <i data-lucide="rows"></i> Row — ${row.cols} column${row.cols!==1?'s':''}
    </div>
    ${styleSection('Layout', `
      <div class="form-group">
        <label class="form-label">Columns</label>
        <div class="col-adjuster">
          <button class="col-adj-btn" onclick="adjustRowCols('${row.id}',-1)">−</button>
          <span class="col-adj-val" id="col-adj-val">${row.cols}</span>
          <button class="col-adj-btn" onclick="adjustRowCols('${row.id}',1)">+</button>
          <span style="font-size:12px;color:var(--text-3);margin-left:4px;">max 6</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Column Widths</label>
        <div class="col-widths-visual" id="col-widths-visual">
          ${widths.map((w,i) => `<div class="col-width-bar" style="flex:${w}" title="${Math.round(w)}%">${Math.round(w)}%</div>`).join('')}
        </div>
        <span class="form-hint" style="margin-top:4px;">Proportional — drag to adjust (coming soon)</span>
      </div>
      <div class="form-group">
        <label class="form-label">Gap Between Columns</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <input type="range" min="0" max="40" value="${row.gap}" style="flex:1;accent-color:var(--accent);"
                 oninput="updateGap('${row.id}',this.value)">
          <span style="font-size:12px;font-family:var(--font-mono);min-width:32px;" id="gap-val-${row.id}">${row.gap}px</span>
        </div>
      </div>
    `)}
    ${styleSection('Background', `
      <div class="form-group">
        <label class="form-label">Row Background</label>
        ${colorControl('row-bg', row.bg === 'transparent' ? '#ffffff' : row.bg, `applyRowBg('${row.id}',val)`)}
        <div class="option-row" style="margin-top:8px;">
          <span style="font-size:12.5px;">Transparent</span>
          <label class="toggle">
            <input type="checkbox" ${row.bg==='transparent'?'checked':''} onchange="setRowTransparent('${row.id}',this.checked)">
            <div class="toggle-track"></div><div class="toggle-thumb"></div>
          </label>
        </div>
      </div>
    `)}
    ${styleSection('Spacing', `
      <div class="form-group">
        <label class="form-label">Inner Padding</label>
        ${spacingControl('row-pad', [row.padT,row.padR,row.padB,row.padL], `applyRowPad('${row.id}',vals)`)}
      </div>
    `)}
    ${styleSection('Border', buildBorderControls(row, `applyRowBorder('${row.id}')`))}
    ${styleSection('Mobile', `
      <div class="option-row">
        <div>
          <div style="font-size:13px;font-weight:500;">Prevent column stacking</div>
          <div style="font-size:11.5px;color:var(--text-3);">Keep columns side-by-side on mobile</div>
        </div>
        <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div class="option-row" style="margin-top:4px;">
        <div>
          <div style="font-size:13px;font-weight:500;">Hide on mobile</div>
        </div>
        <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
    `)}
  `;
}

function buildContainerPanel(c) {
  if (!c) return '<div style="padding:20px;color:var(--text-3);">Select a container.</div>';
  const shadowKey = c.shadow || 'none';
  return `
    <div class="selection-indicator">
      <i data-lucide="square"></i> Container — ${c.title}
    </div>
    ${styleSection('Content', `
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" value="${c.title}" style="font-size:13px;padding:6px 10px;"
               oninput="updateContainerTitle('${c.id}',this.value)">
      </div>
      <button class="btn btn-secondary w-full" style="font-size:12.5px;">
        <i data-lucide="bar-chart-2"></i> Edit Visualisation
      </button>
      <button class="btn btn-secondary w-full" style="font-size:12.5px;margin-top:6px;">
        <i data-lucide="plus"></i> Add element to container
      </button>
    `)}
    ${styleSection('Background', `
      <div class="form-group">
        <label class="form-label">Background Colour</label>
        ${colorControl('cont-bg', c.bg, `applyContBg('${c.id}',val)`)}
      </div>
    `)}
    ${styleSection('Spacing', `
      <div class="form-group">
        <label class="form-label">Padding</label>
        ${spacingControl('cont-pad', [c.padT,c.padR,c.padB,c.padL], `applyContPad('${c.id}',vals)`)}
      </div>
    `)}
    ${styleSection('Border', buildBorderControls(c, `applyContBorder('${c.id}')`))}
    ${styleSection('Shadow', `
      <div class="shadow-presets">
        ${['none','sm','md','lg'].map(s => `
          <div class="shadow-preset${shadowKey===s?' active':''}" onclick="applyContShadow('${c.id}','${s}',this)">
            <div class="shadow-preview" style="box-shadow:${s==='none'?'none':s==='sm'?'0 1px 4px rgba(0,0,0,0.1)':s==='md'?'0 4px 12px rgba(0,0,0,0.12)':'0 10px 30px rgba(0,0,0,0.16)'};"></div>
            ${s.charAt(0).toUpperCase()+s.slice(1)}
          </div>`).join('')}
      </div>
    `)}
    ${styleSection('Mobile', `
      <div class="option-row">
        <span style="font-size:13px;font-weight:500;">Hide on mobile</span>
        <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
    `)}
  `;
}

/* ── UI HELPERS ────────────────────────────────────────────── */

function styleSection(title, content) {
  return `
    <div class="style-section">
      <div class="style-section-head" onclick="toggleStyleSection(this)">
        <span class="style-section-title">${title}</span>
        <i data-lucide="chevron-down"></i>
      </div>
      <div class="style-section-body">${content}</div>
    </div>
  `;
}

function colorControl(id, value, callback) {
  return `
    <div class="color-control" onclick="document.getElementById('${id}-native').click()">
      <div class="color-swatch" id="${id}-swatch" style="background:${value};"></div>
      <input class="color-input-native" type="color" id="${id}-native" value="${value}"
             oninput="document.getElementById('${id}-swatch').style.background=this.value;document.getElementById('${id}-hex').value=this.value;onColorChange('${id}',this.value)">
      <input class="color-hex" id="${id}-hex" value="${value}" maxlength="7"
             oninput="onHexInput('${id}',this.value)">
    </div>
  `;
}

function spacingControl(prefix, vals, callback) {
  const [t,r,b,l] = vals;
  return `
    <div class="spacing-control">
      <div><input class="spacing-input" type="number" min="0" max="120" value="${t}" oninput="onSpacingChange('${prefix}')"><div class="spacing-label">Top</div></div>
      <div><input class="spacing-input" type="number" min="0" max="120" value="${r}" oninput="onSpacingChange('${prefix}')"><div class="spacing-label">Right</div></div>
      <div><input class="spacing-input" type="number" min="0" max="120" value="${b}" oninput="onSpacingChange('${prefix}')"><div class="spacing-label">Bottom</div></div>
      <div><input class="spacing-input" type="number" min="0" max="120" value="${l}" oninput="onSpacingChange('${prefix}')"><div class="spacing-label">Left</div></div>
    </div>
  `;
}

function buildBorderControls(obj, callback) {
  return `
    <div class="form-row" style="gap:8px;">
      <div class="form-group">
        <label class="form-label" style="font-size:11.5px;">Width</label>
        <input class="form-input" type="number" min="0" max="10" value="${obj.borderW||0}" style="font-size:13px;padding:6px 10px;">
      </div>
      <div class="form-group">
        <label class="form-label" style="font-size:11.5px;">Style</label>
        <select class="form-input form-select" style="font-size:12.5px;padding:6px 10px;">
          <option>Solid</option><option>Dashed</option><option>Dotted</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" style="font-size:11.5px;">Border Colour</label>
      ${colorControl('border-clr', obj.borderColor||'#E5E7EB', callback)}
    </div>
    <div class="form-group">
      <label class="form-label" style="font-size:11.5px;">Corner Radius</label>
      <div style="display:flex;align-items:center;gap:8px;">
        <input type="range" min="0" max="32" value="${obj.borderRadius||0}" style="flex:1;accent-color:var(--accent);"
               oninput="applyBorderRadius('${selectedId}',this.value)">
        <span style="font-size:12px;font-family:var(--font-mono);min-width:32px;">${obj.borderRadius||0}px</span>
      </div>
    </div>
  `;
}

function toggleStyleSection(head) {
  head.classList.toggle('closed');
  head.nextElementSibling.classList.toggle('closed');
  lucide.createIcons();
}

/* ── APPLY CHANGES (mutate state + re-render) ─────────────── */

function onColorChange(id, val) {
  if (id === 'page-bg')       { dashboard.page.bg = val; renderCanvas(); }
  if (id === 'theme-accent')  { document.documentElement.style.setProperty('--accent', val); }
}

function onHexInput(id, val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    document.getElementById(`${id}-native`).value = val;
    document.getElementById(`${id}-swatch`).style.background = val;
    onColorChange(id, val);
  }
}

function onSpacingChange(prefix) { /* would read inputs and apply */ }

function applyPageBg(val) { dashboard.page.bg = val; renderCanvas(); }

function applyContShadow(cid, shadow, el) {
  dashboard.containers[cid].shadow = shadow;
  el.closest('.shadow-presets').querySelectorAll('.shadow-preset').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  const contEl = document.getElementById(`cont-${cid}`);
  const shadowMap = { sm:'0 1px 4px rgba(16,24,40,0.08)', md:'0 4px 16px rgba(16,24,40,0.10)', lg:'0 12px 32px rgba(16,24,40,0.14)', none:'' };
  if (contEl) contEl.style.boxShadow = shadowMap[shadow] || '';
}

function applyBorderRadius(id, val) {
  if (!id) return;
  if (selectedType === 'container' && dashboard.containers[id]) {
    dashboard.containers[id].borderRadius = parseInt(val);
    const el = document.getElementById(`cont-${id}`);
    if (el) el.style.borderRadius = `${val}px`;
    // Update label next to slider
    const label = el?.parentElement?.parentElement?.querySelector('span[style*="font-mono"]');
    if (label) label.textContent = `${val}px`;
  }
}

function updateContainerTitle(cid, val) {
  if (dashboard.containers[cid]) dashboard.containers[cid].title = val;
  const el = document.getElementById(`cont-${cid}`);
  if (el) el.querySelector('.container-header-title').textContent = val;
  document.getElementById('style-panel-title').textContent = val;
}

function adjustRowCols(rowId, delta) {
  const row = dashboard.rows.find(r => r.id === rowId);
  if (!row) return;
  const newCols = Math.max(1, Math.min(6, row.cols + delta));
  if (newCols === row.cols) return;
  row.cols = newCols;
  // Adjust containers list
  while (row.containers.length < newCols) {
    const newId = `c-new-${Date.now()}`;
    dashboard.containers[newId] = { id:newId, type:'empty', title:'New Container', bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{} };
    row.containers.push(newId);
  }
  row.colWidths = Array(newCols).fill(Math.round(100 / newCols));
  renderCanvas();
  renderStylePanel();
  setTimeout(renderMiniCharts, 50);
  lucide.createIcons();
}

function updateGap(rowId, val) {
  const row = dashboard.rows.find(r => r.id === rowId);
  if (row) row.gap = parseInt(val);
  document.getElementById(`gap-val-${rowId}`).textContent = `${val}px`;
  const rowEl = document.getElementById(`row-${rowId}`);
  if (rowEl) rowEl.querySelector('.row-inner').style.gap = `${val}px`;
}

function setRowTransparent(rowId, checked) {
  const row = dashboard.rows.find(r => r.id === rowId);
  if (row) {
    row.bg = checked ? 'transparent' : '#FFFFFF';
    const rowEl = document.getElementById(`row-${rowId}`);
    if (rowEl) rowEl.style.background = row.bg;
  }
}

/* ── ROW MANAGEMENT ────────────────────────────────────────── */

function addRow() {
  const rowId = `r${Date.now()}`;
  const c1Id  = `c-new-${Date.now()}`;
  dashboard.containers[c1Id] = { id:c1Id, type:'empty', title:'Container', bg:'#FFFFFF', padT:16, padR:16, padB:16, padL:16, borderW:1, borderColor:'#E5E7EB', borderRadius:10, shadow:'sm', data:{} };
  dashboard.rows.push({
    id: rowId, cols: 1, gap: 12,
    bg: 'transparent', padT: 0, padR: 0, padB: 0, padL: 0,
    borderW: 0, borderColor: '#E5E7EB', borderRadius: 0,
    containers: [c1Id],
  });
  renderCanvas();
  setTimeout(() => {
    document.getElementById(`row-${rowId}`)?.scrollIntoView({behavior:'smooth', block:'center'});
    onRowClick({ stopPropagation:()=>{} }, rowId);
    lucide.createIcons();
  }, 100);
}

function removeRow(rowId) {
  if (dashboard.rows.length <= 1) return;
  dashboard.rows = dashboard.rows.filter(r => r.id !== rowId);
  if (selectedId === rowId) { selectedType = 'page'; selectedId = null; }
  renderCanvas();
  renderStylePanel();
  setTimeout(renderMiniCharts, 50);
  lucide.createIcons();
}

function moveRow(rowId, dir) {
  const idx = dashboard.rows.findIndex(r => r.id === rowId);
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= dashboard.rows.length) return;
  [dashboard.rows[idx], dashboard.rows[newIdx]] = [dashboard.rows[newIdx], dashboard.rows[idx]];
  renderCanvas();
  setTimeout(renderMiniCharts, 50);
  lucide.createIcons();
}

function addColToRow(rowId) {
  adjustRowCols(rowId, 1);
}

function addVisToContainer(cid) {
  const c = dashboard.containers[cid];
  if (!c) return;
  c.type  = 'bar';
  c.title = 'New Chart';
  renderCanvas();
  setTimeout(renderMiniCharts, 50);
  lucide.createIcons();
}

/* ── LEFT PANEL ────────────────────────────────────────────── */

function switchLeftTab(tab, el) {
  leftTab = tab;
  document.querySelectorAll('.db-left-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderLeftPanel();
}

function renderLeftPanel() {
  const body = document.getElementById('left-body');

  if (leftTab === 'elements') {
    body.innerHTML = `
      <div class="left-section-title">Add Row</div>
      <button class="add-row-btn" onclick="addRow()">
        <i data-lucide="plus-circle"></i> New Row
      </button>

      <div class="left-section-title" style="margin-top:8px;">Visualisations</div>
      ${[
        { title:'Revenue by Category', type:'pie',   ds:'Order Revenue' },
        { title:'Monthly Trend',       type:'bar',   ds:'Order Revenue' },
        { title:'Customer Segments',   type:'pie',   ds:'Customers'     },
        { title:'Campaign Performance',type:'bar',   ds:'Campaigns'     },
        { title:'Orders Table',        type:'table', ds:'Order Revenue' },
      ].map(v => `
        <div class="vis-lib-card" draggable="true">
          <div class="vis-lib-icon">
            <i data-lucide="${v.type==='pie'?'pie-chart':v.type==='table'?'table-2':'bar-chart-2'}"></i>
          </div>
          <div>
            <div class="vis-lib-name">${v.title}</div>
            <div class="vis-lib-ds">${v.ds}</div>
          </div>
        </div>
      `).join('')}

      <div class="left-section-title" style="margin-top:8px;">Content Blocks</div>
      ${[
        { icon:'type',      label:'Text Block'   },
        { icon:'heading-1', label:'Heading'      },
        { icon:'minus',     label:'Divider'      },
        { icon:'image',     label:'Image'        },
      ].map(b => `
        <div class="text-block-tmpl" draggable="true">
          <div class="vis-lib-icon"><i data-lucide="${b.icon}"></i></div>
          <div class="vis-lib-name">${b.label}</div>
        </div>
      `).join('')}
    `;
  } else if (leftTab === 'layers') {
    body.innerHTML = `
      <div class="left-section-title">Layer Tree</div>
      ${dashboard.rows.map((row, ri) => `
        <div style="margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:6px;padding:6px 4px;cursor:pointer;border-radius:var(--r-sm);" onclick="onRowClick({stopPropagation:()=>{}}, '${row.id}')">
            <i data-lucide="rows" style="width:13px;height:13px;color:var(--text-3);flex-shrink:0;"></i>
            <span style="font-size:12.5px;font-weight:500;">Row ${ri+1}</span>
            <span style="font-size:11px;color:var(--text-3);margin-left:auto;">${row.cols} col</span>
          </div>
          ${row.containers.map(cid => {
            const c = dashboard.containers[cid];
            if (!c) return '';
            return `
              <div style="display:flex;align-items:center;gap:6px;padding:5px 4px 5px 20px;cursor:pointer;border-radius:var(--r-sm);" onclick="onContainerClick({stopPropagation:()=>{}}, '${cid}')">
                <i data-lucide="${c.type==='kpi'?'activity':c.type==='pie'?'pie-chart':c.type==='table'?'table-2':'bar-chart-2'}" style="width:12px;height:12px;color:var(--accent);flex-shrink:0;"></i>
                <span style="font-size:12px;color:var(--text-2);">${c.title}</span>
              </div>
            `;
          }).join('')}
        </div>
      `).join('')}
    `;
  } else if (leftTab === 'theme') {
    body.innerHTML = `
      <div class="left-section-title">Global Theme</div>
      <div class="form-group">
        <label class="form-label" style="font-size:12px;">Accent</label>
        ${colorControl('theme-acc2','#16A34A','x')}
      </div>
      <div class="form-group" style="margin-top:10px;">
        <label class="form-label" style="font-size:12px;">Page Background</label>
        ${colorControl('theme-bg','#F0F2F8','x')}
      </div>
      <div class="form-group" style="margin-top:10px;">
        <label class="form-label" style="font-size:12px;">Card Background</label>
        ${colorControl('theme-card','#FFFFFF','x')}
      </div>
      <div class="form-group" style="margin-top:10px;">
        <label class="form-label" style="font-size:12px;">Card Border</label>
        ${colorControl('theme-border','#E5E7EB','x')}
      </div>
      <div class="form-group" style="margin-top:10px;">
        <label class="form-label" style="font-size:12px;">Font Family</label>
        <select class="form-input form-select" style="font-size:12.5px;padding:6px 10px;">
          <option selected>Inter</option><option>Roboto</option><option>DM Sans</option>
        </select>
      </div>
      <div style="margin-top:14px;display:flex;gap:6px;">
        <button class="btn btn-primary btn-sm w-full">Apply Theme</button>
      </div>
      <div style="margin-top:8px;">
        <button class="btn btn-secondary btn-sm w-full">Save as Template</button>
      </div>
    `;
  }

  lucide.createIcons();
}

/* ── PUBLISH ───────────────────────────────────────────────── */
function openPublishPanel() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('publish-panel').classList.add('open');
  lucide.createIcons();
}
function closePublishPanel() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('publish-panel').classList.remove('open');
}
function publish() {
  const btn = document.querySelector('.btn-publish:last-of-type');
  if (!btn) return;
  btn.classList.add('loading'); btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('loading'); btn.disabled = false;
    closePublishPanel();
  }, 1200);
}

/* ── ZOOM ──────────────────────────────────────────────────── */
function adjustZoom(delta) {
  zoom = Math.max(50, Math.min(150, zoom + delta));
  document.getElementById('zoom-val').textContent = `${zoom}%`;
  document.getElementById('page-frame').style.transform = `scale(${zoom/100})`;
  document.getElementById('page-frame').style.transformOrigin = 'top center';
}

/* ── MODE ──────────────────────────────────────────────────── */
function setMode(mode, btn) {
  document.querySelectorAll('.preview-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const shell = document.getElementById('db-shell');
  if (mode === 'preview') {
    document.getElementById('db-left').style.display  = 'none';
    document.getElementById('db-right').style.display = 'none';
    shell.style.gridTemplateColumns = '0 1fr 0';
    document.getElementById('canvas-hint').textContent = 'Preview mode — interactions are live';
    clearSelection();
  } else {
    document.getElementById('db-left').style.display  = '';
    document.getElementById('db-right').style.display = '';
    shell.style.gridTemplateColumns = '220px 1fr 272px';
    document.getElementById('canvas-hint').textContent = 'Click any element to select it';
  }
}

function toggleMobilePreview() {
  const pf = document.getElementById('page-frame');
  const isMobile = pf.style.maxWidth === '375px';
  pf.style.maxWidth = isMobile ? '100%' : '375px';
  pf.style.margin   = isMobile ? '0 auto' : '0 auto';
}

function undoAction() { /* would implement undo stack */ }
function redoAction() { /* would implement redo stack */ }
