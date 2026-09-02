const net = require("node:net");
const readline = require("node:readline");

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "172.30.24.120";

let mySymb = null;

let isMyTurn = false;

let buffer = "";

const rl = readline.createInterface({
    input: process.stdin,

    output: process.stdout
});

const socket = net.connect(PORT, HOST, () => {
    console.log(`[client] connected to ${HOST}:${PORT}`);
});

let printBoard = (val) => {
    const board = val.split(",");

    if (board.length !== 9) {
        console.log("Invalid board received");

        return;
    }

    const disply = board.map((tNum) => {
        if (tNum === "_") {
            return ".";
        }

        return tNum;
    });

    console.log("");

    console.log(`${disply[0]} | ${disply[1]} | ${disply[2]}`);

    console.log("---------");

    console.log(`${disply[3]} | ${disply[4]} | ${disply[5]}`);

    console.log("---------");

    console.log(`${disply[6]} | ${disply[7]} | ${disply[8]}`);

    console.log("");
}

let mayMove = () => {
    rl.question("Enter a tNum (0-8): ", (answer) => {
        const tNum = Number(answer);

        if (!Number.isInteger(tNum) || tNum < 0 || tNum > 8) {
            console.log("Please enter a number from 0 to 8");

            mayMove();

            return;
        }

        socket.write(`MOVE|${tNum}\n`);
    });
}

let handleMsg = (line) => {
    if (line === "server is full") {
        console.log("Server is full");

        return;
    }

    const parts = line.split("|");

    const cmnd = parts[0];

    const val = parts[1];

    if (cmnd === "SYMBOL") {
        mySymb = val;

        console.log(`You are ${mySymb}`);

        return;
    }

    if (cmnd === "BOARD") {
        console.log("Board:");

        printBoard(val);

        return;
    }

    if (cmnd === "TURN") {
        if (val === mySymb) {
            isMyTurn = true;

            console.log("Your turn");

            mayMove();
        } 
        
        else {
            isMyTurn = false;
            
            console.log("Waiting for opponent...");
        }

        return;
    }

    if (cmnd === "REJECTED") {
        console.log(`Move rejected: ${val}`);

        if (isMyTurn) {
            mayMove();
        }

        return;
    }

    if (cmnd === "WIN") {
        isMyTurn = false;

        if (val === mySymb) {
            console.log("You won!");
        } 
        
        else {
            console.log(`${val} won. You lost.`);
        }

        return;
    }

    if (cmnd === "DRAW") {
        isMyTurn = false;

        console.log("Draw");
        
        return;
    }

    if (cmnd === "OPPONENT_LEFT") {
        isMyTurn = false;

        console.log("Opponent disconnected");

        return;
    }

    console.log(line);
}

socket.on("data", (chunk) => {
    buffer += chunk.toString();

    let idx = buffer.indexOf("\n");

    while (idx !== -1) {
        const line = buffer.slice(0, idx).trim();

        buffer = buffer.slice(idx + 1);

        if (line.length > 0) {
            handleMsg(line);
        }

        idx = buffer.indexOf("\n");
    }
});

socket.on("close", () => {
    console.log("[client] connection closed");

    rl.close();
});

socket.on("error", (error) => {
    console.log(`[client error] ${error.message}`);
});