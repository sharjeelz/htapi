const express = require('express')
const router = express.Router()
const UserType = require('../models/UserType')
const User = require('../models/User')


router.put('/user/:id', async (req, res) => {

    if(!req.body){
        return res.status(400).json({
            message: 'Validataion Error',
            error : 'Parameters Missing'
        })
    }
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.prop] = ops.value

    }

    await User.updateOne({ _id: req.params.id }, { $set: updateOps }).then(() => {
        res.status(200).json({ message: `Document ID ${req.params.id} updated` })
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.get('/user/list', async (req, res) => {
    await User
        .find({})
         .sort([['date', -1]])
        .select('first_name last_name email phone_number date location')
        .populate('utype', 'utype')
        .then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err)
        });
});

//Migrations
router.get('/migrate', async (req, res) => {

    utype1 = new UserType({
        utype: 'Admin'
    });

    await utype1.save();

    utype2 = new UserType({
        utype: 'Public'
    });

    await utype2.save()

});

module.exports = router