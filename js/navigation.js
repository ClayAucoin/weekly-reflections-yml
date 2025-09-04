document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1) Figure out the project base
    // If there is a <base>, honor it. Otherwise, derive "/{repo}/" from the URL.
    const baseTag = document.querySelector('base[href]');
    let projectBase = baseTag ? baseTag.getAttribute('href') : null;

    if (!projectBase) {
      // pathname looks like "/REPO/some/deeper/path.html" for project sites
      const parts = location.pathname.split('/').filter(Boolean); // remove empty
      const repo = parts.length > 0 ? parts[0] : '';              // '' for user sites
      projectBase = repo ? `/${repo}/` : '/';
    }
    if (!projectBase.endsWith('/')) projectBase += '/';

    const navUrl = new URL('html/navigation.html', location.origin + projectBase);

    // 2) Fetch and inject
    const res = await fetch(navUrl.href, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load nav: ${res.status}`);
    const html = await res.text();

    const navContainer = document.getElementById('nav-placeholder');
    if (!navContainer) throw new Error('#nav-placeholder not found');
    navContainer.innerHTML = html;

    // 3) Active link + collapsible behavior
    const normalize = p =>
      p.replace(/\/+$/, '')
       .replace(/\/index\.html$/, '') || '/';

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

    // Optional: quick debug so you can verify where it's fetching from
    // console.log('Nav fetch from:', navUrl.href, '| projectBase:', projectBase);

  } catch (err) {
    console.error(err);
    const dbg = document.getElementById('debug-output');
    if (dbg) dbg.textContent = 'ERROR: ' + err.message;
  }
});
