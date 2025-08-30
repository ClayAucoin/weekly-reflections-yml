fetch('html/links-scripts.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navigation').innerHTML = html;
    })
    .catch(error => console.error('Error loading content:', error));
