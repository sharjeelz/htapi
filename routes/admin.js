const express = require('express');
const router = express.Router();
const UserType = require('../models/UserType');
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
        const users= await User.find({_id:'5d8bb9a975b4912698e5988a'}).populate('utype').exec((err, posts) => {
            console.log(err);
            res.send(posts);
          });
        
    } catch (error) {
        
    }
});

//Migrations
router.get('/migrate',async (req,res)=>{

utype1= new UserType({
    utype:'Admin'
});

await utype1.save();

utype2= new UserType({
    utype:'Public'
});

await utype2.save();

});

module.exports = router;