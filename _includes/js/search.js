var projects = document.querySelectorAll('.project-card');
var searchInput = document.getElementById('search');
var projectsFound = document.getElementById('projects-found');

projects.forEach(function(project, index) {
    console.log(project);
    project.setAttribute('search-data', project.textContent.replace(/\s/g, " ").toLowerCase());
});

function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

searchInput.addEventListener('keyup', debounce( () => {
    let search = searchInput.value.toLowerCase();
    let found = 0;
    projects.forEach(function(project, index) {
        if (project.getAttribute('search-data').includes(search)) {
            project.style.display = 'block';
            ++found;
        } else {
            project.style.display = 'none';
        }
    });
    projectsFound.innerHTML = found.toString();
}, 500))
