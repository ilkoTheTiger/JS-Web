const router = require('express').Router();
const mongoose = require('mongoose');
const Accessory = require('../models/Accessory');

router.get('/create', (req, res) => {
    res.render('accessory/create');
})

router.post('/create', async (req, res) => {
    const { name, description, imageUrl } = req.body;
    // One way to create the Accessory is:
    // const accessory = new Accessory({ name, description, imageUrl });
    // That's even better
    await Accessory.create({ name, description, imageUrl });

    res.redirect('/');
});

module.exports = router;