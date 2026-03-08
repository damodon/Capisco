/* ============================================================
   REPORTR — Scrollyteller Builder  v3
   scrollyteller-builder.js
   ============================================================ */

/* ── ELEMENT CATALOGUE ──────────────────────────────────────── */
const ELEMENT_TYPES = [
  { group: 'Text', items: [
    { id: 'heading',      icon: 'heading',            label: 'Heading',       desc: 'Section or step title' },
    { id: 'body',         icon: 'align-left',         label: 'Paragraph',     desc: 'Body / narrative copy' },
    { id: 'stat',         icon: 'hash',               label: 'Stat number',   desc: 'Big headline figure' },
    { id: 'eyebrow',      icon: 'type',               label: 'Eyebrow',       desc: 'Small label above a heading' },
    { id: 'callout-card', icon: 'sparkles',           label: 'Callout card',  desc: 'Highlighted insight box' },
    { id: 'divider',      icon: 'minus',              label: 'Divider',       desc: 'Horizontal rule' },
  ]},
  { group: 'Media & Charts', items: [
    { id: 'chart',  icon: 'bar-chart-2', label: 'Chart',  desc: 'Bar, line, doughnut, scatter' },
    { id: 'image',  icon: 'image',       label: 'Image',  desc: 'Photo, diagram, map' },
    { id: 'video',  icon: 'video',       label: 'Video',  desc: 'MP4 or YouTube link' },
  ]},
  { group: 'Interactive Controls', items: [
    { id: 'control-dropdown', icon: 'chevrons-up-down',    label: 'Dropdown',  desc: 'Filter by category' },
    { id: 'control-slider',   icon: 'sliders-horizontal',  label: 'Slider',    desc: 'Adjust a continuous value' },
    { id: 'control-checkbox', icon: 'check-square',        label: 'Checkbox',  desc: 'Toggle series on / off' },
  ]},
];

/* ── STORY DATA ─────────────────────────────────────────────── */
const STORY = {
  id: 'st01',
  title: 'Q4 2025 — Revenue in Focus',
  subtitle: 'A data-driven look at our strongest quarter yet.',
  theme: 'green',
  font: 'inter',
  sections: [
    {
      id: 's1', layout: 'cover', label: 'Cover', mechanic: 'step',
      blocks: [
        { id: 'b1', type: 'eyebrow',  content: 'Q4 2025 · Reportr Analytics' },
        { id: 'b2', type: 'heading',  content: 'Revenue in Focus' },
        { id: 'b3', type: 'subtext',  content: 'A data-driven look at our strongest quarter yet.' },
      ],
      steps: [],
    },
    {
      id: 's2', layout: 'split-left', label: 'Q4 by Region', mechanic: 'step',
      // stickyBlocks = what lives in the sticky (left) column
      stickyBlocks: [
        { id: 'sb1', type: 'chart', chartType: 'bar', chartTitle: 'Revenue by Region', dataset: 'Order Revenue', height: 'medium' },
        { id: 'sb2', type: 'control', content: 'Year', controlType: 'dropdown', options: ['2023','2024','2025'] },
      ],
      // blocks = what lives in the scroll (right) column
      blocks: [
        { id: 'b4', type: 'heading', content: 'Strong gains across every region' },
        { id: 'b5', type: 'body',    content: 'Q4 saw consistent outperformance, with APAC breaking records and NAM holding its position as the largest contributor.' },
        { id: 'b6', type: 'body',    content: 'EMEA growth was driven by a single high-value contract renewal in November.' },
      ],
      steps: [
        { id: 'st1', label: 'Overview',    highlight: ['NAM','EMEA','APAC','LATAM'], annotation: 'All four regions hit Q4 targets.' },
        { id: 'st2', label: 'APAC record', highlight: ['APAC'],  annotation: 'APAC revenue up 34% YoY — highest ever.' },
        { id: 'st3', label: 'EMEA spike',  highlight: ['EMEA'],  annotation: 'Nov contract renewal boosted EMEA by $2.1M.' },
        { id: 'st4', label: 'NAM steady',  highlight: ['NAM'],   annotation: 'NAM grew 8% — steady and reliable.' },
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
      id: 's6', layout: 'fullbleed', label: 'Channel Breakdown', mechanic: 'step',
      background: { type: 'chart', chartType: 'bar', title: 'Revenue by Channel', dataset: 'Order Revenue' },
      cards: [
        { id: 'c1', heading: 'Direct beats forecast',    body: 'Direct sales contributed 48% of total Q4 revenue — the channel\'s strongest share in three years.' },
        { id: 'c2', heading: 'Partner channel surges',   body: 'Partner-led revenue grew 62% YoY, driven by three new reseller agreements signed in September.' },
        { id: 'c3', heading: 'Self-serve matures',       body: 'Self-serve ARR crossed $1M for the first time, signalling product-led growth traction at scale.' },
      ],
      steps: [
        { id: 'sc1', label: 'Direct',     highlight: ['Direct'],      annotation: 'Direct: 48% of total — best share in 3 years.' },
        { id: 'sc2', label: 'Partner',    highlight: ['Partner'],     annotation: 'Partner channel +62% YoY.' },
        { id: 'sc3', label: 'Self-serve', highlight: ['Self-serve'],  annotation: 'Self-serve crossed $1M ARR.' },
      ],
      blocks: [],
    },
    {
      id: 's4', layout: 'split-right', label: 'Monthly Trend', mechanic: 'continuous',
      stickyBlocks: [
        { id: 'sb3', type: 'chart',   chartType: 'line', chartTitle: 'Monthly Revenue', dataset: 'Order Revenue', height: 'medium' },
        { id: 'sb4', type: 'control', content: 'Metric',    controlType: 'dropdown', options: ['Revenue','Orders','AOV'] },
        { id: 'sb5', type: 'control', content: 'Smoothing', controlType: 'slider', min: 0, max: 10, value: 3 },
      ],
      blocks: [
        { id: 'b11', type: 'heading', content: 'October surge, then steady climb' },
        { id: 'b12', type: 'body',    content: 'The quarter opened with a strong Oct spike driven by campaign launches.' },
        { id: 'b13', type: 'body',    content: 'Nov held the gains. Dec closed 6% ahead of forecast.' },
      ],
      steps: [
        { id: 'st5', label: 'Oct spike',   highlight: ['Oct'], annotation: 'Campaign launch — +18% in week one.' },
        { id: 'st6', label: 'Nov plateau', highlight: ['Nov'], annotation: 'Revenue stabilised after promotion ended.' },
        { id: 'st7', label: 'Dec close',   highlight: ['Dec'], annotation: 'Strong close — beat forecast by 6%.' },
      ],
    },
    {
      id: 's5', layout: 'text-only', label: 'Closing', mechanic: 'step',
      blocks: [
        { id: 'b15', type: 'heading', content: 'What this means for Q1' },
        { id: 'b16', type: 'body',    content: 'The Q4 momentum gives us a strong pipeline heading into 2026.' },
        { id: 'b17', type: 'body',    content: 'Product mix shifts toward higher-margin tiers — expect AOV to rise.' },
      ],
      steps: [],
    },
  ]
};

/* ── STATE ──────────────────────────────────────────────────── */
let activeSectionId    = STORY.sections[1].id;
let activeStepId       = STORY.sections[1].steps[0].id;
let activeBlockId      = null;      // block in scroll column
let activeStickyId     = null;      // block in sticky column
let activeCardId       = null;      // fullbleed overlay card
let inspectorTab       = 'content';
let inspectorContext   = 'section'; // 'story'|'section'|'step'|'block'|'sticky'|'card'
let chartInstance      = null;
let elementPickerMode  = null;      // 'scroll' | 'sticky'
let elementPickerAfter = null;

/* ── LAYOUT CONFIG ──────────────────────────────────────────── */
const LAYOUTS = [
  { id: 'cover',       label: 'Cover',       sub: 'Title + intro' },
  { id: 'split-left',  label: 'Split Left',  sub: 'Chart left, text right' },
  { id: 'split-right', label: 'Split Right', sub: 'Text left, chart right' },
  { id: 'fullbleed',   label: 'Full Bleed',  sub: 'Sticky bg, cards scroll over' },
  { id: 'callout',     label: 'Callout',     sub: 'Centred stat hero' },
  { id: 'text-only',   label: 'Text Only',   sub: 'Narrative columns' },
];

/* ── INIT ───────────────────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════════
   SECTION LIST
══════════════════════════════════════════════════════════════ */
function renderSectionList() {
  document.getElementById('section-count').textContent = STORY.sections.length;
  document.getElementById('story-title-display').textContent = STORY.title;

  const body = document.getElementById('section-list-body');
  const total = STORY.sections.length;
  body.innerHTML = STORY.sections.map((sec, idx) => {
    const isActive = sec.id === activeSectionId;
    const canUp   = idx > 0;
    const canDown = idx < total - 1;
    return `
      <div class="section-card${isActive ? ' active' : ''}" onclick="selectSection('${sec.id}')">
        <div class="section-drag-handle" title="Drag to reorder">
          <i data-lucide="grip-vertical"></i>
        </div>
        <div class="section-thumb" style="margin-left:10px;">${sectionThumbSvg(sec.layout)}</div>
        <div class="section-card-label">${idx + 1}. ${sec.label}</div>
        <div class="section-card-meta">
          <i data-lucide="${layoutIcon(sec.layout)}"></i>
          <span>${layoutLabel(sec.layout)}</span>
          ${sec.steps?.length ? `<span>· ${sec.steps.length} steps</span>` : ''}
        </div>
        <!-- Hover actions: move up / move down / delete -->
        <div class="section-card-actions">
          <button class="sec-action-btn" title="Move up"    onclick="event.stopPropagation();moveSectionUp('${sec.id}')"   ${canUp   ? '' : 'disabled style="opacity:0.3"'}><i data-lucide="chevron-up"></i></button>
          <button class="sec-action-btn" title="Move down"  onclick="event.stopPropagation();moveSectionDown('${sec.id}')" ${canDown ? '' : 'disabled style="opacity:0.3"'}><i data-lucide="chevron-down"></i></button>
          ${total > 1 ? `<button class="sec-action-btn del" title="Delete section" onclick="event.stopPropagation();deleteSection('${sec.id}')"><i data-lucide="trash-2"></i></button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   CANVAS
══════════════════════════════════════════════════════════════ */
function renderCanvas() {
  const section = getActiveSection();
  if (!section) return;

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

  document.getElementById('step-timeline').style.display =
    (section.steps?.length > 0 || ['split-left','split-right','fullbleed'].includes(section.layout)) ? '' : 'none';

  document.getElementById('canvas-content').innerHTML = renderSectionCanvas(section);

  setTimeout(() => {
    renderBuilderChart(section);
    lucide.createIcons();
  }, 50);
}

function renderSectionCanvas(section) {
  switch (section.layout) {
    case 'cover':       return renderCoverCanvas(section);
    case 'split-left':  return renderSplitCanvas(section, 'left');
    case 'split-right': return renderSplitCanvas(section, 'right');
    case 'callout':     return renderCalloutCanvas(section);
    case 'fullbleed':   return renderFullbleedCanvas(section);
    case 'text-only':   return renderTextOnlyCanvas(section);
    default:            return renderTextOnlyCanvas(section);
  }
}

/* ── Cover ───────────────────────────────────────────────── */
function renderCoverCanvas(section) {
  const b = blockByType(section, 'eyebrow');
  const h = blockByType(section, 'heading');
  const s = blockByType(section, 'subtext');
  return `
    <div class="canvas-cover" onclick="clearSelection()">
      <div class="canvas-cover-eyebrow canvas-inline-block${activeBlockId===b?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${b?.id}')">${b?.content||'Eyebrow text'}</div>
      <div class="canvas-cover-title canvas-inline-block${activeBlockId===h?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${h?.id}')">${h?.content||'Story title'}</div>
      <div class="canvas-cover-sub canvas-inline-block${activeBlockId===s?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${s?.id}')">${s?.content||'Sub-heading'}</div>
      <div class="canvas-cover-scroll"><span>Scroll</span><i data-lucide="chevron-down" class="scroll-arrow"></i></div>
    </div>
    ${renderScrollColumnBottom(section, 'cover-end')}
  `;
}

/* ── Split (left or right) ───────────────────────────────── */
function renderSplitCanvas(section, side) {
  const stickyBlocks = section.stickyBlocks || [];

  const stickyCol = `
    <div class="canvas-sticky-area${activeStickyId ? ' has-selection' : ''}"
         onclick="clearSelection()">
      <!-- Zone label -->
      <div class="canvas-zone-label">
        <i data-lucide="pin" style="width:10px;height:10px;"></i>
        Sticky column — stays on screen while text scrolls
      </div>

      <!-- Sticky blocks -->
      ${stickyBlocks.map((sb, i) => renderStickyBlock(sb)).join('')}

      <!-- Add to sticky -->
      <button class="add-sticky-btn" onclick="event.stopPropagation();openElementPicker('sticky','__sticky_end__')"
              title="Add chart, image, video or control to the sticky column">
        <i data-lucide="plus"></i> Add to sticky column
      </button>

      <!-- Step dots -->
      ${section.steps?.length ? `
        <div class="step-indicator-bar" style="margin-top:auto;">
          ${section.steps.map(st => `
            <div class="step-ind-dot${st.id===activeStepId?' active':''}"
                 onclick="event.stopPropagation();selectStep('${st.id}')" title="${st.label}"></div>
          `).join('')}
          <span style="font-size:10px;color:var(--text-4);margin-left:4px;">${activeStep()?.label||''}</span>
        </div>
      ` : ''}
    </div>
  `;

  const scrollCol = `
    <div class="canvas-scroll-area" onclick="clearSelection()">
      <div class="canvas-zone-label" style="background:transparent;border-color:transparent;">
        <i data-lucide="move-vertical" style="width:10px;height:10px;"></i>
        Scroll column — text and elements that scroll past the sticky chart
      </div>
      ${renderScrollBlocks(section)}
      ${renderScrollColumnBottom(section, '__scroll_end__')}
    </div>
  `;

  const [col1, col2] = side === 'left' ? [stickyCol, scrollCol] : [scrollCol, stickyCol];
  return `<div class="canvas-split layout-${side}">${col1}${col2}</div>`;
}

/* ── Sticky block rendering ──────────────────────────────── */
function renderStickyBlock(sb) {
  const isSelected = activeStickyId === sb.id;
  const sel = isSelected ? ' selected' : '';

  if (sb.type === 'chart') {
    return `
      <div class="sticky-block-card${sel}" onclick="event.stopPropagation();selectStickyBlock('${sb.id}')">
        <div class="sticky-block-label">
          <i data-lucide="bar-chart-2"></i>
          ${sb.chartTitle || 'Chart'} · ${sb.chartType || 'bar'}
          <span class="sticky-block-badge">${sb.dataset || 'No dataset'}</span>
        </div>
        <div style="position:relative;min-height:160px;background:white;border-radius:6px;overflow:hidden;">
          <canvas id="builder-chart" style="width:100%;max-height:180px;"></canvas>
        </div>
        ${isSelected ? `<div class="sticky-block-selection-ring">Chart selected — edit in Inspector →</div>` : ''}
      </div>
      <div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('sticky','${sb.id}')" title="Add element after this"><i data-lucide="plus"></i></button></div>
    `;
  }

  if (sb.type === 'image') {
    return `
      <div class="sticky-block-card${sel}" onclick="event.stopPropagation();selectStickyBlock('${sb.id}')">
        <div class="sticky-block-label"><i data-lucide="image"></i> Image</div>
        <div style="height:120px;background:linear-gradient(135deg,#E2E8F0,#CBD5E1);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text-4);">
          <i data-lucide="image" style="width:24px;height:24px;"></i>
        </div>
      </div>
      <div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('sticky','${sb.id}')" title="Add element"><i data-lucide="plus"></i></button></div>
    `;
  }

  if (sb.type === 'control') {
    return `
      <div class="canvas-control-block${sel}" onclick="event.stopPropagation();selectStickyBlock('${sb.id}')">
        <div class="ccb-label">
          <i data-lucide="${sb.controlType==='slider' ? 'sliders-horizontal' : 'chevrons-up-down'}"></i>
          ${sb.controlType==='slider' ? 'Slider' : 'Dropdown'} · ${sb.content}
        </div>
        ${sb.controlType === 'slider'
          ? `<input type="range" class="ccb-slider" min="${sb.min||0}" max="${sb.max||10}" value="${sb.value||5}" style="width:100%;">`
          : `<select style="width:100%;padding:4px 8px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-size:12px;">${(sb.options||[]).map(o=>`<option>${o}</option>`).join('')}</select>`
        }
      </div>
      <div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('sticky','${sb.id}')" title="Add element"><i data-lucide="plus"></i></button></div>
    `;
  }

  return `
    <div class="sticky-block-card${sel}" onclick="event.stopPropagation();selectStickyBlock('${sb.id}')">
      <div class="sticky-block-label"><i data-lucide="layout"></i> ${sb.type}</div>
      <div class="canvas-block-text">${sb.content||''}</div>
    </div>
    <div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('sticky','${sb.id}')" title="Add element"><i data-lucide="plus"></i></button></div>
  `;
}

/* ── Scroll blocks ───────────────────────────────────────── */
function renderScrollBlocks(section) {
  let html = '';
  let stepIdx = 0;

  (section.blocks || []).forEach((block, i) => {
    if (block.type === 'divider') {
      html += `<div style="padding:4px 0;"><hr style="border:none;border-top:1.5px dashed var(--border);"></div>`;
      return;
    }
    if (block.type === 'control') {
      html += renderControlBlock(block);
      html += `<div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('scroll','${block.id}')" title="Add element here"><i data-lucide="plus"></i></button></div>`;
      return;
    }
    if (block.type === 'callout-card') {
      html += `
        <div class="canvas-block${activeBlockId===block.id?' selected':''}"
             style="background:var(--accent-light);border-color:var(--accent-mid);border-radius:10px;padding:12px;"
             onclick="event.stopPropagation();selectBlock('${block.id}')">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--accent-text);margin-bottom:4px;">💡 Insight</div>
          <div class="canvas-block-text">${block.content}</div>
          <span class="canvas-block-type-chip">callout</span>
        </div>
      `;
      html += `<div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('scroll','${block.id}')" title="Add element here"><i data-lucide="plus"></i></button></div>`;
      return;
    }
    if (block.type === 'image') {
      html += `
        <div class="canvas-block${activeBlockId===block.id?' selected':''}"
             style="padding:0;overflow:hidden;border-radius:8px;"
             onclick="event.stopPropagation();selectBlock('${block.id}')">
          <div style="height:80px;background:linear-gradient(135deg,#E2E8F0,#CBD5E1);display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text-4);">
            <i data-lucide="image" style="width:18px;height:18px;"></i>
            <span style="font-size:12px;">${block.content||'Image'}</span>
          </div>
          <span class="canvas-block-type-chip">image</span>
        </div>
      `;
      html += `<div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('scroll','${block.id}')" title="Add element here"><i data-lucide="plus"></i></button></div>`;
      return;
    }
    if (block.type === 'chart') {
      html += `
        <div class="canvas-block${activeBlockId===block.id?' selected':''}"
             style="padding:0;overflow:hidden;border-radius:8px;background:var(--surface);"
             onclick="event.stopPropagation();selectBlock('${block.id}')">
          <div style="height:100px;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text-3);">
            <i data-lucide="bar-chart-2" style="width:18px;height:18px;"></i>
            <span style="font-size:12px;font-weight:500;">${block.chartTitle||'Inline chart'} · ${block.chartType||'bar'}</span>
          </div>
          <span class="canvas-block-type-chip">chart</span>
        </div>
      `;
      html += `<div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('scroll','${block.id}')" title="Add element here"><i data-lucide="plus"></i></button></div>`;
      return;
    }

    // Before body blocks, maybe insert a step trigger
    if (block.type === 'body' && stepIdx < (section.steps?.length || 0)) {
      const step = section.steps[stepIdx];
      const isActive = step.id === activeStepId;
      html += `
        <div class="step-trigger-line${isActive ? ' active-step' : ''}"
             onclick="event.stopPropagation();selectStep('${step.id}')">
          <div class="stl-line"></div>
          <div class="stl-badge">↓ ${step.label}</div>
          <div class="stl-line"></div>
        </div>
      `;
      stepIdx++;
    }

    const isSelected = activeBlockId === block.id;
    html += `
      <div class="canvas-block${isSelected ? ' selected' : ''}"
           onclick="event.stopPropagation();selectBlock('${block.id}')">
        <div class="${blockClass(block)}">${block.content}</div>
        <span class="canvas-block-type-chip">${block.type}</span>
      </div>
    `;
    html += `<div class="add-block-row"><button class="add-block-btn" onclick="event.stopPropagation();openElementPicker('scroll','${block.id}')" title="Add element here"><i data-lucide="plus"></i></button></div>`;
  });

  return html;
}

function renderScrollColumnBottom(section, markerId) {
  return `
    <div style="padding:8px 0 4px;display:flex;justify-content:center;">
      <button class="add-sticky-btn" style="width:auto;padding:6px 16px;"
              onclick="event.stopPropagation();openElementPicker('scroll','${markerId}')">
        <i data-lucide="plus"></i> Add text, chart, image or control
      </button>
    </div>
  `;
}

/* ── Callout ──────────────────────────────────────────────── */
function renderCalloutCanvas(section) {
  const stat = blockByType(section, 'stat');
  const h    = blockByType(section, 'heading');
  const b    = blockByType(section, 'body');
  return `
    <div class="canvas-callout" onclick="clearSelection()">
      <div class="canvas-callout-num canvas-inline-block${activeBlockId===stat?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${stat?.id}')">${stat?.content||'0%'}</div>
      <div class="canvas-callout-label canvas-inline-block${activeBlockId===h?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${h?.id}')">${h?.content||'Metric'}</div>
      <div class="canvas-callout-sub canvas-inline-block${activeBlockId===b?.id?' sel':''}"
           onclick="event.stopPropagation();selectBlock('${b?.id}')">${b?.content||'Context'}</div>
    </div>
  `;
}

/* ── Full Bleed ───────────────────────────────────────────── */
function renderFullbleedCanvas(section) {
  const bg    = section.background || { type: 'chart', chartType: 'bar' };
  const cards = section.cards || [];
  const bgLabel = { chart:'📊 Chart', video:'🎬 Video', image:'🖼 Image', colour:'🎨 Colour' }[bg.type] || 'Chart';

  return `
    <!-- Background layer -->
    <div style="background:#0D1117;padding:14px;position:relative;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;">
          <i data-lucide="layers" style="width:11px;height:11px;vertical-align:middle;margin-right:4px;"></i>
          Sticky background — ${bgLabel}
        </span>
        <div style="display:flex;gap:4px;">
          ${['chart','video','image','colour'].map(t => `
            <button onclick="setBgType('${t}')"
              style="padding:2px 8px;font-size:10px;font-weight:600;border-radius:20px;cursor:pointer;
                     border:1.5px solid ${bg.type===t?'#16A34A':'rgba(255,255,255,0.2)'};
                     background:${bg.type===t?'#16A34A':'transparent'};
                     color:${bg.type===t?'white':'rgba(255,255,255,0.5)'};">
              ${t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>
      <div style="border-radius:8px;overflow:hidden;min-height:160px;background:#111827;display:flex;align-items:center;justify-content:center;">
        ${bg.type==='video'
          ? `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;">
               <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
               </div>
               <input placeholder="Paste video URL or YouTube link…"
                      style="width:100%;max-width:280px;padding:6px 10px;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;color:white;font-size:12px;outline:none;">
             </div>`
          : bg.type==='image'
          ? `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;color:rgba(255,255,255,0.4);">
               <i data-lucide="image" style="width:32px;height:32px;"></i>
               <input placeholder="Paste image URL…" style="width:100%;max-width:280px;padding:6px 10px;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;color:white;font-size:12px;outline:none;">
             </div>`
          : bg.type==='colour'
          ? `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px;min-height:160px;justify-content:center;">
               <div style="display:flex;gap:8px;">${['#0D1117','#0F2027','#1e3a5f','#1a1a2e','#0D1B2A','#111827'].map(c=>`<div style="width:32px;height:32px;border-radius:6px;background:${c};border:2px solid rgba(255,255,255,0.1);cursor:pointer;"></div>`).join('')}</div>
               <span style="font-size:11px;color:rgba(255,255,255,0.3);">Click a colour</span>
             </div>`
          : `<canvas id="fullbleed-bg-chart" style="width:100%;max-height:180px;"></canvas>`
        }
      </div>
      <p style="font-size:10px;color:rgba(255,255,255,0.25);text-align:center;margin-top:6px;">
        ↕ Background stays fixed · cards scroll over it
      </p>
    </div>

    <!-- Overlay cards -->
    <div style="padding:12px;background:var(--surface);border-top:2px dashed var(--border);">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-3);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <i data-lucide="layout-list" style="width:11px;height:11px;"></i>
        Overlay cards — each card = one scroll step
        <span style="margin-left:auto;font-size:10px;font-weight:500;color:var(--text-4);">${cards.length} card${cards.length!==1?'s':''}</span>
      </div>
      ${cards.map((card, i) => {
        const isSelected = card.id === activeCardId;
        return `
          <div style="display:flex;gap:8px;margin-bottom:8px;cursor:pointer;" onclick="selectCard('${card.id}')">
            <div style="width:26px;height:26px;border-radius:50%;background:${isSelected?'var(--accent)':'var(--surface-3)'};
                        border:2px solid ${isSelected?'var(--accent)':'var(--border)'};
                        display:flex;align-items:center;justify-content:center;
                        font-size:11px;font-weight:700;color:${isSelected?'white':'var(--text-3)'};flex-shrink:0;margin-top:2px;">
              ${i+1}
            </div>
            <div style="flex:1;background:white;border:1.5px solid ${isSelected?'var(--accent)':'var(--border)'};
                        border-radius:10px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
              <div style="font-size:12.5px;font-weight:700;color:var(--text-1);margin-bottom:3px;">${card.heading}</div>
              <div style="font-size:11.5px;color:var(--text-3);line-height:1.5;">${card.body.substring(0,70)}${card.body.length>70?'…':''}</div>
            </div>
          </div>
        `;
      }).join('')}
      <button onclick="addCard()" style="width:100%;padding:8px;border:1.5px dashed var(--border);border-radius:8px;background:none;cursor:pointer;font-size:12px;font-weight:500;color:var(--text-3);display:flex;align-items:center;justify-content:center;gap:6px;margin-top:4px;">
        <i data-lucide="plus" style="width:13px;height:13px;"></i> Add overlay card
      </button>
    </div>
  `;
}

/* ── Text-only ────────────────────────────────────────────── */
function renderTextOnlyCanvas(section) {
  return `
    <div class="canvas-text-only" onclick="clearSelection()">
      ${renderScrollBlocks(section)}
      ${renderScrollColumnBottom(section, '__text_end__')}
    </div>
  `;
}

/* ── Control block (scroll column) ───────────────────────── */
function renderControlBlock(block) {
  const isSelected = block.id === activeBlockId;
  return `
    <div class="canvas-control-block${isSelected?' selected':''}" onclick="event.stopPropagation();selectBlock('${block.id}')">
      <div class="ccb-label">
        <i data-lucide="${block.controlType==='slider'?'sliders-horizontal':'chevrons-up-down'}"></i>
        ${block.controlType==='slider'?'Slider':'Dropdown'} · ${block.content}
        <span style="margin-left:auto;font-size:9px;color:var(--text-4);font-weight:500;">scroll column</span>
      </div>
      ${block.controlType==='slider'
        ? `<input type="range" class="ccb-slider" min="${block.min||0}" max="${block.max||10}" value="${block.value||5}" style="width:100%;">`
        : `<select style="width:100%;padding:4px 8px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-size:12px;">${(block.options||[]).map(o=>`<option>${o}</option>`).join('')}</select>`
      }
    </div>
  `;
}

function blockClass(block) {
  return { heading:'canvas-block-text heading', body:'canvas-block-text', callout:'canvas-block-text callout', stat:'canvas-block-text callout', eyebrow:'canvas-block-text', subtext:'canvas-block-text' }[block.type] || 'canvas-block-text';
}

/* ══════════════════════════════════════════════════════════════
   BUILDER CHART
══════════════════════════════════════════════════════════════ */
function renderBuilderChart(section) {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  // Try sticky chart first
  const stickyChart = (section.stickyBlocks||[]).find(sb=>sb.type==='chart');
  const bgChart = section.background?.type === 'chart' ? section.background : null;
  const canvasId = stickyChart ? 'builder-chart' : (bgChart ? 'fullbleed-bg-chart' : null);
  if (!canvasId) return;

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const step = activeStep();
  const chartType = stickyChart?.chartType || bgChart?.chartType || 'bar';
  const isDark = canvasId === 'fullbleed-bg-chart';

  if (chartType === 'bar') {
    const labels = bgChart ? ['Direct','Partner','Self-serve','Events'] : ['NAM','EMEA','APAC','LATAM'];
    const data   = bgChart ? [7.3, 4.6, 1.8, 1.4] : [4.2, 3.1, 5.8, 1.9];
    const hi     = step?.highlight || labels;
    const green  = '#16A34A';
    const grey   = isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1';
    const colors = labels.map(l => hi.includes(l) ? green : grey);
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 6, borderSkipped: false }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' } },
          y: { grid: { color: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }, ticks: { font: { size: 10 }, color: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8', callback: v => `$${v}M` }, beginAtZero: true }
        }
      }
    });
  } else if (chartType === 'line') {
    const labels = ['Oct 1','Oct 8','Oct 15','Oct 22','Nov 1','Nov 8','Nov 15','Nov 22','Dec 1','Dec 8','Dec 15','Dec 22'];
    const data   = [28,34,31,42,38,36,39,37,41,44,46,52];
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ data, borderColor:'#3B82F6', backgroundColor:'rgba(59,130,246,0.08)', fill:true, tension:0.4, pointRadius:3, pointBorderColor:'#3B82F6', pointBorderWidth:2 }] },
      options: { responsive:true, maintainAspectRatio:false, animation:{duration:400}, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false},ticks:{font:{size:9},color:'#94A3B8',maxTicksLimit:6}}, y:{grid:{color:'#F1F5F9'},ticks:{font:{size:9},color:'#94A3B8'},beginAtZero:false} } }
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   STEP TIMELINE
══════════════════════════════════════════════════════════════ */
function renderStepTimeline() {
  const section = getActiveSection();
  const track   = document.getElementById('step-track');
  if (!section || !track) return;
  const steps = section.layout === 'fullbleed' ? (section.cards||[]) : (section.steps||[]);
  const isCards = section.layout === 'fullbleed';

  if (!steps.length) {
    track.innerHTML = `<span style="font-size:12px;color:var(--text-3);padding:4px 0;">No steps — click + to add.</span>`;
    return;
  }
  track.innerHTML = steps.map((s, i) => {
    const id = s.id;
    const label = isCards ? s.heading : s.label;
    const isActive = id === activeStepId || id === activeCardId;
    return `
      <div class="step-node${isActive?' active':''}"
           onclick="${isCards ? `selectCard('${id}')` : `selectStep('${id}')`}">
        <div class="step-dot">${i+1}</div>
        <div class="step-label-text">${(label||'').substring(0,18)}</div>
      </div>
    `;
  }).join('') + `
    <div class="step-node add-step" style="margin-left:12px;">
      <button class="add-step-btn" onclick="${isCards ? 'addCard()' : 'addStep()'}">
        <i data-lucide="plus"></i>
      </button>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   INSPECTOR
══════════════════════════════════════════════════════════════ */
function renderInspector() {
  const section = getActiveSection();
  const hd   = document.getElementById('inspector-hd');
  const tabs = document.getElementById('inspector-tabs');
  const body = document.getElementById('inspector-body');

  if (inspectorContext === 'story') {
    hd.innerHTML   = '<i data-lucide="book-open"></i> Story Settings';
    tabs.style.display = 'none';
    body.innerHTML = renderStoryInspector();
    return;
  }

  if (!section) return;

  if (activeStickyId) {
    const sb = getStickyBlock();
    hd.innerHTML   = `<i data-lucide="${sb?.type==='chart'?'bar-chart-2':sb?.type==='control'?'sliders-horizontal':'layers'}"></i> Sticky Column — ${sb?.type||'element'}`;
    tabs.style.display = '';
    body.innerHTML = renderStickyBlockInspector(sb);
  } else if (activeCardId && section.layout === 'fullbleed') {
    hd.innerHTML   = '<i data-lucide="layout-list"></i> Overlay Card';
    tabs.style.display = '';
    body.innerHTML = renderCardInspector(section);
  } else if (activeBlockId) {
    const block = getActiveBlock();
    hd.innerHTML   = `<i data-lucide="square"></i> Block — ${block?.type||''}`;
    tabs.style.display = '';
    body.innerHTML = renderBlockInspector(block);
  } else if (activeStepId && section.steps?.length) {
    hd.innerHTML   = '<i data-lucide="milestone"></i> Step';
    tabs.style.display = 'none';
    body.innerHTML = renderStepInspector(activeStep(), section);
  } else {
    hd.innerHTML   = '<i data-lucide="settings-2"></i> Section Settings';
    tabs.style.display = '';
    body.innerHTML = inspectorTab === 'content'
      ? renderSectionContentInspector(section)
      : renderSectionStyleInspector(section);
  }
  setActiveInspectorTabs();
}

/* ── Story inspector ──────────────────────────────────────── */
function renderStoryInspector() {
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Story Identity</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Title</label>
          <input class="form-control" value="${STORY.title}" oninput="updateStoryTitle(this.value)"></div>
        <div><label class="form-label">Subtitle</label>
          <textarea class="annotation-input" rows="2" oninput="updateStorySubtitle(this.value)">${STORY.subtitle||''}</textarea></div>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Colour Theme</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        ${[['green','#16A34A','Reportr Green'],['blue','#3B82F6','Ocean Blue'],['purple','#8B5CF6','Violet'],['amber','#F59E0B','Amber']].map(([id,hex,label])=>`
          <div onclick="STORY.theme='${id}';renderInspector();"
               style="border:1.5px solid ${STORY.theme===id?hex:'var(--border)'};border-radius:8px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:6px;background:${STORY.theme===id?hex+'18':'white'}">
            <div style="width:14px;height:14px;border-radius:50%;background:${hex};flex-shrink:0;"></div>
            <span style="font-size:11.5px;font-weight:${STORY.theme===id?'700':'500'};color:${STORY.theme===id?'var(--text-1)':'var(--text-3)'};">${label}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Typography</div>
      <div><label class="form-label">Font</label>
        <select class="form-control">
          <option selected>Inter (default)</option>
          <option>Georgia (Serif)</option>
          <option>Roboto Mono</option>
        </select>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Published URL</div>
      <div style="display:flex;align-items:center;gap:6px;">
        <input class="form-control" value="reportr.app/s/q4-2025" style="flex:1;font-size:11px;">
        <button class="btn btn-ghost btn-sm"><i data-lucide="copy"></i></button>
      </div>
    </div>
    <div class="inspector-section">
      <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;" onclick="inspectorContext='section';renderInspector();lucide.createIcons();">
        <i data-lucide="arrow-left"></i> Back to section
      </button>
    </div>
  `;
}

/* ── Sticky block inspector ───────────────────────────────── */
function renderStickyBlockInspector(sb) {
  if (!sb) return '<div style="padding:16px;color:var(--text-3);font-size:13px;">Nothing selected.</div>';

  const contentTab = `
    ${sb.type === 'chart' ? `
    <div class="inspector-section">
      <div class="inspector-section-title">Chart configuration</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Chart type</label>
          <select class="form-control" onchange="updateStickyField('chartType',this.value)">
            <option value="bar"      ${sb.chartType==='bar'?'selected':''}>Bar</option>
            <option value="line"     ${sb.chartType==='line'?'selected':''}>Line</option>
            <option value="doughnut" ${sb.chartType==='doughnut'?'selected':''}>Doughnut</option>
            <option value="scatter"  ${sb.chartType==='scatter'?'selected':''}>Scatter</option>
          </select>
        </div>
        <div><label class="form-label">Title</label>
          <input class="form-control" value="${sb.chartTitle||''}" oninput="updateStickyField('chartTitle',this.value)">
        </div>
        <div><label class="form-label">Dataset</label>
          <select class="form-control">
            <option ${sb.dataset==='Order Revenue'?'selected':''}>Order Revenue</option>
            <option ${sb.dataset==='Regional Sales'?'selected':''}>Regional Sales</option>
            <option ${sb.dataset==='Customer Metrics'?'selected':''}>Customer Metrics</option>
            <option ${sb.dataset==='Channel Mix'?'selected':''}>Channel Mix</option>
          </select>
        </div>
        <div><label class="form-label">Height</label>
          <select class="form-control" onchange="updateStickyField('height',this.value)">
            <option value="small"  ${sb.height==='small'?'selected':''}>Small — 160px</option>
            <option value="medium" ${sb.height==='medium'?'selected':''}>Medium — 240px</option>
            <option value="large"  ${sb.height==='large'?'selected':''}>Large — fill column</option>
          </select>
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;">
          <input type="checkbox" checked style="accent-color:var(--accent);"> Show legend
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;">
          <input type="checkbox" checked style="accent-color:var(--accent);"> Animate between steps
        </label>
      </div>
    </div>
    ` : ''}

    ${sb.type === 'control' ? `
    <div class="inspector-section">
      <div class="inspector-section-title">Control</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Label</label>
          <input class="form-control" value="${sb.content||''}" oninput="updateStickyField('content',this.value)">
        </div>
        <div><label class="form-label">Type</label>
          <select class="form-control" onchange="updateStickyField('controlType',this.value)">
            <option value="dropdown" ${sb.controlType==='dropdown'?'selected':''}>Dropdown</option>
            <option value="slider"   ${sb.controlType==='slider'?'selected':''}>Slider</option>
            <option value="checkbox" ${sb.controlType==='checkbox'?'selected':''}>Checkbox</option>
          </select>
        </div>
        ${sb.controlType === 'slider' ? `
        <div style="display:flex;gap:8px;">
          <div style="flex:1;"><label class="form-label">Min</label><input class="form-control" value="${sb.min??0}" oninput="updateStickyField('min',+this.value)"></div>
          <div style="flex:1;"><label class="form-label">Max</label><input class="form-control" value="${sb.max??10}" oninput="updateStickyField('max',+this.value)"></div>
        </div>
        ` : `
        <div><label class="form-label">Options (one per line)</label>
          <textarea class="annotation-input" rows="3">${(sb.options||[]).join('\n')}</textarea>
        </div>
        `}
      </div>
    </div>
    ` : ''}

    <div class="inspector-section">
      <button class="btn btn-danger-ghost btn-sm" style="width:100%;justify-content:center;" onclick="deleteStickyBlock('${sb.id}')">
        <i data-lucide="trash-2"></i> Remove from sticky column
      </button>
    </div>
  `;

  return inspectorTab === 'content' ? contentTab : `
    <div class="inspector-section">
      <div class="inspector-section-title">Background</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Fill</label>
          <div style="display:flex;gap:6px;">
            ${['#F8FAFC','#FFFFFF','#F0FDF4','#EFF6FF','#0D1117'].map(c=>`<div style="width:22px;height:22px;border-radius:4px;background:${c};border:1.5px solid rgba(0,0,0,0.1);cursor:pointer;"></div>`).join('')}
          </div>
        </div>
        <div><label class="form-label">Padding</label>
          <select class="form-control"><option>Compact</option><option selected>Standard</option><option>Relaxed</option></select>
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;">
          <input type="checkbox" style="accent-color:var(--accent);"> Show border
        </label>
      </div>
    </div>
  `;
}

/* ── Section content inspector ────────────────────────────── */
function renderSectionContentInspector(section) {
  return `
    <div class="inspector-section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div class="inspector-section-title" style="margin-bottom:0;">Layout</div>
        <button class="btn btn-ghost btn-sm" onclick="inspectorContext='story';renderInspector();lucide.createIcons();" title="Story settings">
          <i data-lucide="book-open"></i> Story
        </button>
      </div>
      <div class="layout-grid">
        ${LAYOUTS.map(l => `
          <div class="layout-opt${section.layout===l.id?' selected':''}" onclick="changeLayout('${l.id}')">
            <div class="layout-opt-thumb">${sectionThumbSvg(l.id)}</div>
            <div class="layout-opt-label">${l.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Scroll Mechanic</div>
      <div class="mechanic-toggle-wrap">
        <button class="mechanic-btn${section.mechanic==='step'?' active':''}" onclick="setMechanic('step')">
          <div>Step-based</div><div style="font-size:10px;color:var(--text-3);margin-top:2px;">Discrete thresholds</div>
        </button>
        <button class="mechanic-btn${section.mechanic==='continuous'?' active':''}" onclick="setMechanic('continuous')">
          <div>Continuous</div><div style="font-size:10px;color:var(--text-3);margin-top:2px;">Scroll pos → data</div>
        </button>
      </div>
    </div>
    ${section.layout==='fullbleed' ? renderFullbleedBgInspector(section) : ''}
    <div class="inspector-section">
      <div class="inspector-section-title">Label</div>
      <input class="form-control" value="${section.label}" oninput="updateSectionLabel(this.value)">
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title" style="margin-bottom:8px;">Quick actions</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${['split-left','split-right'].includes(section.layout) ? `
        <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;" onclick="openElementPicker('sticky','__sticky_end__')">
          <i data-lucide="bar-chart-2"></i> Add to sticky column
        </button>
        ` : ''}
        <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;" onclick="openElementPicker('scroll','__scroll_end__')">
          <i data-lucide="plus"></i> Add to ${['split-left','split-right'].includes(section.layout)?'scroll column':'section'}
        </button>
        <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;" onclick="addStep()">
          <i data-lucide="milestone"></i> Add scroll step
        </button>
      </div>
    </div>
  `;
}

function renderFullbleedBgInspector(section) {
  const bg = section.background||{type:'chart'};
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Background</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
        ${[{id:'chart',icon:'bar-chart-2',label:'Chart'},{id:'video',icon:'video',label:'Video'},{id:'image',icon:'image',label:'Image'},{id:'colour',icon:'paintbrush',label:'Colour'}].map(t=>`
          <div onclick="setBgType('${t.id}')" style="border:1.5px solid ${bg.type===t.id?'var(--accent)':'var(--border)'};background:${bg.type===t.id?'var(--accent-light)':'white'};border-radius:8px;padding:8px;cursor:pointer;text-align:center;">
            <i data-lucide="${t.icon}" style="width:14px;height:14px;color:${bg.type===t.id?'var(--accent)':'var(--text-3)'}"></i>
            <div style="font-size:11px;font-weight:600;color:${bg.type===t.id?'var(--accent-text)':'var(--text-2)'};margin-top:3px;">${t.label}</div>
          </div>
        `).join('')}
      </div>
      ${bg.type==='chart' ? `
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div><label class="form-label">Chart type</label>
            <select class="form-control"><option>Bar</option><option>Line</option><option>Doughnut</option></select>
          </div>
          <div><label class="form-label">Dataset</label>
            <select class="form-control"><option>Order Revenue</option><option>Channel Mix</option><option>Regional Sales</option></select>
          </div>
        </div>
      ` : bg.type==='video' ? `
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div><label class="form-label">Video URL</label><input class="form-control" placeholder="https://… or YouTube"></div>
          <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;"><input type="checkbox" checked style="accent-color:var(--accent);"> Loop</label>
          <div><label class="form-label">Overlay opacity</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="range" min="0" max="100" value="50" style="flex:1;accent-color:var(--accent);">
              <span style="font-size:11px;color:var(--text-3);">50%</span>
            </div>
          </div>
        </div>
      ` : bg.type==='image' ? `
        <div><label class="form-label">Image URL</label><input class="form-control" placeholder="https://…"></div>
      ` : `
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${['#0D1117','#0F2027','#1e3a5f','#1a1a2e','#0D1B2A','#111827'].map(c=>`<div style="width:28px;height:28px;border-radius:6px;background:${c};border:2px solid rgba(0,0,0,0.1);cursor:pointer;"></div>`).join('')}
        </div>
      `}
    </div>
  `;
}

function renderSectionStyleInspector(section) {
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Background colour</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${['#FFFFFF','#F8FAFC','#0D1117','#F0FDF4','#EFF6FF','#FFF7ED'].map(c=>`<div style="width:24px;height:24px;border-radius:4px;background:${c};border:1.5px solid rgba(0,0,0,0.12);cursor:pointer;"></div>`).join('')}
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Height</div>
      <select class="form-control"><option>Auto</option><option>50vh</option><option selected>100vh</option><option>150vh</option></select>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Padding</div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;"><label class="form-label">Horizontal</label><select class="form-control"><option>Narrow</option><option selected>Standard</option><option>Wide</option></select></div>
        <div style="flex:1;"><label class="form-label">Vertical</label><select class="form-control"><option>Compact</option><option selected>Standard</option><option>Spacious</option></select></div>
      </div>
    </div>
  `;
}

/* ── Step inspector ───────────────────────────────────────── */
function renderStepInspector(step, section) {
  if (!step) return '<div style="padding:16px;color:var(--text-3);font-size:13px;">Select a step in the timeline.</div>';
  const allHL = getAllHighlightOptions(section);
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Step ${stepIndex(step.id, section)+1} — ${step.label}</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div><label class="form-label">Label</label>
          <input class="form-control" value="${step.label}" oninput="updateStepLabel(this.value)">
        </div>
        ${allHL.length ? `
        <div><label class="form-label">Highlight</label>
          <div class="step-highlight-chips">
            ${allHL.map(opt=>`<div class="highlight-chip${(step.highlight||[]).includes(opt)?' active':''}" onclick="toggleHighlight('${step.id}','${opt}')">${opt}</div>`).join('')}
          </div>
        </div>
        ` : ''}
        <div><label class="form-label">Chart annotation</label>
          <textarea class="annotation-input" rows="2" oninput="updateStepAnnotation(this.value)">${step.annotation||''}</textarea>
        </div>
      </div>
    </div>
    <div class="inspector-section">
      <div style="display:flex;gap:6px;">
        <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center;" onclick="prevStep()"><i data-lucide="arrow-left"></i></button>
        <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center;" onclick="nextStep()"><i data-lucide="arrow-right"></i></button>
      </div>
      <button class="btn btn-danger-ghost btn-sm" style="margin-top:6px;width:100%;justify-content:center;" onclick="deleteStep('${step.id}')">
        <i data-lucide="trash-2"></i> Delete step
      </button>
    </div>
  `;
}

/* ── Block inspector ──────────────────────────────────────── */
function renderBlockInspector(block) {
  if (!block) return '';
  const contentTab = `
    <div class="inspector-section">
      <div class="inspector-section-title">Block type</div>
      <select class="form-control" onchange="updateBlockType(this.value)">
        ${['heading','body','eyebrow','subtext','stat','image','video','chart','callout-card','divider','control'].map(t=>
          `<option value="${t}" ${block.type===t?'selected':''}>${t}</option>`
        ).join('')}
      </select>
    </div>
    ${block.type!=='divider'?`
    <div class="inspector-section">
      <div class="inspector-section-title">Content</div>
      <textarea class="annotation-input" rows="3" oninput="updateBlockContent(this.value)">${block.content||''}</textarea>
    </div>
    `:''}
    ${block.type==='chart'?`
    <div class="inspector-section">
      <div class="inspector-section-title">Chart</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Type</label><select class="form-control"><option>Bar</option><option>Line</option><option>Doughnut</option></select></div>
        <div><label class="form-label">Dataset</label><select class="form-control"><option>Order Revenue</option><option>Regional Sales</option></select></div>
        <div><label class="form-label">Height</label><select class="form-control"><option>Small</option><option selected>Medium</option><option>Large</option></select></div>
      </div>
    </div>
    `:''}
    ${block.type==='image'?`
    <div class="inspector-section">
      <div class="inspector-section-title">Image</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">URL or upload</label><input class="form-control" placeholder="https://…"></div>
        <div><label class="form-label">Alt text</label><input class="form-control" placeholder="Describe the image…"></div>
        <div><label class="form-label">Size</label><select class="form-control"><option>Auto</option><option>Full width</option><option>Half width</option></select></div>
      </div>
    </div>
    `:''}
    ${block.type==='video'?`
    <div class="inspector-section">
      <div class="inspector-section-title">Video</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">URL</label><input class="form-control" placeholder="https://… or YouTube"></div>
        <div><label class="form-label">Display</label><select class="form-control"><option>Inline</option><option>Full width</option></select></div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;"><input type="checkbox" style="accent-color:var(--accent);"> Autoplay when in view</label>
      </div>
    </div>
    `:''}
    ${block.type==='control'?`
    <div class="inspector-section">
      <div class="inspector-section-title">Control type</div>
      <select class="form-control" onchange="updateControlType(this.value)">
        <option value="dropdown" ${block.controlType==='dropdown'?'selected':''}>Dropdown</option>
        <option value="slider"   ${block.controlType==='slider'?'selected':''}>Slider</option>
        <option value="checkbox" ${block.controlType==='checkbox'?'selected':''}>Checkbox</option>
      </select>
      <div style="margin-top:8px;"><label class="form-label">Placement</label>
        <select class="form-control"><option>Inline (text flow)</option><option>Floating panel</option></select>
      </div>
    </div>
    `:''}
    <div class="inspector-section">
      <button class="btn btn-danger-ghost btn-sm" style="width:100%;justify-content:center;" onclick="deleteBlock('${block.id}')">
        <i data-lucide="trash-2"></i> Delete block
      </button>
    </div>
  `;

  return inspectorTab === 'content' ? contentTab : `
    <div class="inspector-section">
      <div class="inspector-section-title">Typography</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Size</label><select class="form-control"><option>Small</option><option selected>Medium</option><option>Large</option></select></div>
        <div><label class="form-label">Weight</label><select class="form-control"><option>Regular</option><option>Medium</option><option selected>Bold</option></select></div>
        <div><label class="form-label">Alignment</label>
          <div style="display:flex;gap:4px;">
            ${['align-left','align-center','align-right'].map(a=>`<button style="flex:1;padding:5px;border:1.5px solid var(--border);border-radius:var(--r-sm);background:white;cursor:pointer;"><i data-lucide="${a}" style="width:12px;height:12px;"></i></button>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Spacing</div>
      <div><label class="form-label">Margin below</label><select class="form-control"><option>Tight</option><option selected>Normal</option><option>Loose</option></select></div>
    </div>
  `;
}

/* ── Card inspector ───────────────────────────────────────── */
function renderCardInspector(section) {
  const card = section.cards?.find(c => c.id === activeCardId);
  if (!card) return '';
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">Overlay card</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><label class="form-label">Heading</label><input class="form-control" value="${card.heading}" oninput="updateCardField('heading',this.value)"></div>
        <div><label class="form-label">Body text</label><textarea class="annotation-input" rows="3" oninput="updateCardField('body',this.value)">${card.body}</textarea></div>
      </div>
    </div>
    <div class="inspector-section">
      <div class="inspector-section-title">Step highlight</div>
      <input class="form-control" placeholder="e.g. Direct, Partner" value="${section.steps?.[section.cards?.indexOf(card)]?.highlight?.[0]||''}">
    </div>
    <div class="inspector-section">
      <button class="btn btn-danger-ghost btn-sm" style="width:100%;justify-content:center;" onclick="deleteCard('${card.id}')">
        <i data-lucide="trash-2"></i> Delete card
      </button>
    </div>
  `;
}

function setActiveInspectorTabs() {
  document.querySelectorAll('.inspector-tab').forEach(t=>t.classList.remove('active'));
  const at = document.getElementById(`itab-${inspectorTab}`);
  if (at) at.classList.add('active');
}

/* ══════════════════════════════════════════════════════════════
   ELEMENT PICKER
══════════════════════════════════════════════════════════════ */
function openElementPicker(mode, afterId) {
  elementPickerMode  = mode;   // 'scroll' | 'sticky'
  elementPickerAfter = afterId;

  // Filter elements depending on where we're inserting
  const stickyOnly = new Set(['chart','image','video','control-dropdown','control-slider','control-checkbox']);
  const types = mode === 'sticky'
    ? ELEMENT_TYPES.map(g => ({ ...g, items: g.items.filter(i => stickyOnly.has(i.id)) })).filter(g => g.items.length)
    : ELEMENT_TYPES;

  const grid = document.getElementById('element-picker-grid');
  const titleEl = document.getElementById('element-picker-title');
  if (titleEl) titleEl.textContent = mode === 'sticky' ? 'Add to sticky column' : 'Add an element';

  grid.innerHTML = types.map(group => `
    <div style="grid-column:1/-1;">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-4);margin-bottom:8px;padding-left:2px;">${group.group}</div>
    </div>
    ${group.items.map(item => `
      <div class="element-picker-item" onclick="addElementType('${item.id}')">
        <div class="ep-icon"><i data-lucide="${item.icon}"></i></div>
        <div class="ep-label">${item.label}</div>
        <div class="ep-desc">${item.desc}</div>
      </div>
    `).join('')}
  `).join('');

  document.getElementById('element-picker-modal').classList.add('open');
  lucide.createIcons();
}

function closeElementPicker() {
  document.getElementById('element-picker-modal').classList.remove('open');
  elementPickerMode  = null;
  elementPickerAfter = null;
}

function addElementType(typeId) {
  const section = getActiveSection();
  if (!section) return;

  // Build the new block
  let newBlock;
  if (typeId === 'control-dropdown') newBlock = { id:`b-${Date.now()}`, type:'control', content:'Filter', controlType:'dropdown', options:['Option A','Option B','Option C'] };
  else if (typeId === 'control-slider') newBlock = { id:`b-${Date.now()}`, type:'control', content:'Slider', controlType:'slider', min:0, max:10, value:5 };
  else if (typeId === 'control-checkbox') newBlock = { id:`b-${Date.now()}`, type:'control', content:'Toggle', controlType:'checkbox', options:['Series A','Series B'] };
  else if (typeId === 'chart') newBlock = { id:`b-${Date.now()}`, type:'chart', chartType:'bar', chartTitle:'New chart', dataset:'Order Revenue', content:'' };
  else if (typeId === 'image') newBlock = { id:`b-${Date.now()}`, type:'image', content:'Image caption' };
  else if (typeId === 'video') newBlock = { id:`b-${Date.now()}`, type:'video', content:'Video title' };
  else if (typeId === 'callout-card') newBlock = { id:`b-${Date.now()}`, type:'callout-card', content:'💡 Key insight here.' };
  else if (typeId === 'divider') newBlock = { id:`b-${Date.now()}`, type:'divider', content:'' };
  else { const defs={heading:'New heading',body:'New paragraph.',stat:'0%',eyebrow:'Label',subtext:'Supporting text.'}; newBlock={id:`b-${Date.now()}`,type:typeId,content:defs[typeId]||''}; }

  if (elementPickerMode === 'sticky') {
    // Insert into stickyBlocks
    if (!section.stickyBlocks) section.stickyBlocks = [];
    const idx = elementPickerAfter === '__sticky_end__' ? -1
      : section.stickyBlocks.findIndex(b => b.id === elementPickerAfter);
    if (idx === -1) section.stickyBlocks.push(newBlock);
    else section.stickyBlocks.splice(idx+1, 0, newBlock);
    activeStickyId = newBlock.id;
    activeBlockId  = null;
  } else {
    // Insert into scroll blocks
    if (!section.blocks) section.blocks = [];
    const after = elementPickerAfter;
    const idx = (after === '__scroll_end__' || after === '__text_end__' || after === 'cover-end') ? -1
      : section.blocks.findIndex(b => b.id === after);
    if (idx === -1) section.blocks.push(newBlock);
    else section.blocks.splice(idx+1, 0, newBlock);
    activeBlockId = newBlock.id;
    activeStickyId = null;
  }

  closeElementPicker();
  renderAll();
}

/* ══════════════════════════════════════════════════════════════
   SELECTION & CLEAR
══════════════════════════════════════════════════════════════ */
function clearSelection() {
  activeBlockId  = null;
  activeStickyId = null;
  activeCardId   = null;
  inspectorContext = 'section';
  renderInspector();
  renderCanvas();
  lucide.createIcons();
}

function selectSection(id) {
  activeSectionId  = id;
  activeBlockId    = null;
  activeStickyId   = null;
  activeCardId     = null;
  inspectorContext = 'section';
  const s = getActiveSection();
  activeStepId = s?.steps?.[0]?.id || null;
  renderAll();
}

function selectStep(id) {
  activeStepId   = id;
  activeBlockId  = null;
  activeStickyId = null;
  activeCardId   = null;
  inspectorContext = 'step';
  renderCanvas(); renderInspector(); renderStepTimeline(); lucide.createIcons();
}

function selectBlock(id) {
  activeBlockId  = id;
  activeStickyId = null;
  activeCardId   = null;
  inspectorContext = 'block';
  renderInspector(); renderCanvas(); lucide.createIcons();
}

function selectStickyBlock(id) {
  activeStickyId = id;
  activeBlockId  = null;
  activeCardId   = null;
  inspectorContext = 'sticky';
  renderInspector(); renderCanvas(); lucide.createIcons();
}

function selectCard(id) {
  activeCardId   = id;
  activeBlockId  = null;
  activeStickyId = null;
  inspectorContext = 'card';
  const s = getActiveSection();
  const idx = s?.cards?.findIndex(c=>c.id===id)??-1;
  if (idx !== -1 && s?.steps?.[idx]) activeStepId = s.steps[idx].id;
  renderCanvas(); renderInspector(); renderStepTimeline(); lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════
   MUTATIONS
══════════════════════════════════════════════════════════════ */
function toggleMechanic() { const s=getActiveSection(); if(s){s.mechanic=s.mechanic==='step'?'continuous':'step'; renderAll();} }
function setMechanic(m)    { const s=getActiveSection(); if(s){s.mechanic=m; renderAll();} }
function changeLayout(id)  { const s=getActiveSection(); if(s){s.layout=id; renderAll();} }
function setBgType(type)   { const s=getActiveSection(); if(s){if(!s.background)s.background={};s.background.type=type; renderCanvas(); renderInspector(); lucide.createIcons();} }

function updateStoryTitle(val)    { STORY.title=val; renderSectionList(); lucide.createIcons(); }
function updateStorySubtitle(val) { STORY.subtitle=val; }

function updateSectionLabel(val) {
  const s=getActiveSection(); if(!s) return;
  s.label=val;
  document.getElementById('canvas-section-label').textContent=`Section ${sectionIndex()+1} — ${val}`;
  renderSectionList(); lucide.createIcons();
}

// Sticky block mutations
function updateStickyField(field, val) {
  const sb=getStickyBlock(); if(sb){sb[field]=val; renderCanvas(); lucide.createIcons();}
}
function deleteStickyBlock(id) {
  const s=getActiveSection(); if(!s) return;
  s.stickyBlocks=s.stickyBlocks.filter(b=>b.id!==id);
  activeStickyId=null; renderAll();
}

// Scroll block mutations
function updateBlockType(val)    { const b=getActiveBlock(); if(b){b.type=val; renderCanvas(); lucide.createIcons();} }
function updateBlockContent(val) { const b=getActiveBlock(); if(b){b.content=val; renderCanvas(); lucide.createIcons();} }
function updateControlType(val)  { const b=getActiveBlock(); if(b){b.controlType=val; renderCanvas(); renderInspector(); lucide.createIcons();} }
function deleteBlock(id)         { const s=getActiveSection(); if(!s) return; s.blocks=s.blocks.filter(b=>b.id!==id); activeBlockId=null; renderAll(); }

// Steps
function addStep() { const s=getActiveSection(); if(!s) return; const st={id:`st-${Date.now()}`,label:`Step ${(s.steps||[]).length+1}`,highlight:[],annotation:''}; if(!s.steps)s.steps=[]; s.steps.push(st); activeStepId=st.id; renderAll(); }
function deleteStep(id) { const s=getActiveSection(); if(!s) return; s.steps=s.steps.filter(x=>x.id!==id); activeStepId=s.steps[0]?.id||null; renderAll(); }
function prevStep() { const s=getActiveSection(); if(!s) return; const i=s.steps.findIndex(x=>x.id===activeStepId); if(i>0) selectStep(s.steps[i-1].id); }
function nextStep() { const s=getActiveSection(); if(!s) return; const i=s.steps.findIndex(x=>x.id===activeStepId); if(i<s.steps.length-1) selectStep(s.steps[i+1].id); }
function updateStepLabel(val)      { const st=activeStep(); if(st){st.label=val; renderStepTimeline(); renderCanvas(); lucide.createIcons();} }
function updateStepAnnotation(val) { const st=activeStep(); if(st) st.annotation=val; }
function toggleHighlight(stepId,opt) { const s=getActiveSection(); const st=s?.steps.find(x=>x.id===stepId); if(!st) return; st.highlight=st.highlight?.includes(opt)?st.highlight.filter(h=>h!==opt):[...(st.highlight||[]),opt]; renderCanvas(); renderInspector(); lucide.createIcons(); }

// Cards
function addCard()       { const s=getActiveSection(); if(!s||!s.cards) return; const n=s.cards.length+1; s.cards.push({id:`c-${Date.now()}`,heading:`Card ${n}`,body:'Narrative text.'}); if(!s.steps)s.steps=[]; s.steps.push({id:`sc-${Date.now()}`,label:`Step ${n}`,highlight:[],annotation:''}); renderAll(); }
function deleteCard(id)  { const s=getActiveSection(); if(!s) return; const i=s.cards.findIndex(c=>c.id===id); s.cards.splice(i,1); if(s.steps?.[i])s.steps.splice(i,1); activeCardId=null; renderAll(); }
function updateCardField(f,v) { const s=getActiveSection(); const c=s?.cards?.find(x=>x.id===activeCardId); if(c){c[f]=v; renderCanvas(); lucide.createIcons();} }

// Inspector tab
function setInspectorTab(tab) { inspectorTab=tab; renderInspector(); lucide.createIcons(); }

/* ── Preview / modal ─────────────────────────────────────── */
function openPreview() { document.getElementById('preview-overlay').classList.add('open'); document.getElementById('preview-iframe-wrap').style.height='100%'; lucide.createIcons(); }
function closePreview() { document.getElementById('preview-overlay').classList.remove('open'); }
function setPreviewDevice(d,btn) { document.querySelectorAll('.preview-device-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const w=document.getElementById('preview-iframe-wrap'); w.className=d==='mobile'?'preview-iframe-wrap mobile':'preview-iframe-wrap'; w.style.height=d==='mobile'?'calc(100% - 40px)':'100%'; }

function openAddSectionModal() {
  const grid=document.getElementById('modal-layout-grid');
  grid.innerHTML=LAYOUTS.map(l=>`
    <div class="modal-layout-opt" onclick="addSection('${l.id}')">
      <div class="modal-layout-thumb">${sectionThumbSvg(l.id)}</div>
      <div class="modal-layout-label">${l.label}</div>
      <div class="modal-layout-sub">${l.sub}</div>
      <div class="modal-layout-arrow">Add this layout →</div>
    </div>
  `).join('');
  document.getElementById('add-modal').classList.add('open');
  lucide.createIcons();
}
function closeAddSectionModal() { document.getElementById('add-modal').classList.remove('open'); }

function moveSectionUp(id) {
  const idx = STORY.sections.findIndex(s => s.id === id);
  if (idx <= 0) return;
  [STORY.sections[idx-1], STORY.sections[idx]] = [STORY.sections[idx], STORY.sections[idx-1]];
  renderAll();
}
function moveSectionDown(id) {
  const idx = STORY.sections.findIndex(s => s.id === id);
  if (idx < 0 || idx >= STORY.sections.length - 1) return;
  [STORY.sections[idx], STORY.sections[idx+1]] = [STORY.sections[idx+1], STORY.sections[idx]];
  renderAll();
}
function deleteSection(id) {
  if (STORY.sections.length <= 1) return;
  const idx  = STORY.sections.findIndex(s => s.id === id);
  STORY.sections.splice(idx, 1);
  // pick a sensible new active section
  const next = STORY.sections[Math.min(idx, STORY.sections.length - 1)];
  activeSectionId = next.id;
  activeStepId    = next.steps?.[0]?.id || null;
  activeBlockId   = null; activeStickyId = null; activeCardId = null;
  renderAll();
}

function addSection(layoutId) {
  const isSplit = ['split-left','split-right'].includes(layoutId);
  const newSection = {
    id:`s-${Date.now()}`, layout:layoutId,
    label:`New ${layoutLabel(layoutId)} Section`, mechanic:'step',
    stickyBlocks: isSplit ? [{ id:`sb-${Date.now()}`, type:'chart', chartType:'bar', chartTitle:'Chart', dataset:'Order Revenue', height:'medium' }] : undefined,
    blocks: [{ id:`b-${Date.now()}-1`, type:'heading', content:'Section heading' }, { id:`b-${Date.now()}-2`, type:'body', content:'Add your narrative here.' }],
    steps: isSplit ? [{id:`st-${Date.now()}`,label:'Step 1',highlight:[],annotation:''}] : [],
    background: layoutId==='fullbleed' ? {type:'chart',chartType:'bar',dataset:'Order Revenue'} : undefined,
    cards: layoutId==='fullbleed' ? [{id:`c-${Date.now()}`,heading:'First card',body:'Narrative that scrolls over the background.'}] : undefined,
  };
  STORY.sections.push(newSection);
  activeSectionId=newSection.id; activeStepId=newSection.steps?.[0]?.id||null; activeBlockId=null;
  closeAddSectionModal(); renderAll();
}

/* ── Keyboard ─────────────────────────────────────────────── */
function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key==='ArrowLeft')  prevStep();
    if (e.key==='ArrowRight') nextStep();
    if (e.key==='Escape')     { clearSelection(); closePreview(); closeAddSectionModal(); closeElementPicker(); }
  });
}

/* ── Helpers ─────────────────────────────────────────────── */
function getActiveSection() { return STORY.sections.find(s=>s.id===activeSectionId); }
function activeStep()       { return getActiveSection()?.steps?.find(s=>s.id===activeStepId); }
function getActiveBlock()   { return getActiveSection()?.blocks?.find(b=>b.id===activeBlockId); }
function getStickyBlock()   { return getActiveSection()?.stickyBlocks?.find(b=>b.id===activeStickyId); }
function sectionIndex()     { return STORY.sections.findIndex(s=>s.id===activeSectionId); }
function blockByType(s,t)   { return s.blocks?.find(b=>b.type===t); }
function stepIndex(id,s)    { return s.steps?.findIndex(x=>x.id===id)??-1; }
function layoutLabel(id)    { return {cover:'Cover','split-left':'Split L','split-right':'Split R',callout:'Callout',fullbleed:'Full bleed','text-only':'Text only'}[id]||id; }
function layoutIcon(id)     { return {cover:'layout-template','split-left':'panel-left','split-right':'panel-right',callout:'maximize-2',fullbleed:'expand','text-only':'align-left'}[id]||'layout'; }
function getAllHighlightOptions(section) {
  const stickyChart = section.stickyBlocks?.find(sb=>sb.type==='chart');
  if (stickyChart?.chartType==='bar' || section.background?.chartType==='bar') {
    return section.id==='s6' ? ['Direct','Partner','Self-serve','Events'] : ['NAM','EMEA','APAC','LATAM'];
  }
  if (stickyChart?.chartType==='line') return ['Oct','Nov','Dec'];
  return [];
}

function sectionThumbSvg(layout) {
  const svgs={
    cover:`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="#0D1117"/><rect x="20" y="10" width="40" height="4" rx="2" fill="#16A34A" opacity="0.8"/><rect x="14" y="18" width="52" height="3" rx="1.5" fill="white" opacity="0.6"/><rect x="22" y="24" width="36" height="2" rx="1" fill="white" opacity="0.3"/></svg>`,
    'split-left':`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="#F8FAFC"/><rect width="36" height="36" fill="#EFF1F5"/><rect x="4" y="12" width="28" height="12" rx="2" fill="#16A34A" opacity="0.3"/><rect x="42" y="8" width="30" height="2.5" rx="1.25" fill="#94A3B8"/><rect x="42" y="14" width="24" height="2" rx="1" fill="#CBD5E1"/><rect x="42" y="19" width="26" height="2" rx="1" fill="#CBD5E1"/></svg>`,
    'split-right':`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="#F8FAFC"/><rect x="44" width="36" height="36" fill="#EFF1F5"/><rect x="8" y="8" width="30" height="2.5" rx="1.25" fill="#94A3B8"/><rect x="8" y="14" width="24" height="2" rx="1" fill="#CBD5E1"/><rect x="8" y="19" width="26" height="2" rx="1" fill="#CBD5E1"/><rect x="48" y="12" width="28" height="12" rx="2" fill="#3B82F6" opacity="0.3"/></svg>`,
    callout:`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="white"/><rect x="26" y="6" width="28" height="10" rx="2" fill="#16A34A" opacity="0.2"/><rect x="30" y="20" width="20" height="3" rx="1.5" fill="#94A3B8"/></svg>`,
    fullbleed:`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="#0D1117"/><rect x="4" y="18" width="72" height="10" rx="2" fill="#3B82F6" opacity="0.25"/><rect x="14" y="5" width="36" height="10" rx="4" fill="rgba(255,255,255,0.9)"/><rect x="18" y="8" width="20" height="2" rx="1" fill="#334155"/><rect x="18" y="12" width="14" height="1.5" rx="0.75" fill="#94A3B8"/></svg>`,
    'text-only':`<svg viewBox="0 0 80 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><rect width="80" height="36" fill="white"/><rect x="16" y="6" width="48" height="3" rx="1.5" fill="#94A3B8"/><rect x="8" y="13" width="64" height="2" rx="1" fill="#CBD5E1"/><rect x="8" y="18" width="60" height="2" rx="1" fill="#CBD5E1"/><rect x="8" y="28" width="40" height="2" rx="1" fill="#CBD5E1"/></svg>`,
  };
  return svgs[layout]||svgs['text-only'];
}
