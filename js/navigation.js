document.addEventListener('DOMContentLoaded', async () => {
  try {
    // --- Figure out the correct project base ---
    const baseTag = document.querySelector('base[href]');
    const { hostname, pathname, origin } = location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    let projectBase;

    if (baseTag) {
      // Honor an explicit <base> first
      const a = document.createElement('a');
      a.href = baseTag.getAttribute('href');
      projectBase = a.pathname;
    } else if (isLocal) {
      // On localhost, treat server root as project root
      projectBase = '/';
    } else if (hostname.endsWith('.github.io')) {
      // On GitHub Pages, project sites live under /REPO/
      const parts = pathname.split('/').filter(Boolean);
      const repo = parts.length ? parts[0] : '';
      projectBase = repo ? `/${repo}/` : '/'; // user/org site vs project site
    } else {
      // Fallback: use root
      projectBase = '/';
    }

    if (!projectBase.endsWith('/')) projectBase += '/';

    // Always fetch from the computed project root
    const navUrl = new URL('html/navigation.html', origin + projectBase);

    // --- Fetch + inject nav ---
    const res = await fetch(navUrl.href, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load nav: ${res.status}`);
    const html = await res.text();

    const navContainer = document.getElementById('nav-placeholder');
    if (!navContainer) throw new Error('#nav-placeholder not found');
    navContainer.innerHTML = html;

    // --- Active link + collapsible behavior ---
    const normalize = p =>
      (p || '/')
        .replace(/\/+$/, '')
        .replace(/\/index\.html$/i, '') || '/';

    const currentPath = normalize(location.pathname);

    const links = navContainer.querySelectorAll('a');
    let activeLevel = null;

    links.forEach(link => {
      const linkPath = normalize(new URL(link.href).pathname);
      if (linkPath === currentPath) {
        link.classList.add('active-page');
        activeLevel = link.closest('.level');
      }
    });

    navContainer.querySelectorAll('.level-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.level')?.classList.toggle('open');
      });
    });

    if (activeLevel) activeLevel.classList.add('open');

    // Debug line if you want to verify:
    // console.log('navUrl:', navUrl.href, 'projectBase:', projectBase);

  } catch (err) {
    console.error(err);
    const dbg = document.getElementById('debug-output');
    if (dbg) dbg.textContent = 'ERROR: ' + err.message;
  }
});
