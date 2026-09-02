const net = require("node:net");
require("dotenv").config();

const PORT = Number(process.env.PORT);
const HOST = process.env.HOST;

let players = [];

let board = ["_", "_", "_", "_", "_", "_", "_", "_", "_"];

let symb = "X";

let startGame = false;

let gameOver = false;

const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

let broadcast = (message) => {
    for (let player of players) {
        if (!player.socket.destroyed) {
            player.socket.write(message);
        }
    }
}

let sendBoard = () => {
    broadcast(`BOARD|${board.join(",")}\n`);
}

let checkWinner = () => {
    for (let line of winLines) {
        const [a, b, c] = line;

        if (board[a] !== "_" && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

let resetGame = () => {
    board = ["_", "_", "_", "_", "_", "_", "_", "_", "_"];

    symb = "X";

    startGame = false;

    gameOver = false;
}

let handleMove = (socket, val) => {
    if (!startGame) {
        socket.write("REJECTED|game has not started\n");

        return;
    }

    if (gameOver) {
        socket.write("REJECTED|game is over\n");

        return;
    }

    const player = players.find((player) => {
        return player.socket === socket;
    });

    if (!player) {
        socket.write("REJECTED|unknown player\n");

        return;
    }

    if (player.symbol !== symb) {
        socket.write("REJECTED|not your turn\n");

        return;
    }

    const tNum = Number(val);

    if (!Number.isInteger(tNum) || tNum < 0 || tNum > 8) {
        socket.write("REJECTED|invalid tNum\n");

        return;
    }

    if (board[tNum] !== "_") {
        socket.write("REJECTED|tNum occupied\n");

        return;
    }

    board[tNum] = player.symbol;

    sendBoard();

    const winner = checkWinner();

    if (winner !== null) {
        gameOver = true;

        broadcast(`WIN|${winner}\n`);

        return;
    }

    if (!board.includes("_")) {
        gameOver = true;

        broadcast("DRAW\n");

        return;
    }

    if (symb === "X") {
        symb = "O";
    } 
    
    else {
        symb = "X";
    }

    broadcast(`TURN|${symb}\n`);
}

let handleMsg = (socket, line) => {
    const parts = line.split("|");

    const cmnd = parts[0];
    const val = parts[1];

    if (cmnd === "MOVE" && parts.length === 2) {
        handleMove(socket, val);
        return;
    }

    socket.write("REJECTED|unknown command\n");
}

let handleDisconnect = (socket) => {
    const playerIndex = players.findIndex((player) => {
        return player.socket === socket;
    });

    if (playerIndex === -1) {
        return;
    }

    const wasPlaying = startGame && !gameOver;

    const otherPlayers = players.filter((player) => {
        return player.socket !== socket;
    });

    players = [];

    resetGame();

    for (let player of otherPlayers) {
        if (!player.socket.destroyed) {
            if (wasPlaying) {
                player.socket.write("OPPONENT_LEFT\n");
            }

            player.socket.end();
        }
    }

    console.log("[server] game reset");
}

const server = net.createServer((socket) => {
    if (players.length >= 2) {
        socket.end("server is full\n");

        return;
    }

    const symbol = players.length === 0 ? "X" : "O";

    players.push({
        socket: socket,

        symbol: symbol
    });

    console.log(`[server] player ${players.length} connected`);

    let buffer = "";

    socket.on("data", (chunk) => {
        buffer += chunk.toString();

        let index = buffer.indexOf("\n");

        while (index !== -1) {
            const line = buffer.slice(0, index).trim();

            buffer = buffer.slice(index + 1);

            if (line.length > 0) {
                handleMsg(socket, line);
            }

            index = buffer.indexOf("\n");
        }
    });

    socket.on("close", () => {
        console.log(`[server] ${symbol} disconnected`);
        
        handleDisconnect(socket);
    });

    socket.on("error", (error) => {
        console.log(`[socket error] ${error.message}`);
    });

    if (players.length === 1) {
        console.log("[server] player 1 connected, waiting for opponent");

        return;
    }

    startGame = true;

    players[0].socket.write("SYMBOL|X\n");
    players[1].socket.write("SYMBOL|O\n");

    sendBoard();

    broadcast(`TURN|${symb}\n`);

    console.log("[server] player 2 connected — game starting");
});

server.on("error", (error) => {
    console.log(`[server error] ${error.message}`);
});

server.listen(PORT, HOST, () => {
    console.log(`[server] listening on ${HOST}:${PORT}`);
});