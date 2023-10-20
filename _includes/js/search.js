var projects = document.querySelectorAll('.project-card');
var searchInput = document.getElementById('search');
var projectsFound = document.getElementById('projects-found');
var showMoreButton = document.getElementById('show-more-projects');
var matchingProjects = projects.length;
var visibleProjects = 0;
var projectsPerPage = 6;

if(searchInput){
    // Add search data to projects and reset their visibility
    projects.forEach(function(project, index) {
        console.log(project);
        project.setAttribute('search-data', project.textContent.replace(/\s/g, " ").toLowerCase());
        if(visibleProjects < projectsPerPage){
            project.style.display = 'block';
            ++visibleProjects;
        }
    });

    function updateShowMoreButton() {
        if (visibleProjects < matchingProjects) {
            showMoreButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'none';
        }
    }

    // Add event listener to show more button
    updateShowMoreButton();
    showMoreButton.addEventListener('click', function() {
        let projects = document.querySelectorAll('.search-match');
        let newVisibleProjects = visibleProjects + projectsPerPage;
        for (var i = visibleProjects; i < newVisibleProjects; ++i) {
            if (projects[i]) {
                projects[i].style.display = 'block';
                ++visibleProjects;
            }
        }
        updateShowMoreButton();
    });

    // Add event listener to search input
    function debounce(callback, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(function () { callback.apply(this, args); }, wait);
        };
    }

    searchInput.addEventListener('keyup', debounce( () => {
        let search = searchInput.value.toLowerCase();
        matchingProjects = 0;
        visibleProjects = 0;
        projects.forEach(function(project, index) {
            project.style.display = 'none';
            if (project.getAttribute('search-data').includes(search)) {
                project.classList.add('search-match');
                ++matchingProjects;
                if(visibleProjects < projectsPerPage){
                    project.style.display = 'block';
                    ++visibleProjects;
                }
            } else {
                project.classList.remove('search-match');
            }
        });
        projectsFound.innerHTML = matchingProjects.toString();
        updateShowMoreButton();
    }, 500));

}