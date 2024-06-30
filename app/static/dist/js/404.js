document.addEventListener("DOMContentLoaded", function () {
    const customColors = [
        '#556B2F',  // Dark Olive Green
        '#8FBC8F',  // Dark Sea Green
        '#2E8B57',  // Sea Green
        '#3CB371',  // Medium Sea Green
        '#228B22'   // Forest Green
    ];

    function customRandomColor() {
        return customColors[Math.floor(Math.random() * customColors.length)];
    }

    const customWrapper = document.getElementById("custom-tiles");
    const heroSection = document.querySelector('.custom-hero-section');

    let customColumns = 0,
        customRows = 0,
        customToggled = false;

    const customToggle = () => {
        customToggled = !customToggled;
        document.body.classList.toggle("custom-toggled");
    };

    const customHandleOnClick = index => {
        customToggle();
        anime({
            targets: ".custom-tile",
            backgroundColor: customRandomColor(),
            opacity: 0.7,
            delay: anime.stagger(50, {
                grid: [customColumns, customRows],
                from: index
            })
        });
    };

    const customCreateTile = index => {
        const customTile = document.createElement("div");
        customTile.classList.add("custom-tile", "relative", "cursor-pointer");
        customTile.style.width = '50px';  // Ensure square shape
        customTile.style.height = '50px';  // Ensure square shape
        customTile.style.opacity = 0.7;  // Less opacity
        customTile.onclick = e => customHandleOnClick(index);
        return customTile;
    };

    const customCreateTiles = quantity => {
        Array.from(Array(quantity)).map((tile, index) => {
            customWrapper.appendChild(customCreateTile(index));
        });
    };

    const customCreateGrid = () => {
        customWrapper.innerHTML = "";
        const customSize = 50;  // Size for square tiles
        customColumns = Math.floor(document.body.clientWidth / customSize);
        customRows = Math.floor(document.body.clientHeight / customSize);
        customWrapper.style.setProperty("--custom-columns", customColumns);
        customWrapper.style.setProperty("--custom-rows", customRows);
        customCreateTiles(customColumns * customRows);
    };

    const setBackgroundPosition = () => {
        heroSection.style.backgroundPosition = 'center center';
    };

    customCreateGrid();
    setBackgroundPosition();

    window.onresize = () => {
        customCreateGrid();
        setBackgroundPosition();
    };
});
