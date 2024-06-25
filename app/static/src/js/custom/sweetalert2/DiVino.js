document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        Swal.fire({
            title: "You can already get Coffee and Wine!",
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff", 
            backdrop: `
                rgba(0,0,123,0.4)
                url('{{ url_for('static', filename='dist/img/gif/giphy.webp') }}')
                left top
                no-repeat
            `
        });
    }, 10000); // 10000 milliseconds = 10 seconds
});