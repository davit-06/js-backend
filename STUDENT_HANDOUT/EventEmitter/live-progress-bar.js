const EventEmitter = require("node:events");

class Loading extends EventEmitter {
    constructor() {
        super();

        this.progress = 0;
    }

    start() {
        const interval = setInterval(() => {
            this.progress += 10;

            this.emit("progress", this.progress);

            if (this.progress === 100) {
                clearInterval(interval);

                this.emit("done");
            }
        }, 500);
    }
}

let load = new Loading();

load.on("progress", (prcnt) => {
    let barSize = 20;

    let filled = prcnt / 100 * barSize;

    let empty = barSize - filled;

    let progressBar =
        "[" +
        "#".repeat(filled) +
        "-".repeat(empty) +
        "] " +
        prcnt +
        "%";

    process.stdout.write("\r" + progressBar);
});

load.on("done", () => {
    process.stdout.write("\nDownload complete!\n");
});

load.start();