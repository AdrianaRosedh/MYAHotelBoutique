// Top Progress bar
window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    document.getElementById('progressBar').style.width = scrollPercent + '%';
  
    // Show/hide back to top button
    var backToTop = document.getElementById('backToTop');
    if (scrollTop > 300) { // Show after scrolling down 300px
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
  });