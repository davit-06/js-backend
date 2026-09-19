require("dotenv").config();

const express = require("express");

const authRouter = require("./routes/auth");

const productsRouter = require("./routes/products");

const ordersRouter = require("./routes/orders");

const app = express();

const HOST = process.env.HOST || "localhost";

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/auth", authRouter);

app.use("/products", productsRouter);

app.use("/orders", ordersRouter);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
