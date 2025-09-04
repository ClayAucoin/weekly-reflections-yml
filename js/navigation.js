document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Resolve relative to <base> (local: "/", GH Pages: "/weekly-reflections/")
    const navUrl = new URL('html/navigation.html', document.baseURI);

    const res = await fetch(navUrl.href, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load nav: ${res.status}`);

    const html = await res.text();

    const navContainer = document.getElementById('nav-placeholder');
    if (!navContainer) throw new Error('#nav-placeholder not found');
    navContainer.innerHTML = html;

    // ---- active link + collapsible logic ----
    const normalize = p => p.replace(/\/+$/, '').replace(/\/index\.html$/, '') || '/';
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
  } catch (err) {
    console.error(err);
  }
});
