const firePixelsArray = [];
let fireWidth = 200;
let fireHeight = 80;
let debug = false;
let way = 0;
let fireBase = 36;
let pixelSize = 4;
const fireColorsPalette = [
    { "r": 7, "g": 7, "b": 7 },
    { "r": 31, "g": 7, "b": 7 },
    { "r": 47, "g": 15, "b": 7 },
    { "r": 71, "g": 15, "b": 7 },
    { "r": 87, "g": 23, "b": 7 },
    { "r": 103, "g": 31, "b": 7 },
    { "r": 119, "g": 31, "b": 7 },
    { "r": 143, "g": 39, "b": 7 },
    { "r": 159, "g": 47, "b": 7 },
    { "r": 175, "g": 63, "b": 7 },
    { "r": 191, "g": 71, "b": 7 },
    { "r": 199, "g": 71, "b": 7 },
    { "r": 223, "g": 79, "b": 7 },
    { "r": 223, "g": 87, "b": 7 },
    { "r": 223, "g": 87, "b": 7 },
    { "r": 215, "g": 95, "b": 7 },
    { "r": 215, "g": 95, "b": 7 },
    { "r": 215, "g": 103, "b": 15 },
    { "r": 207, "g": 111, "b": 15 },
    { "r": 207, "g": 119, "b": 15 },
    { "r": 207, "g": 127, "b": 15 },
    { "r": 207, "g": 135, "b": 23 },
    { "r": 199, "g": 135, "b": 23 },
    { "r": 199, "g": 143, "b": 23 },
    { "r": 199, "g": 151, "b": 31 },
    { "r": 191, "g": 159, "b": 31 },
    { "r": 191, "g": 159, "b": 31 },
    { "r": 191, "g": 167, "b": 39 },
    { "r": 191, "g": 167, "b": 39 },
    { "r": 191, "g": 175, "b": 47 },
    { "r": 183, "g": 175, "b": 47 },
    { "r": 183, "g": 183, "b": 47 },
    { "r": 183, "g": 183, "b": 55 },
    { "r": 207, "g": 207, "b": 111 },
    { "r": 223, "g": 223, "b": 159 },
    { "r": 239, "g": 239, "b": 199 },
    { "r": 255, "g": 255, "b": 255 }
];
const canvas = document.getElementById('fire-canvas');
const canvasContext = canvas.getContext('2d');
const table = document.getElementById('fire-table');

function start() {
    createFireDataStructure();
    createFireSource();
    calculateCanvasDimension();

    setInterval(calculateFirePropagation, 50);
}

function calculateCanvasDimension() {
    canvas.width = fireWidth * pixelSize;
    canvas.height = fireHeight * pixelSize;
}

function createFireDataStructure() {
    const numberOfPixels = fireWidth * fireHeight;

    for (let i = 0; i < numberOfPixels; i++) {
        firePixelsArray[i] = 0;
    }
}

function calculateFirePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        for (let row = 0; row < fireHeight; row++) {
            const pixelIndex = column + (fireWidth * row);

            updateFireItensityPerPixel(pixelIndex);
        }
    }

    renderFire();
}

function changeWindDirection(value) {
    way = value;
}

function updateFireItensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireWidth;

    // belowPixelIndex overflow canvas
    if (belowPixelIndex >= fireWidth * fireHeight) {
        return;
    }

    const decay = Math.floor(Math.random() * 2); // 3?
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    let newFireIntensity = belowPixelFireIntensity - decay;

    if (newFireIntensity < 0) {
        newFireIntensity = 0;
    }

    switch (way) {
        case 0:
            // wind comes to the left
            firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
            break;

        case 1:
            // no wind (fire set to up)
            firePixelsArray[currentPixelIndex] = newFireIntensity;
            break;

        case 2:
            // wind comes to the right
            firePixelsArray[currentPixelIndex + decay] = newFireIntensity;
            break;
    }
}

function renderFire() {
    let html = '';

    for (let row = 0; row < fireHeight; row++) {
        // for (let row = fireHeight - 1; row >= 0; row--) {
        html += '<tr>';

        for (let column = 0; column < fireWidth; column++) {
            // for (let column = fireWidth - 1; column >= 0; column--) {
            const pixelIndex = column + (fireWidth * row);
            const fireIntensity = firePixelsArray[pixelIndex];
            // const negateColor = (color) => Math.abs(color - 255)
            // const negateColors = ({ r, g, b }) => {
            //     return {
            //         r: negateColor(r),
            //         g: negateColor(g),
            //         b: negateColor(b),
            //     }
            // };
            // const color = negateColors(fireColorsPalette[fireIntensity]);
            const color = fireColorsPalette[fireIntensity];
            const colorString = `${color.r},${color.g},${color.b}`;

            if (debug === true) {
                html += '<td>';
                html += `<div class="pixel-index">${pixelIndex}</div>`;
                html += `<div style="color: rgb(${colorString})">${fireIntensity}</div>`;
                html += '</td>';
            } else {
                // html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
                canvasContext.fillStyle = `rgb(${colorString})`;
                canvasContext.fillRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize);
            }
        }

        html += '</tr>';
    }

    if (debug === true) {
        table.innerHTML = html;
    }
}

function createFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelsArray[pixelIndex] = fireBase;
    }
}

function destroyFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelsArray[pixelIndex] = 0;
    }
}

function increaseFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        const currentFireIntensity = firePixelsArray[pixelIndex];

        if (currentFireIntensity < 36) {
            const increase = Math.floor(Math.random() * 14);
            let newFireIntensity = currentFireIntensity + increase;

            if (newFireIntensity > 36) {
                newFireIntensity = 36;
            }

            firePixelsArray[pixelIndex] = newFireIntensity;
        }
    }
}

function decreaseFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        const currentFireIntensity = firePixelsArray[pixelIndex];

        if (currentFireIntensity > 0) {
            const decay = Math.floor(Math.random() * 14);
            let newFireIntensity = currentFireIntensity - decay;

            if (newFireIntensity < 0) {
                newFireIntensity = 0;
            }

            firePixelsArray[pixelIndex] = newFireIntensity;
        }
    }
}

function toggleDebugMode() {
    if (debug === false) {
        fireWidth *= pixelSize;
        fireHeight *= pixelSize;
        calculateCanvasDimension();
        table.innerHTML = '';
    } else {
        fireWidth /= pixelSize;
        fireHeight /= pixelSize;

        canvas.width = 0;
        canvas.height = 0;
        // calculateCanvasDimension(0, 0);
    }

    debug = !debug;

    createFireDataStructure();
    createFireSource();
}

function changeFireBase(value) {
    fireBase = value;

    createFireDataStructure();
    createFireSource();
}

function changePixelSize(value) {
    pixelSize = value;

    createFireDataStructure();
    createFireSource();
    calculateCanvasDimension();
}

function changeFireWidth(value) {
    fireWidth = value * pixelSize;

    createFireDataStructure();
    createFireSource();
    calculateCanvasDimension();
}

function changeFireHeight(value) {
    fireHeight = value * pixelSize;

    createFireDataStructure();
    createFireSource();
    calculateCanvasDimension();
}

start();
