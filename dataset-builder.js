/* ============================================================
   REPORTR — Dataset Builder
   dataset-builder.js
   ============================================================ */

/* ── MOCK DATA ─────────────────────────────────────────────── */

const MOCK_FIELDS = [
  { src: 'order_id',         alias: 'Order ID',               type: 'number',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'customer_id',      alias: 'Customer ID',            type: 'number',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'customer_name',    alias: 'Customer Name',          type: 'string',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'product_category', alias: 'Product Category',       type: 'string',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'order_date',       alias: 'Order Date',             type: 'date',     role: 'dim', agg: 'count',  visible: true  },
  { src: 'ship_date',        alias: 'Ship Date',              type: 'date',     role: 'dim', agg: 'count',  visible: false },
  { src: 'region',           alias: 'Region',                 type: 'string',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'status',           alias: 'Order Status',           type: 'string',   role: 'dim', agg: 'count',  visible: true  },
  { src: 'is_returned',      alias: 'Returned?',              type: 'boolean',  role: 'dim', agg: 'count',  visible: true  },
  { src: 'revenue',          alias: 'Revenue',                type: 'currency', role: 'msr', agg: 'sum',    visible: true  },
  { src: 'quantity',         alias: 'Quantity',               type: 'number',   role: 'msr', agg: 'sum',    visible: true  },
  { src: 'discount',         alias: 'Discount %',             type: 'pct',      role: 'msr', agg: 'avg',    visible: true  },
];

const MOCK_PREVIEW = [
  [10821, 4201, 'Helena Marsh',    'Electronics',  '2025-11-03', '2025-11-05', 'EMEA',  'Delivered', false, 1249.00, 2, 0.05],
  [10822, 8833, 'James Okafor',    'Furniture',    '2025-11-03', '2025-11-07', 'NAM',   'Delivered', false, 399.00,  1, 0.00],
  [10823, 4201, 'Helena Marsh',    'Software',     '2025-11-04', '2025-11-05', 'EMEA',  'Delivered', false, 89.00,   3, 0.10],
  [10824, 2019, 'Riya Kapoor',     'Electronics',  '2025-11-04', '2025-11-09', 'APAC',  'Returned',  true,  749.50,  1, 0.00],
  [10825, 5503, 'Miguel Ferreira', 'Office Supp.', '2025-11-05', '2025-11-06', 'EMEA',  'Delivered', false, 62.40,   5, 0.05],
  [10826, 7712, 'Sara Chen',       'Electronics',  '2025-11-05', '2025-11-10', 'APAC',  'Delivered', false, 2199.00, 1, 0.00],
  [10827, 3344, 'Tom Bradley',     'Furniture',    '2025-11-06', '2025-11-11', 'NAM',   'Processing',false, 899.00,  2, 0.10],
  [10828, 9102, 'Amara Osei',      'Software',     '2025-11-06', '2025-11-07', 'EMEA',  'Delivered', false, 199.00,  1, 0.20],
];

const FIELD_TYPES = [
  { value: 'string',   label: 'String'     },
  { value: 'number',   label: 'Number'     },
  { value: 'currency', label: 'Currency'   },
  { value: 'pct',      label: 'Percentage' },
  { value: 'date',     label: 'Date'       },
  { value: 'datetime', label: 'DateTime'   },
  { value: 'boolean',  label: 'Boolean'    },
];

const AGGREGATIONS = [
  { value: 'sum',   label: 'Sum'           },
  { value: 'count', label: 'Count'         },
  { value: 'cntd',  label: 'Count Distinct'},
  { value: 'avg',   label: 'Average'       },
  { value: 'min',   label: 'Min'           },
  { value: 'max',   label: 'Max'           },
];

const TABLE_COLUMNS = {
  orders: [
    { name: 'order_id',         type: 'number'   },
    { name: 'customer_id',      type: 'number'   },
    { name: 'customer_name',    type: 'string'   },
    { name: 'product_category', type: 'string'   },
    { name: 'order_date',       type: 'date'     },
    { name: 'ship_date',        type: 'date'     },
    { name: 'region',           type: 'string'   },
    { name: 'status',           type: 'string'   },
    { name: 'is_returned',      type: 'boolean'  },
    { name: 'revenue',          type: 'number'   },
    { name: 'quantity',         type: 'number'   },
    { name: 'discount',         type: 'number'   },
  ],
  customers: [
    { name: 'customer_id',   type: 'number' },
    { name: 'full_name',     type: 'string' },
    { name: 'email',         type: 'string' },
    { name: 'signup_date',   type: 'date'   },
    { name: 'country',       type: 'string' },
    { name: 'segment',       type: 'string' },
    { name: 'ltv',           type: 'number' },
  ],
};

const DEFAULT_SQL = `SELECT
  o.order_id,
  o.customer_id,
  c.full_name          AS customer_name,
  o.product_category,
  o.order_date::date   AS order_date,
  o.ship_date::date    AS ship_date,
  o.region,
  o.status,
  o.is_returned,
  o.revenue,
  o.quantity,
  o.discount
FROM reporting.orders o
JOIN reporting.customers c USING (customer_id)
WHERE o.order_date >= DATEADD('year', -1, CURRENT_DATE)`;

/* ── STATE ─────────────────────────────────────────────────── */

let currentMode    = 'sql';
let fields         = [];
let hasRunQuery    = false;
let cmEditor       = null;
let previewOpen    = false;

/* ── INIT ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('datasets');
  lucide.createIcons();
  initCodeMirror();
  openPreview(); // open preview accordion by default
});

/* ── CODE MIRROR ───────────────────────────────────────────── */

function initCodeMirror() {
  const wrap = document.getElementById('sql-editor-wrap');
  cmEditor = CodeMirror(wrap, {
    value: DEFAULT_SQL,
    mode: 'text/x-sql',
    theme: 'dracula',
    lineNumbers: true,
    indentWithTabs: false,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: false,
    autofocus: false,
    extraKeys: {
      'Ctrl-Enter': runQuery,
      'Cmd-Enter':  runQuery,
    }
  });

  cmEditor.on('change', () => {
    const lines = cmEditor.lineCount();
    const chars = cmEditor.getValue().length;
    document.getElementById('sql-info').textContent = `${lines} line${lines !== 1 ? 's' : ''} · ${chars} chars`;
  });
}

/* ── MODE SWITCH ───────────────────────────────────────────── */

function switchMode(mode) {
  currentMode = mode;
  document.getElementById('tab-sql').classList.toggle('active',    mode === 'sql');
  document.getElementById('tab-table').classList.toggle('active',  mode === 'table');
  document.getElementById('tab-visual').classList.toggle('active', mode === 'visual');
  document.getElementById('panel-sql').classList.toggle('active',    mode === 'sql');
  document.getElementById('panel-table').classList.toggle('active',  mode === 'table');
  document.getElementById('panel-visual').classList.toggle('active', mode === 'visual');
  if (mode === 'visual') initVisualMode();
  lucide.createIcons();
}

/* ── SCHEMA / TABLE PICKER ─────────────────────────────────── */

function onSchemaChange() {
  document.getElementById('sel-table').value = '';
  document.getElementById('col-checklist-wrap').style.display = 'none';
  document.getElementById('table-run-wrap').style.display = 'none';
}

function onTableChange() {
  const tbl  = document.getElementById('sel-table').value;
  const wrap = document.getElementById('col-checklist-wrap');
  const run  = document.getElementById('table-run-wrap');
  if (!tbl) { wrap.style.display = 'none'; run.style.display = 'none'; return; }

  const cols = TABLE_COLUMNS[tbl] || [];
  if (cols.length === 0) {
    wrap.style.display = 'none'; run.style.display = 'none'; return;
  }

  const list = document.getElementById('col-checklist');
  list.innerHTML = `
    <div class="col-checklist-header">
      <i data-lucide="columns" style="width:12px;height:12px;"></i>
      ${cols.length} columns available
      <label style="margin-left:auto;font-size:11px;cursor:pointer;font-weight:500;color:var(--accent);">
        <input type="checkbox" style="accent-color:var(--accent);margin-right:4px;" checked
               onchange="toggleAllCols(this.checked)">
        All
      </label>
    </div>
    <div class="col-checklist-body">
      ${cols.map(c => `
        <label class="col-check-item">
          <input type="checkbox" class="col-check" data-col="${c.name}" checked>
          <span class="col-check-name">${c.name}</span>
          <span class="col-check-type">${c.type}</span>
        </label>
      `).join('')}
    </div>
  `;

  wrap.style.display = '';
  run.style.display  = '';
  lucide.createIcons();
}

function toggleAllCols(checked) {
  document.querySelectorAll('.col-check').forEach(cb => cb.checked = checked);
}

/* ── RUN QUERY ─────────────────────────────────────────────── */

function runQuery() {
  const btn = document.getElementById('btn-run');
  if (btn) btn.classList.add('running');

  const topBtn = document.getElementById('btn-preview-top');
  if (topBtn) { topBtn.disabled = true; topBtn.classList.add('loading'); }

  const status = document.getElementById('query-status');
  status.style.display = 'inline-flex';
  status.className = 'badge badge-neutral';
  status.textContent = 'Running…';

  setTimeout(() => {
    if (btn) btn.classList.remove('running');
    if (topBtn) { topBtn.disabled = false; topBtn.classList.remove('loading'); }

    // Populate fields from mock
    fields = MOCK_FIELDS.map(f => ({ ...f }));
    hasRunQuery = true;

    status.className = 'badge badge-success';
    status.textContent = '✓ 100 rows returned';

    // Mark steps
    document.getElementById('step1-num').className = 'step-num done';
    document.getElementById('step2-num').className = 'step-num active';
    document.getElementById('step3-num').className = 'step-num active';

    renderFieldTable();
    renderPreview();
    openPreview();

    document.getElementById('btn-add-field').style.display = '';
    showToast('Query ran successfully — 100 rows · 12 fields detected');
    lucide.createIcons();
  }, 1500);
}

/* ── FIELD TABLE ───────────────────────────────────────────── */

function renderFieldTable() {
  const wrap  = document.getElementById('fields-table-wrap');
  const empty = document.getElementById('fields-empty');
  const tbody = document.getElementById('field-tbody');
  const label = document.getElementById('field-count-label');

  if (!fields.length) {
    empty.style.display = 'flex'; wrap.style.display = 'none';
    label.textContent = '';
    return;
  }

  empty.style.display = 'none'; wrap.style.display = '';
  label.textContent = `${fields.length} field${fields.length !== 1 ? 's' : ''}`;

  const typeOptions = FIELD_TYPES.map(t =>
    `<option value="${t.value}">${t.label}</option>`
  ).join('');

  const aggOptions = AGGREGATIONS.map(a =>
    `<option value="${a.value}">${a.label}</option>`
  ).join('');

  tbody.innerHTML = fields.map((f, i) => {
    const isMsr = f.role === 'msr';
    const visIcon = f.visible ? 'eye' : 'eye-off';
    const visClass = f.visible ? '' : 'hidden';
    const typeChip = typeChipHtml(f.type);

    return `
      <tr id="field-row-${i}">
        <td><div class="drag-handle"><i data-lucide="grip-vertical"></i></div></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="field-name-cell">${f.src}</span>
            ${typeChip}
          </div>
        </td>
        <td>
          <input class="field-alias-input" type="text" value="${f.alias}"
                 onchange="updateField(${i}, 'alias', this.value)"
                 placeholder="${f.src}">
        </td>
        <td>
          <select class="field-type-sel" onchange="updateField(${i}, 'type', this.value)">
            ${FIELD_TYPES.map(t =>
              `<option value="${t.value}"${t.value === f.type ? ' selected' : ''}>${t.label}</option>`
            ).join('')}
          </select>
        </td>
        <td>
          <div class="role-toggle">
            <button class="role-btn${!isMsr ? ' dim' : ''}" onclick="setRole(${i}, 'dim')">Dimension</button>
            <button class="role-btn${isMsr  ? ' msr' : ''}" onclick="setRole(${i}, 'msr')">Measure</button>
          </div>
        </td>
        <td>
          <select class="agg-sel" id="agg-${i}"
                  onchange="updateField(${i}, 'agg', this.value)"
                  ${!isMsr ? 'disabled' : ''}>
            ${AGGREGATIONS.map(a =>
              `<option value="${a.value}"${a.value === f.agg ? ' selected' : ''}>${a.label}</option>`
            ).join('')}
          </select>
        </td>
        <td style="text-align:center;">
          <button class="vis-toggle ${visClass}" onclick="toggleVisibility(${i})" data-tip="${f.visible ? 'Hide field' : 'Show field'}">
            <i data-lucide="${visIcon}"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function typeChipHtml(type) {
  const map = {
    string:   ['String',     'ftype-string'  ],
    number:   ['Number',     'ftype-number'  ],
    currency: ['Currency',   'ftype-currency'],
    pct:      ['%',          'ftype-pct'     ],
    date:     ['Date',       'ftype-date'    ],
    datetime: ['DateTime',   'ftype-datetime'],
    boolean:  ['Boolean',    'ftype-boolean' ],
  };
  const [label, cls] = map[type] || ['?', 'ftype-string'];
  return `<span class="ftype ${cls}">${label}</span>`;
}

function updateField(i, key, value) {
  if (fields[i]) fields[i][key] = value;
}

function setRole(i, role) {
  if (!fields[i]) return;
  fields[i].role = role;
  const row   = document.getElementById(`field-row-${i}`);
  const dimBtn = row.querySelector('.role-btn:first-child');
  const msrBtn = row.querySelector('.role-btn:last-child');
  const aggSel = document.getElementById(`agg-${i}`);
  dimBtn.className = `role-btn${role === 'dim' ? ' dim' : ''}`;
  msrBtn.className = `role-btn${role === 'msr' ? ' msr' : ''}`;
  aggSel.disabled  = role !== 'msr';
}

function toggleVisibility(i) {
  if (!fields[i]) return;
  fields[i].visible = !fields[i].visible;
  const btn = document.querySelector(`#field-row-${i} .vis-toggle`);
  if (!btn) return;
  btn.classList.toggle('hidden', !fields[i].visible);
  btn.setAttribute('data-tip', fields[i].visible ? 'Hide field' : 'Show field');
  btn.innerHTML = `<i data-lucide="${fields[i].visible ? 'eye' : 'eye-off'}"></i>`;
  lucide.createIcons();
}

function addComputedField() {
  const name = prompt('Enter a name for the computed field (e.g. avg_order_value):');
  if (!name) return;
  fields.push({
    src: name, alias: name.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase()),
    type: 'number', role: 'msr', agg: 'sum', visible: true
  });
  renderFieldTable();
  showToast(`Computed field "${name}" added`);
}

/* ── PREVIEW ───────────────────────────────────────────────── */

function renderPreview() {
  const badge     = document.getElementById('preview-badge');
  const countLbl  = document.getElementById('preview-count-label');
  const empty     = document.getElementById('preview-empty');
  const tableWrap = document.getElementById('preview-table-wrap');
  const head      = document.getElementById('preview-head');
  const body      = document.getElementById('preview-body-rows');
  const rowCount  = document.getElementById('preview-row-count');

  badge.innerHTML = '<span class="badge badge-accent">100 rows</span>';
  countLbl.textContent = 'Showing first 8 rows';
  empty.style.display  = 'none';
  tableWrap.style.display = '';

  // Headers from MOCK_FIELDS
  head.innerHTML = MOCK_FIELDS.map(f =>
    `<th>${f.alias}</th>`
  ).join('');

  // Rows
  body.innerHTML = MOCK_PREVIEW.map(row =>
    `<tr>${row.map((cell, ci) => {
      let display = cell;
      const field = MOCK_FIELDS[ci];
      if (field) {
        if (field.type === 'currency') display = `$${Number(cell).toLocaleString('en-US',{minimumFractionDigits:2})}`;
        else if (field.type === 'pct') display = `${(cell*100).toFixed(0)}%`;
        else if (field.type === 'boolean') display = cell ? 'true' : 'false';
        else if (field.type === 'date') display = cell;
      }
      return `<td>${display}</td>`;
    }).join('')}</tr>`
  ).join('');

  rowCount.textContent = 'Showing 8 of 100 rows · Limited to 100 in preview mode';
  lucide.createIcons();
}

function openPreview() {
  previewOpen = true;
  document.getElementById('preview-body').classList.add('open');
  document.getElementById('preview-toggle-btn').classList.add('open');
  lucide.createIcons();
}

function togglePreview() {
  previewOpen = !previewOpen;
  document.getElementById('preview-body').classList.toggle('open', previewOpen);
  document.getElementById('preview-toggle-btn').classList.toggle('open', previewOpen);
  lucide.createIcons();
}

/* ── VISUAL QUERY BUILDER ──────────────────────────────────── */

const SCHEMA_TREE_DATA = [
  { schema: 'reporting', tables: ['orders', 'customers', 'products', 'order_items', 'campaigns'] },
  { schema: 'public',    tables: ['lookup_regions', 'lookup_currencies', 'settings'] },
  { schema: 'staging',   tables: ['stg_orders', 'stg_customers', 'stg_events'] },
  { schema: 'raw',       tables: ['raw_events', 'raw_sessions', 'raw_pageviews'] },
];

// Tables currently on the canvas
let vTables = [
  {
    schema: 'reporting', table: 'orders', alias: 'o',
    cols: TABLE_COLUMNS['orders'].map((c, i) => ({ ...c, selected: [0,1,3,4,6,7,9].includes(i) }))
  },
  {
    schema: 'reporting', table: 'customers', alias: 'c',
    cols: TABLE_COLUMNS['customers'].map((c, i) => ({ ...c, selected: [0,1,2].includes(i) }))
  },
];

let vJoins = [
  { leftTable: 'orders', leftCol: 'customer_id', rightTable: 'customers', rightCol: 'customer_id', type: 'INNER' }
];

let vFilters = [
  { field: 'revenue', op: '>', value: '0' }
];

let schemaOpen = { reporting: true, public: false, staging: false, raw: false };

let vInited = false;

function initVisualMode() {
  if (!document.getElementById('schema-tree')) return;
  renderSchemaTree();
  renderCanvasTables();
  renderVFilters();
  updateVFieldCount();
  vInited = true;
}

/* Schema browser */
function renderSchemaTree() {
  const tree = document.getElementById('schema-tree');
  if (!tree) return;
  let html = '';
  SCHEMA_TREE_DATA.forEach(s => {
    const isOpen = schemaOpen[s.schema];
    html += `
      <div class="schema-item schema-hd" onclick="toggleSchemaNode('${s.schema}')">
        <i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}"></i>
        <i data-lucide="layers-2"></i>
        ${s.schema}
      </div>
    `;
    if (isOpen) {
      s.tables.forEach(t => {
        const onCanvas = vTables.some(vt => vt.table === t && vt.schema === s.schema);
        html += `
          <div class="schema-item tbl-row${onCanvas ? ' tbl-on' : ''}"
               onclick="vAddTableToCanvas('${s.schema}', '${t}')">
            <i data-lucide="table-2"></i>
            ${t}
            ${onCanvas ? '<i data-lucide="check" style="width:11px;height:11px;margin-left:auto;color:var(--accent);"></i>' : ''}
          </div>
        `;
      });
    }
  });
  tree.innerHTML = html;
  lucide.createIcons();
}

function toggleSchemaNode(schema) {
  schemaOpen[schema] = !schemaOpen[schema];
  renderSchemaTree();
}

function vAddTableToCanvas(schema, table) {
  if (vTables.some(t => t.table === table && t.schema === schema)) return;
  const cols = TABLE_COLUMNS[table];
  if (!cols) return; // table not in mock data
  vTables.push({
    schema, table,
    alias: table.charAt(0),
    cols: cols.map((c, i) => ({ ...c, selected: i < 3 }))
  });
  renderSchemaTree();
  renderCanvasTables();
  updateVFieldCount();
}

function vRemoveTable(table) {
  vTables  = vTables.filter(t => t.table !== table);
  vJoins   = vJoins.filter(j => j.leftTable !== table && j.rightTable !== table);
  renderSchemaTree();
  renderCanvasTables();
  updateVFieldCount();
}

function vToggleCol(ti, ci) {
  if (vTables[ti]) {
    vTables[ti].cols[ci].selected = !vTables[ti].cols[ci].selected;
    const cb = document.getElementById(`vcol-${ti}-${ci}`);
    if (cb) cb.checked = vTables[ti].cols[ci].selected;
    updateVFieldCount();
  }
}

/* Canvas */
function renderCanvasTables() {
  const row = document.getElementById('canvas-tables-row');
  if (!row) return;

  if (vTables.length === 0) {
    row.innerHTML = `
      <div style="padding:32px 24px;color:var(--text-3);font-size:13px;text-align:center;">
        <i data-lucide="mouse-pointer-2" style="width:28px;height:28px;margin:0 auto 10px;display:block;opacity:0.3;"></i>
        Click a table in the schema browser to add it to the canvas
      </div>`;
    lucide.createIcons();
    return;
  }

  let html = '';
  vTables.forEach((t, ti) => {
    html += `
      <div class="table-node" id="vnode-${t.table}">
        <div class="table-node-hd">
          <i data-lucide="table-2"></i>
          <span>${t.table}</span>
          <span class="node-alias">${t.alias}</span>
          <button class="node-close" onclick="vRemoveTable('${t.table}')">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="table-node-cols">
          ${t.cols.map((col, ci) => `
            <label class="node-col-row">
              <input type="checkbox" id="vcol-${ti}-${ci}"
                     ${col.selected ? 'checked' : ''}
                     onchange="vToggleCol(${ti}, ${ci})">
              <span class="node-col-name">${col.name}</span>
              <span class="node-col-type">${col.type}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    // Join connector between consecutive tables
    if (ti < vTables.length - 1) {
      const next = vTables[ti + 1];
      const j = vJoins.find(jn =>
        (jn.leftTable === t.table && jn.rightTable === next.table) ||
        (jn.rightTable === t.table && jn.leftTable === next.table)
      ) || { type: 'INNER', leftCol: 'id', rightCol: 'id' };

      html += `
        <div class="join-connector">
          <div class="join-line"></div>
          <div class="join-badge">
            <select class="join-type-sel" onchange="vUpdateJoinType(${ti}, this.value)">
              ${['INNER','LEFT','RIGHT','FULL'].map(tp =>
                `<option value="${tp}"${j.type === tp ? ' selected' : ''}>${tp} JOIN</option>`
              ).join('')}
            </select>
            <div class="join-cond">${t.alias}.${j.leftCol} = ${next.alias}.${j.rightCol}</div>
          </div>
          <div class="join-line"></div>
        </div>
      `;
    }
  });

  row.innerHTML = html;
  lucide.createIcons();
}

function vUpdateJoinType(connIdx, type) {
  if (vJoins[connIdx]) vJoins[connIdx].type = type;
}

/* Filters */
function renderVFilters() {
  const container = document.getElementById('filter-rows');
  if (!container) return;

  const allFields = vTables.flatMap(t => t.cols.filter(c => c.selected).map(c => c.name));
  const ops = ['=','!=','>','<','>=','<=','LIKE','IN','IS NULL','IS NOT NULL'];

  container.innerHTML = vFilters.map((f, i) => {
    const fieldOpts = allFields.map(name =>
      `<option value="${name}"${name === f.field ? ' selected' : ''}>${name}</option>`
    ).join('');
    const opOpts = ops.map(op =>
      `<option value="${op}"${op === f.op ? ' selected' : ''}>${op}</option>`
    ).join('');
    return `
      <div class="filter-row">
        <span class="filter-pfx">${i === 0 ? 'WHERE' : 'AND'}</span>
        <select class="fsel fsel-field" onchange="vUpdateFilter(${i}, 'field', this.value)">${fieldOpts}</select>
        <select class="fsel fsel-op" onchange="vUpdateFilter(${i}, 'op', this.value)">${opOpts}</select>
        <input class="fval" type="text" value="${f.value}" placeholder="value"
               oninput="vUpdateFilter(${i}, 'value', this.value)">
        <button class="filter-rm" onclick="vRemoveFilter(${i})"><i data-lucide="x"></i></button>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}

function vAddFilter() {
  const allFields = vTables.flatMap(t => t.cols.filter(c => c.selected).map(c => c.name));
  vFilters.push({ field: allFields[0] || 'field', op: '=', value: '' });
  renderVFilters();
}

function vRemoveFilter(i) { vFilters.splice(i, 1); renderVFilters(); }
function vUpdateFilter(i, key, value) { if (vFilters[i]) vFilters[i][key] = value; }

function updateVFieldCount() {
  const lbl = document.getElementById('v-field-count');
  if (!lbl) return;
  const total  = vTables.reduce((a, t) => a + t.cols.filter(c => c.selected).length, 0);
  const tables = vTables.length;
  lbl.textContent = total > 0
    ? `${total} field${total !== 1 ? 's' : ''} selected across ${tables} table${tables !== 1 ? 's' : ''}`
    : 'Select fields from the table cards above';
}

/* Generate SQL from visual state */
function vGenerateSQL() {
  if (vTables.length === 0) { showToast('Add at least one table to generate SQL', true); return; }

  const selects = vTables.flatMap(t =>
    t.cols.filter(c => c.selected).map(c => `  ${t.alias}.${c.name}`)
  );

  const from = `FROM ${vTables[0].schema}.${vTables[0].table} ${vTables[0].alias}`;

  const joins = vJoins.map(j => {
    const rt = vTables.find(t => t.table === j.rightTable);
    if (!rt) return '';
    const lt = vTables.find(t => t.table === j.leftTable);
    return `${j.type} JOIN ${rt.schema}.${rt.table} ${rt.alias} ON ${lt ? lt.alias : j.leftTable}.${j.leftCol} = ${rt.alias}.${j.rightCol}`;
  }).filter(Boolean);

  const wheres = vFilters
    .filter(f => f.value || f.op === 'IS NULL' || f.op === 'IS NOT NULL')
    .map(f => f.op === 'IS NULL' || f.op === 'IS NOT NULL'
      ? `${f.field} ${f.op}`
      : `${f.field} ${f.op} ${isNaN(f.value) || f.value === '' ? `'${f.value}'` : f.value}`
    );

  const orderField = document.getElementById('v-order-field')?.value;
  const orderDir   = document.getElementById('v-order-dir')?.value || 'DESC';
  const limit      = document.getElementById('v-limit')?.value || '100';

  let sql = `SELECT\n${selects.join(',\n')}\n${from}`;
  if (joins.length)  sql += '\n' + joins.join('\n');
  if (wheres.length) sql += '\nWHERE ' + wheres.join('\n  AND ');
  if (orderField)    sql += `\nORDER BY ${orderField} ${orderDir}`;
  sql += `\nLIMIT ${limit}`;

  switchMode('sql');
  if (cmEditor) { cmEditor.setValue(sql); cmEditor.refresh(); }
  showToast('SQL generated — review and run when ready');
}

function vRunQuery() {
  vGenerateSQL();
  setTimeout(() => runQuery(), 150);
}

/* ── FORMAT SQL ────────────────────────────────────────────── */

function formatSQL() {
  if (!cmEditor) return;
  // Simple demo: just show the default formatted SQL
  cmEditor.setValue(DEFAULT_SQL);
  showToast('SQL formatted');
}

/* ── SAVE ──────────────────────────────────────────────────── */

function saveDataset() {
  const name = document.getElementById('ds-name').value.trim();
  if (!name) {
    document.getElementById('ds-name').focus();
    document.getElementById('ds-name').classList.add('error');
    setTimeout(() => document.getElementById('ds-name').classList.remove('error'), 2000);
    return;
  }
  if (!hasRunQuery) {
    showToast('Run the query first to validate the dataset', true);
    return;
  }

  const btn = document.getElementById('btn-save-ds');
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    showToast(`Dataset "${name}" saved successfully`);
    document.getElementById('step1-num').className = 'step-num done';
    document.getElementById('step2-num').className = 'step-num done';
    document.getElementById('step3-num').className = 'step-num done';
  }, 1200);
}

/* ── BREADCRUMB NAME ───────────────────────────────────────── */

function updateNameBc() {
  const val = document.getElementById('ds-name').value || 'Untitled Dataset';
  document.getElementById('ds-name-bc').textContent = val;
  document.title = `${val} — Reportr`;
}

/* ── TOAST ─────────────────────────────────────────────────── */

let toastTimeout = null;

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const text  = document.getElementById('toast-msg');
  text.textContent = msg;
  toast.style.background = isError ? 'var(--red)' : '#111827';
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
  lucide.createIcons();
}
