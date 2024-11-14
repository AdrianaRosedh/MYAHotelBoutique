document.addEventListener('DOMContentLoaded', function () {

    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight;
        var winHeight = window.innerHeight;
        var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        var progressBar = document.getElementById('progressBar');

        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        } else {
            console.error('Progress bar element not found');
        }
    });
});
