fetch('html/navigation.html')
  .then(response => response.text())
  .then(html => {
    const navContainer = document.getElementById('nav-placeholder');
    navContainer.innerHTML = html;

    const currentPath = location.pathname.replace(/\/+$/, '');
    const links = navContainer.querySelectorAll('a');

    let activeLevel = null;

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname.replace(/\/+$/, '');

      if (linkPath === currentPath) {
        link.classList.add('active-page');
        activeLevel = link.closest('.level'); // store the level for expansion
      }
    });

    // Toggle collapse/expand on click
    const toggles = navContainer.querySelectorAll('.level-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const level = toggle.closest('.level');
        level.classList.toggle('open');
      });
    });

    // Auto-open the level containing the current page
    if (activeLevel) {
      activeLevel.classList.add('open');
    }
  });
