/* ============================================================
   REPORTR — Connection Manager
   connection-manager.js
   ============================================================ */

/* ── DATA ──────────────────────────────────────────────────── */

const DB_TYPES = [
  { id: 'vertica',    label: 'Vertica',     abbr: 'VT',  cls: 'db-vertica',    port: '5433', scheme: 'vertica' },
  { id: 'postgres',   label: 'PostgreSQL',  abbr: 'PG',  cls: 'db-postgres',   port: '5432', scheme: 'postgresql' },
  { id: 'mysql',      label: 'MySQL',       abbr: 'MY',  cls: 'db-mysql',      port: '3306', scheme: 'mysql' },
  { id: 'clickhouse', label: 'ClickHouse',  abbr: 'CH',  cls: 'db-clickhouse', port: '8123', scheme: 'clickhouse' },
  { id: 'snowflake',  label: 'Snowflake',   abbr: 'SF',  cls: 'db-snowflake',  port: '443',  scheme: 'snowflake' },
  { id: 'bigquery',   label: 'BigQuery',    abbr: 'BQ',  cls: 'db-bigquery',   port: 'n/a',  scheme: 'bigquery' },
];

let connections = [
  {
    id: 1, type: 'vertica', name: 'Production Analytics',
    host: 'prod-analytics.infra.company.com', port: '5433', db: 'analytics', schema: 'reporting',
    user: 'rpt_readonly', ssl: true,
    status: 'ok', lastTested: '2 minutes ago', datasets: 7
  },
  {
    id: 2, type: 'vertica', name: 'Staging — Vertica',
    host: 'staging-vdb.infra.company.com', port: '5433', db: 'analytics_stg', schema: '',
    user: 'stg_user', ssl: true,
    status: 'ok', lastTested: '18 minutes ago', datasets: 3
  },
  {
    id: 3, type: 'postgres', name: 'Marketing DWH',
    host: 'marketing-db.rds.amazonaws.com', port: '5432', db: 'marketing', schema: 'public',
    user: 'marketing_ro', ssl: true,
    status: 'error', lastTested: '1 hour ago', datasets: 2
  },
  {
    id: 4, type: 'bigquery', name: 'BigQuery — Events',
    host: '', port: '', db: '', schema: '',
    bqProject: 'company-prod', bqDataset: 'events',
    user: 'sa-reportr@company.iam', ssl: true,
    status: 'warn', lastTested: 'Not tested', datasets: 0
  },
];

let nextId         = 5;
let currentFilter  = 'all';
let selectedDbType = 'vertica';
let inputMode      = 'form';     // 'form' | 'connstr'
let sshOpen        = false;
let editingId      = null;
let deletingId     = null;

/* ── INIT ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('connections');
  lucide.createIcons();
  renderDbTypeGrid();
  renderConnections();
  bindSearch();
  bindFilters();
});

/* ── RENDER CONNECTIONS ────────────────────────────────────── */

function renderConnections() {
  const grid    = document.getElementById('conn-grid');
  const empty   = document.getElementById('empty-state');
  const counter = document.getElementById('conn-count');
  const search  = (document.getElementById('search-input').value || '').toLowerCase();

  const filtered = connections.filter(c => {
    const matchFilter =
      currentFilter === 'all'   ? true :
      currentFilter === 'ok'    ? c.status === 'ok' :
      currentFilter === 'error' ? c.status === 'error' : true;
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search) ||
      (c.host || '').toLowerCase().includes(search) ||
      c.type.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  counter.textContent = `${connections.length} connection${connections.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.style.display  = 'none';
    empty.style.display = 'flex';
    return;
  }

  grid.style.display  = 'grid';
  empty.style.display = 'none';
  grid.innerHTML = filtered.map(c => renderCard(c)).join('');
  lucide.createIcons();
}

function renderCard(c) {
  const dbType = DB_TYPES.find(d => d.id === c.type) || DB_TYPES[0];
  const statusCls   = c.status === 'ok' ? 'badge-success' : c.status === 'error' ? 'badge-error' : 'badge-warning';
  const statusLabel = c.status === 'ok' ? 'Healthy' : c.status === 'error' ? 'Connection error' : 'Not tested';
  const cardCls     = c.status === 'ok' ? 'status-ok' : c.status === 'error' ? 'status-error' : 'status-warn';
  const location    = c.type === 'bigquery'
    ? (c.bqProject || 'No project set')
    : `${c.host}${c.schema ? ' · ' + c.schema : ''}`;

  return `
    <div class="conn-card ${cardCls}" id="card-${c.id}">
      <div class="conn-card-top">
        <div class="db-icon ${dbType.cls}">${dbType.abbr}</div>
        <div class="conn-info">
          <div class="conn-name" title="${c.name}">${c.name}</div>
          <div class="conn-host">${location}</div>
        </div>
      </div>
      <div class="conn-card-mid">
        <span class="badge ${statusCls}">
          <span class="badge-dot"></span>
          ${statusLabel}
        </span>
        <span class="conn-meta">${c.lastTested}</span>
        ${c.datasets > 0 ? `<span class="conn-meta">&nbsp;·&nbsp;${c.datasets} dataset${c.datasets !== 1 ? 's' : ''}</span>` : ''}
        <div class="conn-card-actions">
          <button class="btn btn-icon btn-sm" onclick="testOne(${c.id})" data-tip="Test connection">
            <i data-lucide="zap"></i>
          </button>
          <button class="btn btn-icon btn-sm" onclick="openPanel(${c.id})" data-tip="Edit">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn btn-icon btn-sm" style="color:var(--red);" onclick="promptDelete(${c.id})" data-tip="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ── DB TYPE GRID ──────────────────────────────────────────── */

function renderDbTypeGrid() {
  const grid = document.getElementById('db-type-grid');
  grid.innerHTML = DB_TYPES.map(d => `
    <div class="db-type-option${d.id === selectedDbType ? ' selected' : ''}"
         onclick="selectDbType('${d.id}')">
      <div class="db-icon ${d.cls}">${d.abbr}</div>
      <span>${d.label}</span>
    </div>
  `).join('');
}

function selectDbType(id) {
  selectedDbType = id;
  renderDbTypeGrid();
  const dbType = DB_TYPES.find(d => d.id === id);
  if (dbType && id !== 'bigquery') {
    document.getElementById('f-port').placeholder = dbType.port;
    document.getElementById('port-hint').textContent = `Default: ${dbType.port}`;
  }
  document.getElementById('test-feedback').className = 'test-feedback';
  updatePanelForType(id);
  lucide.createIcons();
}

function updatePanelForType(type) {
  const isBQ = type === 'bigquery';
  document.getElementById('section-standard').style.display = isBQ ? 'none' : '';
  document.getElementById('section-creds').style.display    = isBQ ? 'none' : '';
  document.getElementById('section-ssh').style.display      = isBQ ? 'none' : '';
  document.getElementById('section-bq').style.display       = isBQ ? '' : 'none';
}

/* ── INPUT MODE (Form / URI) ───────────────────────────────── */

function setInputMode(mode) {
  inputMode = mode;
  document.getElementById('imt-form').classList.toggle('active', mode === 'form');
  document.getElementById('imt-connstr').classList.toggle('active', mode === 'connstr');
  document.getElementById('details-form').style.display   = mode === 'form' ? '' : 'none';
  document.getElementById('details-connstr').style.display = mode === 'connstr' ? '' : 'none';
  if (mode === 'connstr') {
    setTimeout(() => document.getElementById('f-connstr').focus(), 50);
  }
}

function parseConnString(val) {
  const parsed = document.getElementById('connstr-parsed');
  if (!val) { parsed.style.display = 'none'; return; }

  // Parse URI like: vertica://user:pass@host:5433/database
  const match = val.match(/^(\w+):\/\/([^:@]+)(?::([^@]*))?@([^:/]+)(?::(\d+))?(?:\/(\S+))?/);
  if (!match) { parsed.style.display = 'none'; return; }

  const [, scheme, user, pass, host, port, db] = match;
  const dbType = DB_TYPES.find(d => d.scheme === scheme) || DB_TYPES.find(d => d.id === selectedDbType);

  // Auto-fill the form fields
  if (host) document.getElementById('f-host').value = host;
  if (port) document.getElementById('f-port').value = port;
  if (db)   document.getElementById('f-db').value   = db;
  if (user) document.getElementById('f-user').value = user;
  if (pass) document.getElementById('f-pass').value = pass;
  if (dbType && dbType.id !== selectedDbType) selectDbType(dbType.id);

  // Show parsed confirmation
  const tags = [
    host ? `host: ${host}` : null,
    port ? `port: ${port}` : null,
    db   ? `db: ${db}`     : null,
    user ? `user: ${user}` : null,
  ].filter(Boolean);

  parsed.innerHTML = `<span style="font-size:11px;font-weight:600;letter-spacing:0.3px;">Parsed:</span> ` +
    tags.map(t => `<span class="connstr-tag">${t}</span>`).join('');
  parsed.style.display = 'flex';
}

/* ── BIGQUERY ──────────────────────────────────────────────── */

function onBqJsonUpload(input) {
  if (!input.files.length) return;
  const file = input.files[0];
  const drop = document.getElementById('bq-json-drop');
  drop.classList.add('loaded');
  document.getElementById('bq-drop-title').textContent = file.name;
  document.getElementById('bq-drop-hint').textContent  = `${(file.size / 1024).toFixed(1)} KB · Service account key ready`;
  lucide.createIcons();
}

/* ── SSH TUNNEL ────────────────────────────────────────────── */

function toggleSsh() {
  sshOpen = !sshOpen;
  document.getElementById('ssh-section').style.display = sshOpen ? '' : 'none';
  const chevron = document.getElementById('ssh-chevron');
  chevron.classList.toggle('open', sshOpen);
}

function onSshAuthChange() {
  const method = document.getElementById('f-ssh-auth').value;
  document.getElementById('ssh-key-wrap').style.display  = method === 'key'  ? '' : 'none';
  document.getElementById('ssh-pass-wrap').style.display = method === 'pass' ? '' : 'none';
}

/* ── PANEL ─────────────────────────────────────────────────── */

function openPanel(id = null) {
  editingId = id;
  const title    = document.getElementById('panel-title');
  const subtitle = document.getElementById('panel-subtitle');
  const feedback = document.getElementById('test-feedback');

  feedback.className = 'test-feedback';
  sshOpen = false;
  document.getElementById('ssh-section').style.display = 'none';
  document.getElementById('ssh-chevron').classList.remove('open');

  // Reset BQ drop zone
  const drop = document.getElementById('bq-json-drop');
  drop.classList.remove('loaded');
  document.getElementById('bq-drop-title').textContent = 'Upload service account key';
  document.getElementById('bq-drop-hint').textContent  = 'Click to browse or drag a .json file here';

  if (id) {
    const conn = connections.find(c => c.id === id);
    if (!conn) return;
    title.textContent    = 'Edit Connection';
    subtitle.textContent = 'Update the connection settings';
    selectedDbType       = conn.type;
    renderDbTypeGrid();
    updatePanelForType(conn.type);

    if (conn.type === 'bigquery') {
      document.getElementById('f-bq-project').value = conn.bqProject || '';
      document.getElementById('f-bq-dataset').value = conn.bqDataset || '';
      document.getElementById('f-bq-schema').value  = conn.schema || '';
    } else {
      document.getElementById('f-host').value   = conn.host;
      document.getElementById('f-port').value   = conn.port;
      document.getElementById('f-db').value     = conn.db;
      document.getElementById('f-schema').value = conn.schema;
      document.getElementById('f-user').value   = conn.user;
      document.getElementById('f-pass').value   = '';
      document.getElementById('f-ssl').checked  = conn.ssl;
    }
    document.getElementById('f-name').value = conn.name;
  } else {
    title.textContent    = 'New Connection';
    subtitle.textContent = 'Connect to a supported database';
    selectedDbType       = 'vertica';
    renderDbTypeGrid();
    updatePanelForType('vertica');
    setInputMode('form');
    ['f-name','f-host','f-port','f-db','f-schema','f-user','f-pass',
     'f-bq-project','f-bq-dataset','f-bq-schema','f-ssh-host','f-ssh-port','f-ssh-user'].forEach(fid => {
      const el = document.getElementById(fid);
      if (el) el.value = '';
    });
    document.getElementById('f-ssl').checked = true;
    document.getElementById('connstr-parsed').style.display = 'none';
  }

  document.getElementById('overlay').classList.add('open');
  document.getElementById('panel').classList.add('open');
  lucide.createIcons();
  setTimeout(() => document.getElementById('f-name').focus(), 120);
  document.addEventListener('keydown', escClose);
}

function closePanel() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('panel').classList.remove('open');
  document.removeEventListener('keydown', escClose);
  resetBtnLoading('btn-save');
  resetBtnLoading('btn-test');
}

function escClose(e) {
  if (e.key === 'Escape') closePanel();
}

/* ── TEST CONNECTION ───────────────────────────────────────── */

function testConnection() {
  const btn      = document.getElementById('btn-test');
  const feedback = document.getElementById('test-feedback');
  btn.classList.add('loading');
  btn.disabled = true;
  feedback.className = 'test-feedback';

  const isBQ   = selectedDbType === 'bigquery';
  const host   = !isBQ ? (document.getElementById('f-host').value || '') : '';
  const project = isBQ ? (document.getElementById('f-bq-project').value || '') : '';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;

    if (isBQ) {
      if (project) {
        feedback.innerHTML = `<i data-lucide="check-circle-2"></i>
          BigQuery authenticated — access to 3 projects, 14 datasets confirmed.`;
        feedback.className = 'test-feedback show success';
      } else {
        feedback.innerHTML = `<i data-lucide="alert-circle"></i>
          Please enter a Project ID before testing.`;
        feedback.className = 'test-feedback show error';
      }
    } else {
      const succeeds = ['vertica', 'postgres', 'snowflake'].includes(selectedDbType) && host;
      if (succeeds) {
        feedback.innerHTML = `<i data-lucide="check-circle-2"></i>
          Connection successful — found 12 schemas, 847 tables.`;
        feedback.className = 'test-feedback show success';
      } else {
        feedback.innerHTML = `<i data-lucide="alert-circle"></i>
          ${!host ? 'Please enter a host to test.' : 'Connection refused. Check your host, port, and credentials.'}`;
        feedback.className = 'test-feedback show error';
      }
    }
    lucide.createIcons();
  }, 1600);
}

function testOne(id) {
  const conn = connections.find(c => c.id === id);
  if (!conn) return;
  const card  = document.getElementById(`card-${id}`);
  const badge = card.querySelector('.badge');
  badge.innerHTML = `<span class="spinner spinner-dark" style="width:12px;height:12px;border-width:1.5px;"></span> Testing…`;
  badge.className = 'badge badge-neutral';

  setTimeout(() => {
    const ok = conn.type !== 'bigquery';
    conn.status     = ok ? 'ok' : 'error';
    conn.lastTested = 'Just now';
    renderConnections();
    lucide.createIcons();
  }, 1800);
}

/* ── SAVE ──────────────────────────────────────────────────── */

function saveConnection() {
  const name = document.getElementById('f-name').value.trim();
  const isBQ = selectedDbType === 'bigquery';

  const hostVal = isBQ ? '' : document.getElementById('f-host').value.trim();
  const dbVal   = isBQ ? '' : document.getElementById('f-db').value.trim();

  if (!name || (!isBQ && (!hostVal || !dbVal))) {
    shakePanel();
    return;
  }

  const btn = document.getElementById('btn-save');
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    const base = {
      type:       selectedDbType,
      name,
      status:     'warn',
      lastTested: 'Not tested',
      datasets:   0,
    };

    const data = isBQ ? {
      ...base,
      host: '', port: '', db: '', user: '',
      ssl: true,
      bqProject: document.getElementById('f-bq-project').value.trim(),
      bqDataset: document.getElementById('f-bq-dataset').value.trim(),
      schema:    document.getElementById('f-bq-schema').value.trim(),
    } : {
      ...base,
      host:   hostVal,
      port:   document.getElementById('f-port').value || DB_TYPES.find(d => d.id === selectedDbType)?.port || '',
      db:     dbVal,
      schema: document.getElementById('f-schema').value.trim(),
      user:   document.getElementById('f-user').value.trim(),
      ssl:    document.getElementById('f-ssl').checked,
    };

    if (editingId) {
      const idx = connections.findIndex(c => c.id === editingId);
      if (idx >= 0) connections[idx] = { ...connections[idx], ...data };
    } else {
      connections.push({ id: nextId++, ...data });
    }

    closePanel();
    renderConnections();
    lucide.createIcons();
  }, 900);
}

function shakePanel() {
  const panel = document.getElementById('panel');
  panel.style.transform = 'translateX(-8px)';
  setTimeout(() => panel.style.transform = 'translateX(4px)', 80);
  setTimeout(() => panel.style.transform = 'translateX(-4px)', 160);
  setTimeout(() => panel.style.transform = 'translateX(0)', 240);
}

/* ── DELETE ────────────────────────────────────────────────── */

function promptDelete(id) {
  deletingId = id;
  const conn = connections.find(c => c.id === id);
  if (!conn) return;
  const desc = document.getElementById('confirm-desc');
  desc.innerHTML = conn.datasets > 0
    ? `Delete <strong>"${conn.name}"</strong>? This connection has <strong>${conn.datasets} dependent dataset${conn.datasets !== 1 ? 's' : ''}</strong> that will stop working.`
    : `Delete <strong>"${conn.name}"</strong>? This action cannot be undone.`;
  document.getElementById('confirm-dialog').classList.add('open');
}

function closeConfirm() {
  document.getElementById('confirm-dialog').classList.remove('open');
  deletingId = null;
}

function confirmDelete() {
  if (deletingId === null) return;
  connections = connections.filter(c => c.id !== deletingId);
  closeConfirm();
  renderConnections();
  lucide.createIcons();
}

/* ── SEARCH & FILTER ───────────────────────────────────────── */

function bindSearch() {
  document.getElementById('search-input').addEventListener('input', renderConnections);
}

function bindFilters() {
  document.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderConnections();
    });
  });
}

/* ── HELPERS ───────────────────────────────────────────────── */

function resetBtnLoading(id) {
  const btn = document.getElementById(id);
  if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
}
