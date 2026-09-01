const fs = require("node:fs/promises");

const path = require("node:path");

const oldFile = "./fs/app.log";

const limit = 1000;

const checkLogSize = async (oldFile, limit) => {
    try {
        const stats = await fs.stat(oldFile);

        if (limit >= stats.size) {
            console.log(`${oldFile} is ${stats.size} bytes under the limit, any rotation didn't need`);

            return;
        }

        else if (limit < stats.size) {
            const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");

            const parsed = path.parse(oldFile);

            const archiveFile = path.join(parsed.dir, `${parsed.name}-${timestamp}${parsed.ext}`);

            await fs.rename(oldFile, archiveFile);

            await fs.writeFile(oldFile, "");

            console.log(`Rotated: ${oldFile} -> ${archiveFile}`);
        }
    } 
    
    catch (err) {
        if (err.code === "ENOENT") {
            console.log(`No log file yet at ${oldFile}, nothing to rotate.`);

            return;
        }

        throw err;
    }
}


checkLogSize(oldFile, limit);