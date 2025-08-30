fetch('html/navigation-lv2.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;
    })
    .catch(error => console.error('Error loading content:', error));

// Load and inject navigation.html
fetch('html/navigation-lv2.html')
  .then(response => {
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    return response.text();
  })
  .then(html => {
    const navContainer = document.getElementById('navigation');
    const debug = document.getElementById('debug-output');
    
    if (!debug) {
      console.warn('No debug output element found!');
      return;
    }

    navContainer.innerHTML = html;

    const currentPath = location.pathname.replace(/\/+$/, '');
    let debugText = `Current path: ${currentPath}\n\n`;

    const links = navContainer.querySelectorAll('a');

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname.replace(/\/+$/, '');
      debugText += `Link: ${link.href}\nPath: ${linkPath}\n`;

      if (linkPath === currentPath) {
        link.classList.add('active-page');
        debugText += `=> MATCHED and added .active-page\n`;
      }

      debugText += '\n';
    });

    debug.textContent = debugText;
  })
  .catch(err => {
    const debug = document.getElementById('debug-output');
    if (debug) {
      debug.textContent = 'ERROR: ' + err.message;
    }
    console.error(err);
  });
