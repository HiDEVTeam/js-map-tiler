const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const { mkdirRecursive } = require('./tools');

let sourcePath = '';
let destinationPath = './out/{{z}}-{{x}}_{{y}}.png';
let maxZoomIndex = 3;
let tileSize = 512;

// Create tiles of an image based on parameters
function tileImage(_sourcePath, _destinationPath = destinationPath, _maxZoomIndex = maxZoomIndex, _tileSize = tileSize) {
    return new Promise((resolve, reject) => {
        sourcePath = _sourcePath;
        destinationPath = _destinationPath;
        maxZoomIndex = _maxZoomIndex;
        tileSize = _tileSize;
        const cutPartPromises = [];

        loadImage(sourcePath).then((image) => {
            let zoomSize = 1;
            let zoomIndex = 0;
            let imageSize = Math.max(image.height, image.width);
            let imageStep = imageSize;
            for (let z = 0; z <= maxZoomIndex; z++) {
                let cutSize = image.height / zoomSize;
                for (let i = 0; i < image.height; i += cutSize) {
                    for (let j = 0; j < image.width; j += cutSize) {
                        cutPartPromises.push(cutPart(image, cutSize, { x: i, y: j, z: zoomIndex }, reject));
                    }
                }
                zoomIndex++;
                zoomSize = 2 ** zoomIndex;
            }
        });

        Promise.all(cutPartPromises).then(resolve);
    });
}

// Write a tile image
function cutPart(image, size, offset, reject) {
    return new Promise((resolvePart, rejectPart) => {
        // Init canvas
        const canv = createCanvas(tileSize, tileSize);
        const ctx = canv.getContext('2d');

        ctx.drawImage(image, offset.x, offset.y, size, size, 0, 0, tileSize, tileSize);

        // Get Base64 data
        const dataCtx = canv.toDataURL().replace(/^data:image\/\w+;base64,/, '');

        // Write image buffer
        const encoding = 'base64';
        const bufSize = Buffer.byteLength(dataCtx, encoding);
        const buf = Buffer.alloc(bufSize);
        buf.write(dataCtx, encoding);

        // Init filename vars
        const z = offset.z;
        const x = Math.floor(offset.x / size);
        const y = Math.floor(offset.y / size);

        const outString = destinationPath.replace('{{z}}', z).replace('{{x}}', x).replace('{{y}}', y);

        mkdirRecursive(outString);
        fs.writeFile(outString, buf, (err) => {
            if (err) {
                reject(`Could not save file ${outString}:\n> ${err}`);
            }
        });
    });
}

module.exports = tileImage;