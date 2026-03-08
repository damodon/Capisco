/* ============================================================
   REPORTR — Published
   published.js
   ============================================================ */

/* ── COLOUR PALETTE ────────────────────────────────────────── */
const PALETTE = ['#16A34A','#06B6D4','#3B82F6','#F59E0B','#8B5CF6','#EC4899'];

/* ── SAMPLE DATA ───────────────────────────────────────────── */
const PUBLISHED_ITEMS = [
  {
    id: 'p01', type: 'dashboard', access: 'public',
    title: 'Sales Performance — Q4 2025',
    description: 'Revenue, orders, and regional breakdown for Q4.',
    publishedDate: 'Dec 12, 2025', updatedDate: '2 hours ago',
    views: 2841, embeds: 3, isArchived: false,
    chartType: 'bar', slug: 'sales-performance-q4',
    datasets: ['Order Revenue', 'Regional Sales'],
  },
  {
    id: 'p02', type: 'dashboard', access: 'embed',
    title: 'Marketing Attribution Dashboard',
    description: 'Channel-level attribution, CPL, and funnel conversion rates.',
    publishedDate: 'Jan 5, 2026', updatedDate: 'Yesterday',
    views: 1203, embeds: 2, isArchived: false,
    chartType: 'doughnut', slug: 'marketing-attribution',
    datasets: ['Campaign Spend', 'Leads'],
  },
  {
    id: 'p03', type: 'report', access: 'password',
    title: 'Executive Summary — January 2026',
    description: 'Monthly KPIs for leadership review.',
    publishedDate: 'Feb 1, 2026', updatedDate: '3 days ago',
    views: 419, embeds: 0, isArchived: false,
    chartType: 'line', slug: 'exec-summary-jan26',
    datasets: ['Order Revenue', 'Customer Metrics'],
  },
  {
    id: 'p04', type: 'dashboard', access: 'public',
    title: 'Customer Lifetime Value',
    description: 'Cohort analysis, LTV by segment, churn indicators.',
    publishedDate: 'Nov 20, 2025', updatedDate: '1 week ago',
    views: 987, embeds: 1, isArchived: false,
    chartType: 'line', slug: 'customer-ltv',
    datasets: ['Customer Metrics'],
  },
  {
    id: 'p05', type: 'report', access: 'embed',
    title: 'Inventory Health Report',
    description: 'Stock levels, reorder points, supplier lead times.',
    publishedDate: 'Jan 28, 2026', updatedDate: '4 days ago',
    views: 674, embeds: 1, isArchived: false,
    chartType: 'bar', slug: 'inventory-health',
    datasets: ['Inventory'],
  },
  {
    id: 'p06', type: 'dashboard', access: 'private',
    title: 'Engineering Ops — Internal',
    description: 'Deploy frequency, incident counts, DORA metrics.',
    publishedDate: 'Feb 3, 2026', updatedDate: 'Today',
    views: 88, embeds: 0, isArchived: false,
    chartType: 'bar', slug: 'eng-ops-internal',
    datasets: ['Engineering Events'],
  },
  {
    id: 'p07', type: 'dashboard', access: 'public',
    title: 'Product Usage Analytics',
    description: 'DAU, feature adoption, session length by plan tier.',
    publishedDate: 'Jan 15, 2026', updatedDate: '5 days ago',
    views: 1560, embeds: 2, isArchived: false,
    chartType: 'doughnut', slug: 'product-usage',
    datasets: ['Events', 'Users'],
  },
  {
    id: 'p08', type: 'report', access: 'public',
    title: 'Regional Revenue Breakdown',
    description: 'EMEA, NAM, APAC revenue split with YoY comparison.',
    publishedDate: 'Dec 30, 2025', updatedDate: '2 weeks ago',
    views: 430, embeds: 0, isArchived: false,
    chartType: 'bar', slug: 'regional-revenue',
    datasets: ['Order Revenue'],
  },
  {
    id: 'p09', type: 'dashboard', access: 'embed',
    title: 'Support Ticket Analytics',
    description: 'Volume, resolution time, CSAT by category.',
    publishedDate: 'Nov 10, 2025', updatedDate: '3 weeks ago',
    views: 312, embeds: 1, isArchived: true,
    chartType: 'line', slug: 'support-tickets',
    datasets: ['Support Data'],
  },
  {
    id: 'p10', type: 'report', access: 'password',
    title: 'Investor KPI Dashboard — Q3 2025',
    description: 'Board-level metrics for Q3 investor update.',
    publishedDate: 'Oct 15, 2025', updatedDate: '4 months ago',
    views: 201, embeds: 0, isArchived: true,
    chartType: 'bar', slug: 'investor-q3-25',
    datasets: ['Financial Summary'],
  },
  {
    id: 'p11', type: 'scrollyteller', access: 'public',
    title: 'Q4 2025 — Revenue in Focus',
    description: 'A scroll-driven data story covering regional performance, channel breakdown, and monthly revenue trends.',
    publishedDate: 'Mar 1, 2026', updatedDate: 'Today',
    views: 1247, embeds: 1, isArchived: false,
    chartType: 'scrollyteller', slug: 'q4-2025-revenue-in-focus',
    href: 'scrollyteller-example.html',
    datasets: ['Order Revenue', 'Regional Sales'],
    sections: 5,
  },
];

/* ── STATE ─────────────────────────────────────────────────── */
let currentFilter = 'all';
let chartInstances = {};

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('published');
  lucide.createIcons();
  renderPubGrid();
  bindFilters();
});

/* ── RENDER GRID ───────────────────────────────────────────── */
function renderPubGrid() {
  const grid   = document.getElementById('pub-grid');
  const search = (document.getElementById('search-input').value || '').toLowerCase();

  // Destroy existing charts to avoid canvas conflicts
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  const filtered = PUBLISHED_ITEMS.filter(item => {
    const matchFilter =
      currentFilter === 'all'          ? !item.isArchived :
      currentFilter === 'dashboard'    ? !item.isArchived && item.type === 'dashboard' :
      currentFilter === 'report'       ? !item.isArchived && item.type === 'report' :
      currentFilter === 'scrollyteller'? !item.isArchived && item.type === 'scrollyteller' :
      currentFilter === 'archived'     ? item.isArchived : true;
    const matchSearch = !search ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  document.getElementById('pub-count').textContent = `${PUBLISHED_ITEMS.length} items`;

  grid.innerHTML = filtered.map(item => pubCardHtml(item)).join('');

  // Render mini charts after DOM is ready
  requestAnimationFrame(() => {
    filtered.forEach(item => renderMiniChart(item));
    lucide.createIcons();
  });
}

function pubCardHtml(item) {
  const typeBadge =
    item.type === 'dashboard'
      ? `<span class="badge badge-neutral" style="font-size:11px;"><i data-lucide="layout-dashboard" style="width:10px;height:10px;margin-right:3px;"></i>Dashboard</span>`
    : item.type === 'scrollyteller'
      ? `<span class="badge" style="font-size:11px;background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;"><i data-lucide="scroll-text" style="width:10px;height:10px;margin-right:3px;"></i>Scrollyteller</span>`
    : `<span class="badge badge-neutral" style="font-size:11px;"><i data-lucide="file-text" style="width:10px;height:10px;margin-right:3px;"></i>Report</span>`;

  const accessBadge = {
    public:   `<span class="access-badge access-public"><i data-lucide="globe"></i> Public</span>`,
    embed:    `<span class="access-badge access-embed"><i data-lucide="code-2"></i> Embed only</span>`,
    password: `<span class="access-badge access-password"><i data-lucide="lock"></i> Password</span>`,
    private:  `<span class="access-badge access-private"><i data-lucide="eye-off"></i> Private</span>`,
  }[item.access] || '';

  const embedChip = item.embeds > 0
    ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:11px;color:var(--blue-ui-text);background:var(--blue-ui-light);border-radius:var(--r-full);padding:2px 7px;font-weight:500;">
        <i data-lucide="code-2" style="width:10px;height:10px;"></i> ${item.embeds} embed${item.embeds !== 1 ? 's' : ''}
       </span>`
    : '';

  const thumbBg = {
    bar:           'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    line:          'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    doughnut:      'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)',
    scrollyteller: '#0D1117',
  }[item.chartType] || 'linear-gradient(135deg, #F8FAFC, #F1F5F9)';

  const viewHref = item.href || '#';

  // Pre-build dots using concatenation to avoid triple-nested template literals
  const scrollyDots = [0,1,2,3,4].map(i =>
    '<div style="width:6px;height:6px;border-radius:50%;background:' +
    (i === 0 ? '#16A34A' : 'rgba(255,255,255,0.25)') + ';"></div>'
  ).join('');

  const scrollyThumb = item.type === 'scrollyteller' ? `
    <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;">
      <svg viewBox="0 0 280 130" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.18;">
        <rect x="20"  y="60"  width="28" height="50" rx="3" fill="#16A34A"/>
        <rect x="60"  y="40"  width="28" height="70" rx="3" fill="#16A34A"/>
        <rect x="100" y="20"  width="28" height="90" rx="3" fill="#16A34A"/>
        <rect x="140" y="50"  width="28" height="60" rx="3" fill="#16A34A"/>
        <rect x="180" y="35"  width="28" height="75" rx="3" fill="#16A34A"/>
        <rect x="220" y="55"  width="28" height="55" rx="3" fill="#16A34A"/>
      </svg>
      <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;text-align:center;position:relative;z-index:1;">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.9);letter-spacing:0.5px;">Q4 2025 · Revenue in Focus</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px;">5 sections · scroll story</div>
      </div>
      <div style="display:flex;gap:4px;position:relative;z-index:1;">${scrollyDots}</div>
    </div>
  ` : `<canvas id="chart-${item.id}" width="280" height="130"></canvas>`;

  return `
    <div class="pub-card" id="pubcard-${item.id}">
      <div class="pub-thumb" style="background:${thumbBg};">
        ${scrollyThumb}
        <div class="pub-thumb-overlay">
          <button class="pub-thumb-action" onclick="event.stopPropagation();openEmbedPanel('${item.id}')">
            <i data-lucide="code-2"></i> Embed
          </button>
          <a class="pub-thumb-action" href="${viewHref}" target="_blank" onclick="event.stopPropagation();" style="text-decoration:none;">
            <i data-lucide="external-link"></i> View
          </a>
        </div>
      </div>
      <div class="pub-card-body">
        <div class="pub-card-header">
          <div class="pub-title">${item.title}</div>
        </div>
        <div class="pub-meta" style="margin-bottom:10px;">
          ${typeBadge}
          ${accessBadge}
          ${embedChip}
        </div>
        <div class="pub-meta">
          <i data-lucide="calendar"></i>
          Published ${item.publishedDate}
          <span class="pub-meta-sep">·</span>
          <i data-lucide="clock"></i>
          Updated ${item.updatedDate}
        </div>
      </div>
      <div class="pub-card-footer">
        <button class="pub-action-btn" onclick="openEmbedPanel('${item.id}')">
          <i data-lucide="code-2"></i> Embed
        </button>
        <a class="pub-action-btn" href="${item.type === 'scrollyteller' ? 'scrollyteller-builder.html' : '#'}" style="text-decoration:none;">
          <i data-lucide="pencil"></i> Edit
        </a>
        <button class="pub-action-btn danger">
          <i data-lucide="archive"></i> Archive
        </button>
        <div class="views-chip">
          <i data-lucide="eye"></i>
          ${item.views.toLocaleString()}
        </div>
      </div>
    </div>
  `;
}

/* ── MINI CHARTS ───────────────────────────────────────────── */
function renderMiniChart(item) {
  const canvas = document.getElementById(`chart-${item.id}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const baseOpts = {
    responsive: false,
    animation: { duration: 400 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    elements: { point: { radius: 0 } },
  };

  if (item.chartType === 'bar') {
    const labels = ['Jan','Feb','Mar','Apr','May','Jun'];
    const seed = item.id.charCodeAt(1);
    const data = labels.map((_, i) => 30 + ((seed * (i + 3)) % 70));
    chartInstances[item.id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: PALETTE[0] + 'CC', borderRadius: 4 }]
      },
      options: {
        ...baseOpts,
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  } else if (item.chartType === 'line') {
    const labels = ['','','','','','','',''];
    const seed = item.id.charCodeAt(1);
    const data = labels.map((_, i) => 20 + ((seed * (i + 2)) % 60));
    chartInstances[item.id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: PALETTE[2],
          backgroundColor: PALETTE[2] + '22',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        ...baseOpts,
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  } else if (item.chartType === 'doughnut') {
    chartInstances[item.id] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['A','B','C','D'],
        datasets: [{
          data: [38, 27, 21, 14],
          backgroundColor: PALETTE.slice(0, 4),
          borderWidth: 2, borderColor: 'white',
        }]
      },
      options: {
        ...baseOpts,
        cutout: '60%',
        layout: { padding: 16 }
      }
    });
  }
}

/* ── EMBED PANEL ───────────────────────────────────────────── */
function openEmbedPanel(id) {
  const item = PUBLISHED_ITEMS.find(p => p.id === id);
  if (!item) return;

  document.getElementById('embed-panel-title').textContent   = item.title;
  document.getElementById('embed-panel-subtitle').textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} · Published ${item.publishedDate}`;
  document.getElementById('embed-url').value = `https://reportr.app/p/${item.slug}`;
  document.getElementById('embed-snippet').textContent =
`<iframe
  src="https://reportr.app/embed/${item.slug}"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen>
</iframe>`;

  // Show password toggle state
  const isPw = item.access === 'password';
  document.getElementById('toggle-password').checked = isPw;
  document.getElementById('password-field-wrap').style.display = isPw ? '' : 'none';

  document.getElementById('overlay').classList.add('open');
  document.getElementById('embed-panel').classList.add('open');
  lucide.createIcons();
}

function closeEmbedPanel() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('embed-panel').classList.remove('open');
}

function copySnippet() {
  const snippet = document.getElementById('embed-snippet').textContent;
  navigator.clipboard?.writeText(snippet).catch(() => {});
  const btn = document.querySelector('.embed-copy-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="check"></i> Copied!';
  lucide.createIcons();
  setTimeout(() => { btn.innerHTML = orig; lucide.createIcons(); }, 2000);
}

function copyUrl() {
  const url = document.getElementById('embed-url').value;
  navigator.clipboard?.writeText(url).catch(() => {});
}

function togglePasswordField() {
  const on = document.getElementById('toggle-password').checked;
  document.getElementById('password-field-wrap').style.display = on ? '' : 'none';
}

function saveEmbedSettings() {
  const btn = document.querySelector('#embed-panel .panel-footer .btn-primary');
  btn.classList.add('loading');
  btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    closeEmbedPanel();
  }, 800);
}

/* ── FILTERS ───────────────────────────────────────────────── */
function bindFilters() {
  document.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderPubGrid();
    });
  });
}
