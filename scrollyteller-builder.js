/* ============================================================
   REPORTR — Scrollyteller Builder
   scrollyteller-builder.js
   ============================================================ */

/* ── STORY DATA ────────────────────────────────────────────── */
const STORY = {
  id: 'st01',
  title: 'Q4 2025 — Revenue in Focus',
  sections: [
    {
      id: 's1', layout: 'cover', label: 'Cover', mechanic: 'step',
      blocks: [
        { id: 'b1', type: 'eyebrow',  content: 'Q4 2025 · Reportr Analytics' },
        { id: 'b2', type: 'heading',  content: 'Revenue in Focus' },
        { id: 'b3', type: 'subtext',  content: 'A data-driven look at our strongest quarter yet — by region, channel, and product line.' },
      ],
      steps: [],
    },
    {
      id: 's2', layout: 'split-left', label: 'Q4 by Region', mechanic: 'step',
      chart: { type: 'bar', title: 'Revenue by Region', dataset: 'Order Revenue' },
      blocks: [
        { id: 'b4', type: 'heading',  content: 'Strong gains across every region' },
        { id: 'b5', type: 'body',     content: 'Q4 saw consistent outperformance, with APAC breaking records and NAM holding its position as the largest contributor.' },
        { id: 'b6', type: 'body',     content: 'EMEA growth was driven by a single high-value contract renewal in November, which skews the regional totals.' },
        { id: 'b7', type: 'control',  content: 'Year', controlType: 'dropdown', options: ['2023', '2024', '2025'] },
      ],
      steps: [
        { id: 'st1', label: 'Overview', highlight: ['NAM', 'EMEA', 'APAC', 'LATAM'], annotation: 'All four regions hit Q4 targets.' },
        { id: 'st2', label: 'APAC record', highlight: ['APAC'], annotation: 'APAC revenue up 34% YoY — highest ever.' },
        { id: 'st3', label: 'EMEA spike', highlight: ['EMEA'], annotation: 'Nov contract renewal boosted EMEA by $2.1M.' },
        { id: 'st4', label: 'NAM steady', highlight: ['NAM'], annotation: 'NAM grew 8% — steady and reliable.' },
      ],
    },
    {
      id: 's3', layout: 'callout', label: 'Callout — 41%', mechanic: 'step',
      blocks: [
        { id: 'b8',  type: 'stat',    content: '41%' },
        { id: 'b9',  type: 'heading', content: 'YoY growth in APAC' },
        { id: 'b10', type: 'body',    content: 'The biggest single-region gain in company history.' },
      ],
      steps: [],
    },
    {
      id: 's4', layout: 'split-right', label: 'Monthly Trend', mechanic: 'continuous',
      chart: { type: 'line', title: 'Monthly Revenue', dataset: 'Order Revenue' },
      blocks: [
        { id: 'b11', type: 'heading', content: 'October surge, then steady climb' },
        { id: 'b12', type: 'body',    content: 'The quarter opened with a strong Oct spike driven by campaign launches. Nov and Dec held the gains with minimal churn.' },
        { id: 'b13', type: 'control', content: 'Metric', controlType: 'dropdown', options: ['Revenue', 'Orders', 'AOV'] },
        { id: 'b14', type: 'control', content: 'Smoothing', controlType: 'slider', min: 0, max: 10, value: 3 },
      ],
      steps: [
        { id: 'st5', label: 'Oct spike',    highlight: ['Oct'], annotation: 'Campaign launch — +18% in week one.' },
        { id: 'st6', label: 'Nov plateau',  highlight: ['Nov'], annotation: 'Revenue stabilised after promotion ended.' },
        { id: 'st7', label: 'Dec close',    highlight: ['Dec'], annotation: 'Strong close — beat forecast by 6%.' },
      ],
    },
    {
      id: 's5', layout: 'text-only', label: 'Closing', mechanic: 'step',
      blocks: [
        { id: 'b15', type: 'heading', content: 'What this means for Q1' },
        { id: 'b16', type: 'body',    content: 'The Q4 momentum gives us a strong pipeline heading into 2026. APAC will be the primary growth target, with EMEA secondary.' },
        { id: 'b17', type: 'body',    content: 'Product mix shifts toward higher-margin tiers — expect AOV to rise even if volume growth moderates.' },
      ],
      steps: [],
    },
  ]
};

/* ── STATE ─────────────────────────────────────────────────── */
let activeSectionId = STORY.sections[1].id; // start on section 2
let activeStepId    = STORY.sections[1].steps[0].id;
let activeBlockId   = null;
let inspectorTab    = 'content';
let chartInstance   = null;
let inspectorContext = 'section'; // 'section' | 'step' | 'block'

/* ── LAYOUT DEFINITIONS ────────────────────────────────────── */
const LAYOUTS = [
  { id: 'cover',       label: 'Cover',        sub: 'Title + intro',     svgId: 'lt-cover'      },
  { id: 'split-left',  label: 'Split Left',   sub: 'Chart left, text right', svgId: 'lt-split-left'  },
  { id: 'split-right', label: 'Split Right',  sub: 'Text left, chart right', svgId: 'lt-split-right' },
  { id: 'callout',     label: 'Callout',      sub: 'Centred stat hero', svgId: 'lt-callout'    },
  { id: 'fullbleed',   label: 'Full Bleed',   sub: 'Full-width chart',  svgId: 'lt-fullbleed'  },
  { id: 'text-only',   label: 'Text Only',    sub: 'Narrative columns', svgId: 'lt-text'       },
];

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('scrollytellers');
  renderAll();
  bindKeyboard();
});

function renderAll() {
  renderSectionList();
  renderCanvas();
  renderInspector();
  renderStepTimeline();
  lucide.createIcons();
}

/* ── SECTION LIST ──────────────────────────────────────────── */
function renderSectionList() {
  const body = document.getElementById('section-list-body');
  document.getElementById('section-count').textContent = STORY.sections.length;

  body.innerHTML = STORY.sections.map((sec, idx) => {
    const isActive = sec.id === activeSectionId;
    const thumbHtml = sectionThumbSvg(sec.layout);
    const mechIcon = sec.mechanic === 'step'
      ? '<i data-lucide="footprints"></i>'
      : '<i data-lucide="wave"></i>';
    const stepCount = sec.steps.length > 0
      ? `<span>${sec.steps.length} steps</span>` : '';

    return `
      <div class="section-card${isActive ? ' active' : ''}"
           onclick="selectSection('${sec.id}')"
           draggable="true">
        <div class="section-thumb">${thumbHtml}</div>
        <div class="section-card-label">${idx + 1}. ${sec.label}</div>
        <div class="section-card-meta">
          ${mechIcon}
          <span>${layoutLabel(sec.layout)}</span>
          ${stepCount}
        </div>
      </div>
    `;
  }).join('');
}

function layoutLabel(id) {
  const map = {
    'cover': 'Cover', 'split-left': 'Split L', 'split-right': 'Split R',
    'callout': 'Callout', 'fullbleed': 'Full bleed', 'text-only': 'Text only',
  };
  return map[id] || id;
}

function sectionThumbSvg(layout) {
  const svgs = {
    cover: `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="#0D1117"/>
      <rect x="20" y="10" width="40" height="4" rx="2" fill="#16A34A" opacity="0.8"/>
      <rect x="14" y="18" width="52" height="3" rx="1.5" fill="white" opacity="0.6"/>
      <rect x="22" y="24" width="36" height="2" rx="1" fill="white" opacity="0.3"/>
    </svg>`,

    'split-left': `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="#F8FAFC"/>
      <rect width="36" height="36" fill="#EFF1F5"/>
      <rect x="4" y="6" width="28" height="3" rx="1.5" fill="#CBD5E1"/>
      <rect x="4" y="12" width="28" height="12" rx="2" fill="#16A34A" opacity="0.3"/>
      <rect x="42" y="8" width="30" height="2.5" rx="1.25" fill="#94A3B8"/>
      <rect x="42" y="14" width="24" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="42" y="19" width="26" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="42" y="24" width="20" height="2" rx="1" fill="#CBD5E1"/>
    </svg>`,

    'split-right': `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="#F8FAFC"/>
      <rect x="44" width="36" height="36" fill="#EFF1F5"/>
      <rect x="8" y="8" width="30" height="2.5" rx="1.25" fill="#94A3B8"/>
      <rect x="8" y="14" width="24" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="8" y="19" width="26" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="48" y="6" width="28" height="3" rx="1.5" fill="#CBD5E1"/>
      <rect x="48" y="12" width="28" height="12" rx="2" fill="#3B82F6" opacity="0.3"/>
    </svg>`,

    callout: `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="white"/>
      <rect x="26" y="6" width="28" height="10" rx="2" fill="#16A34A" opacity="0.2"/>
      <rect x="30" y="20" width="20" height="3" rx="1.5" fill="#94A3B8"/>
      <rect x="34" y="26" width="12" height="2" rx="1" fill="#CBD5E1"/>
    </svg>`,

    fullbleed: `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="#0D1117"/>
      <rect x="4" y="18" width="72" height="10" rx="2" fill="#3B82F6" opacity="0.3"/>
      <rect x="16" y="8" width="48" height="6" rx="1.5" fill="white" opacity="0.15"/>
    </svg>`,

    'text-only': `<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <rect width="80" height="36" fill="white"/>
      <rect x="16" y="6" width="48" height="3" rx="1.5" fill="#94A3B8"/>
      <rect x="8" y="13" width="64" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="8" y="18" width="60" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="8" y="23" width="56" height="2" rx="1" fill="#CBD5E1"/>
      <rect x="8" y="28" width="40" height="2" rx="1" fill="#CBD5E1"/>
    </svg>`,
  };
  return svgs[layout] || svgs['text-only'];
}

/* ── CANVAS ─────────────────────────────────────────────────── */
function renderCanvas() {
  const section = getActiveSection();
  if (!section) return;

  // Update topbar
  document.getElementById('canvas-section-label').textContent =
    `Section ${sectionIndex() + 1} — ${section.label}`;

  const pill = document.getElementById('mechanic-pill');
  if (section.mechanic === 'step') {
    pill.className = 'mechanic-pill step';
    pill.innerHTML = '<i data-lucide="footprints"></i> Step-based';
  } else {
    pill.className = 'mechanic-pill continuous';
    pill.innerHTML = '<i data-lucide="wave"></i> Continuous';
  }

  // Show/hide step timeline
  const timeline = document.getElementById('step-timeline');
  timeline.style.display = section.steps.length > 0 || section.mechanic === 'step' ? '' : 'none';

  // Render canvas content
  const content = document.getElementById('canvas-content');
  content.innerHTML = renderSectionCanvas(section);

  // Draw chart if needed
  setTimeout(() => {
    if (section.chart) renderBuilderChart(section);
    lucide.createIcons();
  }, 50);
}

function renderSectionCanvas(section) {
  switch (section.layout) {
    case 'cover':      return renderCoverCanvas(section);
    case 'split-left': return renderSplitCanvas(section, 'left');
    case 'split-right': return renderSplitCanvas(section, 'right');
    case 'callout':    return renderCalloutCanvas(section);
    case 'fullbleed':  return renderFullbleedCanvas(section);
    case 'text-only':  return renderTextOnlyCanvas(section);
    default:           return renderTextOnlyCanvas(section);
  }
}

function renderCoverCanvas(section) {
  const b = blockByType(section, 'eyebrow');
  const h = blockByType(section, 'heading');
  const s = blockByType(section, 'subtext');
  return `
    <div class="canvas-cover" onclick="selectBlock(null)">
      <div class="canvas-cover-eyebrow" onclick="event.stopPropagation();selectBlock('${b?.id}')">${b?.content || 'Eyebrow text'}</div>
      <div class="canvas-cover-title"   onclick="event.stopPropagation();selectBlock('${h?.id}')">${h?.content || 'Title'}</div>
      <div class="canvas-cover-sub"     onclick="event.stopPropagation();selectBlock('${s?.id}')">${s?.content || 'Sub-heading'}</div>
      <div class="canvas-cover-scroll">
        <span>Scroll</span>
        <i data-lucide="chevron-down" class="scroll-arrow"></i>
      </div>
    </div>
  `;
}

function renderSplitCanvas(section, side) {
  const chartSide = side === 'left' ? 'left' : 'right';
  const textSide  = side === 'left' ? 'right' : 'left';

  const stickyArea = `
    <div class="canvas-sticky-area">
      <div class="canvas-sticky-label">
        <i data-lucide="pin"></i> Sticky chart area
      </div>
      <div class="canvas-chart-area">
        <canvas id="builder-chart" style="width:100%;max-height:200px;"></canvas>
      </div>
      ${section.steps.length > 0 ? `
        <div class="step-indicator-bar">
          ${section.steps.map((st, i) => `
            <div class="step-ind-dot${st.id === activeStepId ? ' active' : ''}"
                 onclick="selectStep('${st.id}')"
                 title="${st.label}"></div>
          `).join('')}
          <span style="font-size:10px;color:var(--text-4);margin-left:4px;">${activeStep()?.label || ''}</span>
        </div>
      ` : ''}
    </div>
  `;

  const textArea = `
    <div class="canvas-scroll-area">
      ${renderBlocks(section)}
    </div>
  `;

  const [col1, col2] = side === 'left' ? [stickyArea, textArea] : [textArea, stickyArea];

  return `
    <div class="canvas-split layout-${side}">
      ${col1}
      ${col2}
    </div>
  `;
}

function renderCalloutCanvas(section) {
  const stat = blockByType(section, 'stat');
  const h    = blockByType(section, 'heading');
  const b    = blockByType(section, 'body');
  return `
    <div class="canvas-callout" onclick="selectBlock(null)">
      <div class="canvas-callout-num"   onclick="event.stopPropagation();selectBlock('${stat?.id}')">${stat?.content || '0%'}</div>
      <div class="canvas-callout-label" onclick="event.stopPropagation();selectBlock('${h?.id}')">${h?.content || 'Metric label'}</div>
      <div class="canvas-callout-sub"   onclick="event.stopPropagation();selectBlock('${b?.id}')">${b?.content || 'Context sentence'}</div>
    </div>
  `;
}

function renderFullbleedCanvas(section) {
  return `
    <div class="canvas-fullbleed" onclick="selectBlock(null)">
      <div class="canvas-fullbleed-bg"></div>
      <div class="canvas-fullbleed-chart">
        <canvas id="builder-chart" style="width:480px;height:160px;max-width:90%;"></canvas>
      </div>
      <div class="canvas-fullbleed-overlay">
        ${section.blocks.filter(b => b.type !== 'control').map(block => `
          <div class="${blockClass(block)}"
               style="color:rgba(255,255,255,0.85);text-shadow:0 1px 4px rgba(0,0,0,0.6);"
               onclick="event.stopPropagation();selectBlock('${block.id}')">
            ${block.content}
            <span class="canvas-block-type-chip" style="background:rgba(255,255,255,0.15);color:white;">${block.type}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTextOnlyCanvas(section) {
  return `
    <div class="canvas-text-only" onclick="selectBlock(null)">
      ${renderBlocks(section)}
    </div>
  `;
}

function renderBlocks(section) {
  let html = '';
  let stepIdx = 0;

  // Interleave step trigger lines between step-triggering content
  section.blocks.forEach((block, i) => {
    if (block.type === 'control') {
      html += renderControlBlock(block);
      return;
    }

    // Before body blocks (except first block), possibly insert a step trigger
    if (block.type === 'body' && stepIdx < section.steps.length) {
      const step = section.steps[stepIdx];
      const isActive = step.id === activeStepId;
      html += `
        <div class="step-trigger-line${isActive ? ' active-step' : ''}"
             onclick="selectStep('${step.id}')">
          <div class="stl-line"></div>
          <div class="stl-badge">↓ ${step.label}</div>
          <div class="stl-line"></div>
        </div>
      `;
      stepIdx++;
    }

    const isSelected = block.id === activeBlockId;
    html += `
      <div class="canvas-block${isSelected ? ' selected' : ''}"
           onclick="event.stopPropagation();selectBlock('${block.id}')">
        <div class="${blockClass(block)}">${block.content}</div>
        <span class="canvas-block-type-chip">${block.type}</span>
      </div>
    `;

    // Add block btn after each block
    html += `
      <div class="add-block-row">
        <button class="add-block-btn" onclick="event.stopPropagation();addBlockAfter('${block.id}')">
          <i data-lucide="plus"></i>
        </button>
      </div>
    `;
  });

  return html;
}

function renderControlBlock(block) {
  const isSelected = block.id === activeBlockId;
  if (block.controlType === 'slider') {
    return `
      <div class="canvas-control-block${isSelected ? ' selected' : ''}"
           style="${isSelected ? 'border-color:var(--accent);' : ''}"
           onclick="event.stopPropagation();selectBlock('${block.id}')">
        <div class="ccb-label"><i data-lucide="sliders-horizontal"></i> Slider control</div>
        <div class="ccb-control">
          <div class="ccb-control-name">${block.content}</div>
          <div class="ccb-control-type">${block.min ?? 0}–${block.max ?? 10}</div>
        </div>
        <div style="margin-top:6px;">
          <input type="range" class="ccb-slider" min="${block.min ?? 0}" max="${block.max ?? 10}" value="${block.value ?? 5}" style="width:100%;">
        </div>
      </div>
    `;
  } else if (block.controlType === 'dropdown') {
    return `
      <div class="canvas-control-block${isSelected ? ' selected' : ''}"
           style="${isSelected ? 'border-color:var(--accent);' : ''}"
           onclick="event.stopPropagation();selectBlock('${block.id}')">
        <div class="ccb-label"><i data-lucide="chevrons-up-down"></i> Dropdown control</div>
        <div class="ccb-control">
          <div class="ccb-control-name">${block.content}</div>
          <select style="flex:1;padding:4px 8px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-size:12px;color:var(--text-1);">
            ${(block.options || []).map(o => `<option>${o}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }
  return '';
}

function blockClass(block) {
  const classes = { heading: 'canvas-block-text heading', body: 'canvas-block-text', callout: 'canvas-block-text callout', stat: 'canvas-block-text callout', eyebrow: 'canvas-block-text', subtext: 'canvas-block-text' };
  return classes[block.type] || 'canvas-block-text';
}

/* ── BUILDER CHART ─────────────────────────────────────────── */
function renderBuilderChart(section) {
  const canvas = document.getElementById('builder-chart');
  if (!canvas) return;

  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const ctx = canvas.getContext('2d');
  const step = activeStep();

  const PALETTE = ['#16A34A','#06B6D4','#3B82F6','#F59E0B','#8B5CF6','#EC4899'];

  if (section.chart?.type === 'bar') {
    const labels = ['NAM', 'EMEA', 'APAC', 'LATAM'];
    const data   = [4.2, 3.1, 5.8, 1.9];
    const highlights = step?.highlight || labels;
    const colors = labels.map(l => highlights.includes(l) ? '#16A34A' : '#CBD5E1');

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderRadius: 6, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#64748B' } },
          y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 }, color: '#94A3B8' }, beginAtZero: true }
        }
      }
    });
  } else if (section.chart?.type === 'line') {
    const labels = ['Oct 1','Oct 8','Oct 15','Oct 22','Nov 1','Nov 8','Nov 15','Nov 22','Dec 1','Dec 8','Dec 15','Dec 22'];
    const data   = [28, 34, 31, 42, 38, 36, 39, 37, 41, 44, 46, 52];
    const highlights = step?.highlight || [];

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data, borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          fill: true, tension: 0.4,
          pointRadius: labels.map((l, i) => {
            const mth = l.split(' ')[0];
            return highlights.includes(mth) ? 6 : 3;
          }),
          pointBackgroundColor: labels.map((l, i) => {
            const mth = l.split(' ')[0];
            return highlights.includes(mth) ? '#3B82F6' : 'white';
          }),
          pointBorderColor: '#3B82F6', pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94A3B8', maxTicksLimit: 6 } },
          y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 }, color: '#94A3B8' }, beginAtZero: false }
        }
      }
    });
  }
}

/* ── STEP TIMELINE ─────────────────────────────────────────── */
function renderStepTimeline() {
  const section = getActiveSection();
  const track   = document.getElementById('step-track');
  if (!section || !track) return;

  if (section.steps.length === 0) {
    track.innerHTML = `<span style="font-size:12px;color:var(--text-3);padding:4px 0;">No steps defined. Click + to add scroll-triggered steps.</span>`;
    return;
  }

  track.innerHTML = section.steps.map((step, i) => {
    const isActive = step.id === activeStepId;
    return `
      <div class="step-node${isActive ? ' active' : ''}" onclick="selectStep('${step.id}')">
        <div class="step-dot">${i + 1}</div>
        <div class="step-label-text">${step.label}</div>
      </div>
    `;
  }).join('') + `
    <div class="step-node add-step" style="margin-left:12px;">
      <button class="add-step-btn" onclick="addStep()" title="Add step">
        <i data-lucide="plus"></i>
      </button>
    </div>
  `;
}

/* ── INSPECTOR ─────────────────────────────────────────────── */
function renderInspector() {
  const section = getActiveSection();
  if (!section) return;

  const hd   = document.getElementById('inspector-hd');
  const tabs = document.getElementById('inspector-tabs');
  const body = document.getElementById('inspector-body');

  if (activeBlockId) {
    inspectorContext = 'block';
    const block = getActiveBlock();
    hd.innerHTML = '<i data-lucide="square"></i> Block Settings';
    tabs.style.display = '';
    body.innerHTML = renderBlockInspector(block);
  } else if (activeStepId && section.steps.length > 0) {
    inspectorContext = 'step';
    const step = activeStep();
    hd.innerHTML = '<i data-lucide="milestone"></i> Step Settings';
    tabs.style.display = 'none';
    body.innerHTML = renderStepInspector(step, section);
  } else {
    inspectorContext = 'section';
    hd.innerHTML = '<i data-lucide="settings-2"></i> Section Settings';
    tabs.style.display = '';
    body.innerHTML = inspectorTab === 'content'
      ? renderSectionContentInspector(section)
      : renderSectionStyleInspector(section);
  }

  setActiveInspectorTabs();
}

function renderSectionContentInspector(section) {
  return `
    <!-- Layout picker -->
    <div class="inspector-section">
      <div class="inspector-section-title">Layout</div>
      <div class="layout-grid">
        ${LAYOUTS.map(l => `
          <div class="layout-opt${section.layout === l.id ? ' selected' : ''}"
               onclick="changeLayout('${l.id}')">
            <div class="layout-opt-thumb">${sectionThumbSvg(l.id)}</div>
            <div class="layout-opt-label">${l.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Scroll mechanic -->
    <div class="inspector-section">
      <div class="inspector-section-title">Scroll Mechanic</div>
      <div class="mechanic-toggle-wrap">
        <button class="mechanic-btn${section.mechanic === 'step' ? ' active' : ''}"
                onclick="setMechanic('step')">
          <div>Step-based</div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px;">Discrete scroll thresholds</div>
        </button>
        <button class="mechanic-btn${section.mechanic === 'continuous' ? ' active' : ''}"
                onclick="setMechanic('continuous')">
          <div>Continuous</div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px;">Scroll pos = data dimension</div>
        </button>
      </div>
    </div>

    <!-- Chart binding (if applicable) -->
    ${section.chart ? `
    <div class="inspector-section">
      <div class="inspector-section-title">Chart</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div>
          <label class="form-label">Chart type</label>
          <select class="form-control" onchange="updateChartType(this.value)">
            <option value="bar"  ${section.chart.type === 'bar'  ? 'selected' : ''}>Bar chart</option>
            <option value="line" ${section.chart.type === 'line' ? 'selected' : ''}>Line chart</option>
            <option value="doughnut" ${section.chart.type === 'doughnut' ? 'selected' : ''}>Doughnut</option>
          </select>
        </div>
        <div>
          <label class="form-label">Dataset</label>
          <select class="form-control">
            <option>Order Revenue</option>
            <option>Regional Sales</option>
            <option>Customer Metrics</option>
            <option>Campaign Spend</option>
          </select>
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;">
          <input type="checkbox" checked style="accent-color:var(--accent);"> Sticky while scrolling
        </label>
      </div>
    </div>
    ` : ''}

    <!-- Section label -->
    <div class="inspector-section">
      <div class="inspector-section-title">Label</div>
      <input class="form-control" value="${section.label}"
             oninput="updateSectionLabel(this.value)" placeholder="Section label…">
    </div>
  `;
}

function renderSectionStyleInspector(section) {
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Background</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div>
          <label class="form-label">Colour</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${['#FFFFFF','#F8FAFC','#0D1117','#F0FDF4','#EFF6FF','#FFF7ED'].map(c => `
              <div style="width:24px;height:24px;border-radius:4px;background:${c};border:1.5px solid rgba(0,0,0,0.12);cursor:pointer;"
                   title="${c}"></div>
            `).join('')}
          </div>
        </div>
        <label class="form-label">Min height</label>
        <select class="form-control">
          <option>Auto</option>
          <option>50vh</option>
          <option selected>100vh</option>
          <option>150vh</option>
        </select>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Spacing</div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;">
          <label class="form-label">Padding H</label>
          <select class="form-control"><option>Standard</option><option selected>Wide</option></select>
        </div>
        <div style="flex:1;">
          <label class="form-label">Padding V</label>
          <select class="form-control"><option>Compact</option><option selected>Standard</option><option>Spacious</option></select>
        </div>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Divider</div>
      <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;">
        <input type="checkbox" style="accent-color:var(--accent);"> Show section divider
      </label>
    </div>
  `;
}

function renderStepInspector(step, section) {
  if (!step) return '<div style="padding:20px;color:var(--text-3);font-size:13px;">No step selected.</div>';

  const allHighlights = getAllHighlightOptions(section);

  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Step ${stepIndex(step.id, section) + 1} — ${step.label}</div>
      <div style="display:flex;flex-direction:column;gap:10px;" class="step-state-section">
        <div>
          <label class="form-label">Label</label>
          <input class="form-control" value="${step.label}" oninput="updateStepLabel(this.value)" placeholder="Step label…">
        </div>
        <div>
          <label class="form-label">Highlight</label>
          <div class="step-highlight-chips">
            ${allHighlights.map(opt => `
              <div class="highlight-chip${(step.highlight || []).includes(opt) ? ' active' : ''}"
                   onclick="toggleHighlight('${step.id}', '${opt}')">
                ${opt}
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="form-label">Chart annotation</label>
          <textarea class="annotation-input" rows="2" placeholder="Annotation text for this step…"
                    oninput="updateStepAnnotation(this.value)">${step.annotation || ''}</textarea>
        </div>
      </div>
    </div>

    <div class="inspector-section">
      <div class="inspector-section-title">Filters</div>
      <div style="display:flex;flex-direction:column;gap:6px;" id="step-filters">
        <div class="step-filter-row">
          <select class="form-control" style="flex:2;">
            <option>region</option><option>channel</option><option>product_line</option>
          </select>
          <select class="form-control" style="flex:1;"><option>=</option><option>≠</option></select>
          <input class="form-control" style="flex:2;" placeholder="value" value="${step.highlight?.[0] || ''}">
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" style="margin-top:8px;width:100%;justify-content:center;"
              onclick="addStepFilter()">
        <i data-lucide="plus"></i> Add filter
      </button>
    </div>

    <div class="inspector-section">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="inspector-section-title" style="margin-bottom:0;">Navigation</div>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;">
        <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center;"
                onclick="prevStep()"><i data-lucide="arrow-left"></i> Prev</button>
        <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center;"
                onclick="nextStep()">Next <i data-lucide="arrow-right"></i></button>
      </div>
      <button class="btn btn-danger-ghost btn-sm" style="margin-top:6px;width:100%;justify-content:center;"
              onclick="deleteStep('${step.id}')">
        <i data-lucide="trash-2"></i> Delete step
      </button>
    </div>
  `;
}

function renderBlockInspector(block) {
  if (!block) return '';
  const isControl = block.type === 'control';

  const contentTab = `
    <div class="inspector-section">
      <div class="inspector-section-title">Block Type</div>
      <select class="form-control" onchange="updateBlockType(this.value)">
        ${['heading','body','eyebrow','subtext','stat','control'].map(t => `
          <option value="${t}" ${block.type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>
        `).join('')}
      </select>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Content</div>
      <textarea class="annotation-input" rows="3" oninput="updateBlockContent(this.value)">${block.content}</textarea>
    </div>
    ${isControl ? `
    <div class="inspector-section">
      <div class="inspector-section-title">Control Type</div>
      <select class="form-control" onchange="updateControlType(this.value)">
        <option value="dropdown" ${block.controlType === 'dropdown' ? 'selected' : ''}>Dropdown</option>
        <option value="slider"   ${block.controlType === 'slider'   ? 'selected' : ''}>Slider</option>
        <option value="checkbox" ${block.controlType === 'checkbox' ? 'selected' : ''}>Checkbox</option>
      </select>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Placement</div>
      <select class="form-control">
        <option>Inline (in text flow)</option>
        <option>Floating panel</option>
      </select>
    </div>
    ` : ''}
    <div class="inspector-section">
      <button class="btn btn-danger-ghost btn-sm" style="width:100%;justify-content:center;"
              onclick="deleteBlock('${block.id}')">
        <i data-lucide="trash-2"></i> Delete block
      </button>
    </div>
  `;

  return inspectorTab === 'content' ? contentTab : `
    <div class="inspector-section">
      <div class="inspector-section-title">Typography</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Font size</label>
          <select class="form-control"><option>Small</option><option selected>Medium</option><option>Large</option></select>
        </div>
        <div><label class="form-label">Font weight</label>
          <select class="form-control"><option>Regular</option><option>Medium</option><option selected>Bold</option></select>
        </div>
        <div><label class="form-label">Alignment</label>
          <div style="display:flex;gap:4px;">
            ${['align-left','align-center','align-right'].map(a => `
              <button style="flex:1;padding:5px;border:1.5px solid var(--border);border-radius:var(--r-sm);background:white;cursor:pointer;">
                <i data-lucide="${a}" style="width:12px;height:12px;"></i>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Spacing</div>
      <label class="form-label">Margin bottom</label>
      <select class="form-control"><option>Tight</option><option selected>Normal</option><option>Loose</option></select>
    </div>
  `;
}

function setActiveInspectorTabs() {
  document.querySelectorAll('.inspector-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById(`itab-${inspectorTab}`);
  if (activeTab) activeTab.classList.add('active');
}

/* ── SELECTION ─────────────────────────────────────────────── */
function selectSection(id) {
  activeSectionId = id;
  activeBlockId   = null;
  const section   = getActiveSection();
  activeStepId    = section?.steps?.[0]?.id || null;
  renderAll();
}

function selectStep(id) {
  activeStepId  = id;
  activeBlockId = null;
  inspectorContext = 'step';
  renderCanvas();
  renderInspector();
  renderStepTimeline();
  lucide.createIcons();
}

function selectBlock(id) {
  activeBlockId = id;
  if (id) inspectorContext = 'block';
  else inspectorContext = activeStepId ? 'step' : 'section';
  renderInspector();
  renderCanvas();
  lucide.createIcons();
}

/* ── MUTATIONS ─────────────────────────────────────────────── */
function toggleMechanic() {
  const section = getActiveSection();
  if (!section) return;
  section.mechanic = section.mechanic === 'step' ? 'continuous' : 'step';
  renderAll();
}

function setMechanic(m) {
  const section = getActiveSection();
  if (section) { section.mechanic = m; renderAll(); }
}

function changeLayout(layoutId) {
  const section = getActiveSection();
  if (section) { section.layout = layoutId; renderAll(); }
}

function updateSectionLabel(val) {
  const section = getActiveSection();
  if (section) {
    section.label = val;
    document.getElementById('canvas-section-label').textContent =
      `Section ${sectionIndex() + 1} — ${val}`;
    renderSectionList();
    lucide.createIcons();
  }
}

function updateChartType(val) {
  const section = getActiveSection();
  if (section?.chart) { section.chart.type = val; renderCanvas(); lucide.createIcons(); }
}

function addStep() {
  const section = getActiveSection();
  if (!section) return;
  const idx = section.steps.length + 1;
  const newStep = { id: `st-new-${Date.now()}`, label: `Step ${idx}`, highlight: [], annotation: '' };
  section.steps.push(newStep);
  activeStepId = newStep.id;
  renderAll();
}

function deleteStep(id) {
  const section = getActiveSection();
  if (!section) return;
  section.steps = section.steps.filter(s => s.id !== id);
  activeStepId = section.steps[0]?.id || null;
  renderAll();
}

function prevStep() {
  const section = getActiveSection();
  if (!section) return;
  const idx = section.steps.findIndex(s => s.id === activeStepId);
  if (idx > 0) selectStep(section.steps[idx - 1].id);
}

function nextStep() {
  const section = getActiveSection();
  if (!section) return;
  const idx = section.steps.findIndex(s => s.id === activeStepId);
  if (idx < section.steps.length - 1) selectStep(section.steps[idx + 1].id);
}

function updateStepLabel(val) {
  const step = activeStep();
  if (step) { step.label = val; renderStepTimeline(); renderCanvas(); lucide.createIcons(); }
}

function updateStepAnnotation(val) {
  const step = activeStep();
  if (step) step.annotation = val;
}

function toggleHighlight(stepId, opt) {
  const section = getActiveSection();
  const step = section?.steps.find(s => s.id === stepId);
  if (!step) return;
  if (!step.highlight) step.highlight = [];
  if (step.highlight.includes(opt)) step.highlight = step.highlight.filter(h => h !== opt);
  else step.highlight.push(opt);
  renderCanvas();
  renderInspector();
  lucide.createIcons();
}

function addBlockAfter(blockId) {
  const section = getActiveSection();
  if (!section) return;
  const idx = section.blocks.findIndex(b => b.id === blockId);
  const newBlock = { id: `b-new-${Date.now()}`, type: 'body', content: 'New paragraph text.' };
  section.blocks.splice(idx + 1, 0, newBlock);
  activeBlockId = newBlock.id;
  renderAll();
}

function deleteBlock(id) {
  const section = getActiveSection();
  if (!section) return;
  section.blocks = section.blocks.filter(b => b.id !== id);
  activeBlockId = null;
  renderAll();
}

function updateBlockType(val) {
  const block = getActiveBlock();
  if (block) { block.type = val; renderCanvas(); lucide.createIcons(); }
}

function updateBlockContent(val) {
  const block = getActiveBlock();
  if (block) { block.content = val; renderCanvas(); lucide.createIcons(); }
}

function updateControlType(val) {
  const block = getActiveBlock();
  if (block) { block.controlType = val; renderCanvas(); renderInspector(); lucide.createIcons(); }
}

function addStepFilter() { /* placeholder — would add a filter row */ }

/* ── INSPECTOR TAB ─────────────────────────────────────────── */
function setInspectorTab(tab) {
  inspectorTab = tab;
  renderInspector();
  lucide.createIcons();
}

/* ── PREVIEW ───────────────────────────────────────────────── */
function openPreview() {
  document.getElementById('preview-overlay').classList.add('open');
  const wrap = document.getElementById('preview-iframe-wrap');
  wrap.style.height = '100%';
  lucide.createIcons();
}

function closePreview() {
  document.getElementById('preview-overlay').classList.remove('open');
}

function setPreviewDevice(device, btn) {
  document.querySelectorAll('.preview-device-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const wrap = document.getElementById('preview-iframe-wrap');
  wrap.className = device === 'mobile' ? 'preview-iframe-wrap mobile' : 'preview-iframe-wrap';
  wrap.style.height = device === 'mobile' ? 'calc(100% - 40px)' : '100%';
}

/* ── ADD SECTION MODAL ─────────────────────────────────────── */
function openAddSectionModal() {
  const grid = document.getElementById('modal-layout-grid');
  grid.innerHTML = LAYOUTS.map(l => `
    <div class="modal-layout-opt" onclick="addSection('${l.id}')">
      <div class="modal-layout-thumb">${sectionThumbSvg(l.id)}</div>
      <div class="modal-layout-label">${l.label}</div>
      <div class="modal-layout-sub">${l.sub}</div>
    </div>
  `).join('');
  document.getElementById('add-modal').classList.add('open');
  lucide.createIcons();
}

function closeAddSectionModal() {
  document.getElementById('add-modal').classList.remove('open');
}

function addSection(layoutId) {
  const newSection = {
    id: `s-new-${Date.now()}`,
    layout: layoutId,
    label: `New ${layoutLabel(layoutId)} Section`,
    mechanic: 'step',
    blocks: [
      { id: `b-new-${Date.now()}-1`, type: 'heading', content: 'Section heading' },
      { id: `b-new-${Date.now()}-2`, type: 'body',    content: 'Add your narrative here.' },
    ],
    steps: layoutId !== 'cover' && layoutId !== 'callout' && layoutId !== 'text-only' ? [
      { id: `st-new-${Date.now()}`, label: 'Step 1', highlight: [], annotation: '' }
    ] : [],
    chart: layoutId === 'split-left' || layoutId === 'split-right' || layoutId === 'fullbleed' ? { type: 'bar', title: 'Chart', dataset: 'Order Revenue' } : null,
  };
  STORY.sections.push(newSection);
  activeSectionId = newSection.id;
  activeStepId    = newSection.steps[0]?.id || null;
  activeBlockId   = null;
  closeAddSectionModal();
  renderAll();
}

/* ── KEYBOARD ─────────────────────────────────────────────── */
function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft')  prevStep();
    if (e.key === 'ArrowRight') nextStep();
    if (e.key === 'Escape')     { selectBlock(null); closePreview(); closeAddSectionModal(); }
  });
}

/* ── HELPERS ──────────────────────────────────────────────── */
function getActiveSection() { return STORY.sections.find(s => s.id === activeSectionId); }
function activeStep()       { return getActiveSection()?.steps.find(s => s.id === activeStepId); }
function getActiveBlock()   { return getActiveSection()?.blocks.find(b => b.id === activeBlockId); }
function sectionIndex()     { return STORY.sections.findIndex(s => s.id === activeSectionId); }
function blockByType(section, type) { return section.blocks.find(b => b.type === type); }
function stepIndex(id, section) { return section.steps.findIndex(s => s.id === id); }
function getAllHighlightOptions(section) {
  // Return relevant highlight options based on chart type
  if (section.chart?.type === 'bar') return ['NAM', 'EMEA', 'APAC', 'LATAM'];
  if (section.chart?.type === 'line') return ['Oct', 'Nov', 'Dec'];
  return [];
}
