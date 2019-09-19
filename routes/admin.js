const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/user/status', async (req, res) => {
    try {
    await User.updateOne({ _id: req.body.id }, { status: req.body.status });
    res.status(200).json({message:`Document ID ${req.body.id} updated`});
    } catch (error) {
        console.log(error);
        res.status(400).send('Something Went Wrong!');
    }
});

router.get('/user/list',async(req,res)=>{

    try {
        const users= await User.find({});
        res.send(users);
    } catch (error) {
        
    }
})
module.exports = router;