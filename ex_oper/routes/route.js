const express = require('express');
const {
    somar,
    subtrair,
    multiplicar,
    dividir,
} = require('../controller/calculadora');

const router = express.Router();

function validateNumbers(req, res, next) {
    const { num1, num2 } = req.body;
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
        return res.status(400).json({
            error: 'num1 e num2 devem ser números',
        });
    }
    next();
}

router.post('/somar', validateNumbers, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ resultado: somar(num1, num2) });
});

router.post('/subtrair', validateNumbers, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ resultado: subtrair(num1, num2) });
});

router.post('/multiplicar', validateNumbers, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ resultado: multiplicar(num1, num2) });
});

router.post('/dividir', validateNumbers, (req, res) => {
    const { num1, num2 } = req.body;
    if (num2 === 0) {
        return res.status(400).json({ error: 'Divisão por zero não é permitida' });
    }
    res.json({ resultado: dividir(num1, num2) });
});

module.exports = router;
