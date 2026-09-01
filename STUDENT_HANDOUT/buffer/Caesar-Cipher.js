const fs = require("fs");

let buffer = fs.readFileSync("./buffer/hello.txt");

let sh = 3;

sh = sh % 26;

for (let i = 0; i < buffer.length; i += 1) {
    if (buffer[i] >= 65 && buffer[i] <= 90) {
        buffer[i] = buffer[i] + sh;

        if (buffer[i] > 90) {
            buffer[i] = buffer[i] - 26;
        }

        if (buffer[i] < 65) {
            buffer[i] = buffer[i] + 26;
        }
    } 
    
    if (buffer[i] >= 97 && buffer[i] <= 122) {
        buffer[i] = buffer[i] + sh;

        if (buffer[i] > 122) {
            buffer[i] = buffer[i] - 26;
        }

        if (buffer[i] < 97) {
            buffer[i] = buffer[i] + 26;
        }
    }
}

fs.writeFileSync("./buffer/hello.txt", buffer);