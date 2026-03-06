/* ============================================================
   REPORTR — Shared Sidebar Navigation
   nav.js
   ============================================================ */

const NAV_ITEMS = [
  {
    section: 'Build',
    items: [
      { id: 'connections',    label: 'Connections',    href: 'index.html',               icon: 'database',        badge: null },
      { id: 'datasets',       label: 'Datasets',       href: 'dataset-builder.html',     icon: 'table-2',         badge: null },
      { id: 'visualisations', label: 'Visualisations', href: 'visualisation-builder.html', icon: 'bar-chart-2',   badge: null },
      { id: 'dashboards',     label: 'Dashboards',     href: 'dashboard-builder.html',   icon: 'layout-dashboard',badge: null },
    ]
  },
  {
    section: 'Publish',
    items: [
      { id: 'published',  label: 'Published',   href: 'published.html',  icon: 'radio',    badge: '3'   },
      { id: 'themes',     label: 'Themes',      href: 'themes.html',     icon: 'palette',  badge: null  },
    ]
  },
  {
    section: 'System',
    items: [
      { id: 'settings',  label: 'Settings',  href: 'settings.html',  icon: 'settings',   badge: null },
      { id: 'team',      label: 'Team',      href: 'team.html',      icon: 'users',      badge: null },
    ]
  }
];

function buildSidebar(activeId) {
  const target = document.getElementById('sidebar');
  if (!target) return;

  let html = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="logo.png" class="logo-img" alt="Reportr">
        <div>
          <div class="logo-text">Reportr</div>
          <div class="logo-sub">Analytics Platform</div>
        </div>
      </div>
  `;

  NAV_ITEMS.forEach(group => {
    html += `<div class="nav-section"><div class="nav-label">${group.section}</div>`;
    group.items.forEach(item => {
      const isActive = item.id === activeId;
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      html += `
        <a href="${item.href}" class="nav-item${isActive ? ' active' : ''}">
          <i data-lucide="${item.icon}" class="ni"></i>
          ${item.label}
          ${badge}
        </a>
      `;
    });
    html += `</div>`;
  });

  html += `
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="user-avatar">DM</div>
          <div>
            <div class="user-name">Damodon</div>
            <div class="user-role">Administrator</div>
          </div>
          <i data-lucide="chevrons-up-down" style="width:14px;height:14px;color:var(--sidebar-text);margin-left:auto;flex-shrink:0;"></i>
        </div>
      </div>
    </aside>
  `;

  target.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}
