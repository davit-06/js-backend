const path = require("node:path");

const fs = require("node:fs");

const names = fs.readdirSync("./path/messy");

let fixName = [];

for (let i = 0; i < names.length; i += 1) {
    if (!names[i]) continue;

    let parsed = path.parse(names[i]);

    let fileName = parsed.name;

    let fileType = parsed.ext;

    fileName = fileName.toLowerCase();

    fileName = fileName.replace(/[^a-zA-Z0-9]+/g, "-");

    fileName = fileName.replace(/^-+|-+$/g, "");

    fileType = fileType.toLowerCase();

    let files = fileName + fileType;

    fixName.push(files);

    let oldPath = path.join("./path/messy", names[i]);

    let newPath = path.join("./path/assembled", files);

    fs.copyFileSync(oldPath, newPath);
}