const express = require('express')
const router = express.Router()
const UserType = require('../models/UserType')
const PostType = require('../models/PostType')
const User = require('../models/User')
const Spam = require('../models/Spam')


router.put('/user/:id', async (req, res) => {

    if (!req.body) {
        return res.status(400).json({
            message: 'Validataion Error',
            error: 'Parameters Missing'
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
        .sort({ 'createdAt': -1 })
        .select('first_name last_name email phone_number createdAt location')
        .populate('utype', 'utype')
        .then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err)
        })
})

//Migrations
router.get('/migrate/usertype', async (req, res) => {

    utype1 = new UserType({
        utype: 'Admin'
    })

    await utype1.save()

    utype2 = new UserType({
        utype: 'Public'
    })

    await utype2.save()

    res.status(201).json({
        message: "user type Migration Ran"
    })

})

router.get('/migrate/posttype', async (req, res) => {

    ptype = new PostType({
        ptype: 'General'
    })
    await ptype.save();

    ptype1 = new PostType({
        ptype: 'Emergency'
    })
    await ptype1.save();

    ptype2 = new PostType({
        ptype: 'Donation'
    })
    await ptype2.save();

    res.status(201).json({
        message: "post type Migration Ran"
    })

});


// Add Spam words to DB
router.post('/spamit', async (req, res) => {

    const spam = new Spam({
        word: req.body.word
    });
    spam.save().then(saved => {
        return res.status(201).json({
            message: "Spammed"
        })
    }).catch(err => {
        res.status(400).json({
            message: "Data Error",
            error: err
        })
    })

})
module.exports = router