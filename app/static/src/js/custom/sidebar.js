<script>
document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('floating-sidebar');
    var startX, currentX;
    var threshold = 50; // Minimum swipe distance to trigger action

    sidebar.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
        currentX = startX;
    });

    sidebar.addEventListener('touchmove', function(e) {
        currentX = e.touches[0].pageX;
        var deltaX = currentX - startX;
        if (deltaX < 0) { // Swipe left
            sidebar.style.transform = `translateX(${deltaX}px)`;
        }
    });

    sidebar.addEventListener('touchend', function(e) {
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
</script>
