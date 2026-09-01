const net = require("node:net")

const readline = require("node:readline")

const PORT = Number(process.env.PORT)

const HOST = process.env.HOST

const rl = readline.createInterface({
    input: process.stdin,

    output: process.stdout
})

const socket = net.createConnection({
    host: HOST,
    
    port: PORT
})

socket.on("connect", () => {

    rl.question("Enter a username: ", (username) => {
        socket.write(username.trim() + "\n")
    })
})

rl.on("line", (input) => {

    if (!input.trim()) {
        return
    }

    socket.write(input.trim() + "\n")
})

socket.on("data", (chunk) => {

    let text = chunk.toString()

    process.stdout.write(text)
})

socket.on("error", (err) => {
    console.error(`Connection error: ${err.message}`)
})

socket.on("close", () => {

    rl.close()

    console.log("Disconnected from server.")
})