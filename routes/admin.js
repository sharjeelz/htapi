const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/user/status', async (req, res) => {

    try {
    await User.updateOne({ _id: req.body.id }, { status: req.body.status });
    res.status(200).json({message:`Document ID ${req.body.id} updated`});
    } catch (error) {
        console.log(error.message);
        res.status(400).send('Something Went Wrong!');
    }
});

module.exports = router;