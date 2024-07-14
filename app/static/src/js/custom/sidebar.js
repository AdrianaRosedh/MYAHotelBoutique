document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('floating-sidebar');
    var startX, currentX;
    var threshold = 50; // Minimum swipe distance to trigger action

    // Touch start event to capture the starting X coordinate
    sidebar.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
        currentX = startX;
    });

    // Touch move event to update the current X coordinate and move the sidebar
    sidebar.addEventListener('touchmove', function(e) {
        currentX = e.touches[0].pageX;
        var deltaX = currentX - startX;
        if (deltaX < 0) { // Swipe left
            sidebar.style.transform = `translateX(${deltaX}px)`;
        }
    });

    // Touch end event to determine if the sidebar should be shown or hidden
    sidebar.addEventListener('touchend', function() {
        var deltaX = currentX - startX;
        if (deltaX < -threshold) { // Hide sidebar if swipe left is more than threshold
            sidebar.classList.add('hidden');
        } else if (deltaX > threshold) { // Show sidebar if swipe right is more than threshold
            sidebar.classList.remove('hidden');
        } else { // Revert to original position if swipe is less than threshold
            sidebar.style.transform = 'translateX(0)';
        }
    });
});