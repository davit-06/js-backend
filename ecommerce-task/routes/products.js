const express = require('express');
const { readData, writeData } = require('../utils/fileDB');
const path = require('node:path');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const productsPath = path.join(__dirname, '../data/products.json');

router.get('/', async (req, res) => {
    let products = await readData(productsPath);
    const { category, sort } = req.query;

    if (category) {
        products = products.filter((p) => p.category === category);
    }

    if (sort === 'price') {
        products = products.slice().sort((a, b) => a.price - b.price);
    }

    res.status(200).json(products);
});

router.get('/:id', async (req, res) => {
    const products = await readData(productsPath);
    const product = products.find((p) => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ error: 'product not found' });
    }

    res.status(200).json(product);
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || price == null) {
        return res.status(400).json({ error: 'name and price are required' });
    }

    const products = await readData(productsPath);

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name,
        price,
        category: category || null,
        stock: stock ?? 0,
    };

    products.push(newProduct);
    await writeData(productsPath, products);

    res.status(201).json(newProduct);
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    const products = await readData(productsPath);
    const index = products.findIndex((p) => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'product not found' });
    }

    products[index] = {
        ...products[index],
        ...req.body,
        id: products[index].id
    };

    await writeData(productsPath, products);

    res.status(200).json(products[index]);
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    const products = await readData(productsPath);
    const index = products.findIndex((p) => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'product not found' });
    }

    products.splice(index, 1);
    await writeData(productsPath, products);

    res.status(204).send();
});

module.exports = router;
