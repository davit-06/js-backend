const net = require("node:net");

const PORT = Number(process.env.PORT);

const HOST = process.env.HOST;

const users = new Map();

const server = net.createServer((socket) => {

    let username = null;

    let buffer = "";

    socket.on("data", (chunk) => {

        let text = chunk.toString();

        buffer += text;

        let index = buffer.indexOf("\n");

        while (index !== -1) {
            let message = buffer.slice(0, index).trim()

            buffer = buffer.slice(index + 1);

            index = buffer.indexOf("\n");

            if (!username) {
                if (!message) {
                    socket.end("Username cannot be empty.\n")

                    return;
                }

                if (message.includes(" ")) {
                    socket.end("Username cannot contain spaces.\n");

                    return
                }

                if (users.has(message)) {
                    socket.end("Username is already in use.\n");

                    return;
                }

                username = message;

                users.set(username, socket);

                socket.write(`Connected as ${username}.\n`);

                for (let [name, usrSock] of users) {
                    if (usrSock !== socket) {
                        usrSock.write(`${username} joined\n`);
                    }
                }

                continue;
            }

            if (!message) {
                continue;
            }

            if (message.startsWith("/")) {
                let parts = message.split(/\s+/);

                let command = parts[0];

                if (command === "/msg") {
                    let targUsrName = parts[1];

                    let actualMsg = parts.slice(2).join(" ");

                    if (!targUsrName || !actualMsg) {
                        socket.write("Usage: /msg <username> <message>\n");

                        continue;
                    }

                    if (!users.has(targUsrName)) {
                        socket.write(`User "${targUsrName}" is not connected.\n`);

                        continue;
                    }

                    let targetSocket = users.get(targUsrName);

                    targetSocket.write(`[DM from ${username}]: ${actualMsg}\n`);

                    socket.write(`[you -> ${targUsrName}]: ${actualMsg}\n`);
                }

                else if (command === "/who") {
                    let connctedUser = [...users.keys()];

                    socket.write(`Connected users: ${connctedUser.join(", ")}\n`);
                }

                else if (command === "/quit") {
                    socket.end("Goodbye.\n");
                    
                    return;
                }

                else {
                    socket.write(`Unknown command: ${command}\n`);
                }

                continue;
            }

            socket.write(`[you]: ${message}\n`);

            for (let [name, usrSock] of users) {
                if (usrSock !== socket) {
                    usrSock.write(`[${username}]: ${message}\n`);
                }
            }
        }
    })

    socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
    })

    socket.on("close", () => {

        if (username && users.get(username) === socket) {
            users.delete(username);

            for (let [name, usrSock] of users) {
                usrSock.write(`${username} left\n`);
            }
        }
    })
})

server.on("error", (err) => {
    console.error(`Server error: ${err.message}`);
})

server.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
})
