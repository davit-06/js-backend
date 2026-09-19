const express = require('express');
const { readData, writeData } = require('../utils/fileDB');
const path = require('node:path');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const productsPath = path.join(__dirname, '../data/products.json');
const ordersPath = path.join(__dirname, '../data/orders.json');

router.post('/', authenticate, async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items are required' });
    }

    const products = await readData(productsPath);

    for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
            return res.status(400).json({
                error: `product ${item.productId} not found`
            });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({
                error: `not enough stock for ${product.name}`
            });
        }
    }

    let total = 0;

    const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);

        product.stock -= item.quantity;
        total += product.price * item.quantity;

        return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price
        };
    });

    await writeData(productsPath, products);

    const orders = await readData(ordersPath);

    const newOrder = {
        id: orders.length ? orders[orders.length - 1].id + 1 : 1,
        userId: req.user.id,
        items: orderItems,
        total,
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    await writeData(ordersPath, orders);

    res.status(201).json(newOrder);
});

router.get('/', authenticate, async (req, res) => {
    const orders = await readData(ordersPath);
    const myOrders = orders.filter((o) => o.userId === req.user.id);

    res.status(200).json(myOrders);
});

router.get('/:id', authenticate, async (req, res) => {
    const orders = await readData(ordersPath);
    const order = orders.find((o) => o.id === Number(req.params.id));

    if (!order) {
        return res.status(404).json({ error: 'order not found' });
    }

    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'forbidden' });
    }

    res.status(200).json(order);
});

module.exports = router;