const path = require('path');
const fs = require('fs');

// Make recursive directories
function mkdirRecursive(filePath) {
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir)) return true;
    mkdirRecursive(dir);
    fs.mkdirSync(dir);
}

module.exports = { mkdirRecursive };