document.addEventListener('DOMContentLoaded', () => {
    // Example filename from current URL
    const path = window.location.pathname;
    let fileName = path.substring(path.lastIndexOf('/') + 1);

    if (!fileName) fileName = 'index.html';

    // Regex: looks for "lv#" and "week#"
    const match = fileName.match(/lv(\d+)-week(\d+)/i);

    if (match) {
        const level = match[1]; // "2"
        const week = match[2];  // "3"

        document.getElementById('display').innerHTML = `Level ${level} &mdash; Week ${week}`;
        document.getElementById('title').textContent = `Clay Aucoin — Level ${level} Week ${week} Reflection`;
    }
});
