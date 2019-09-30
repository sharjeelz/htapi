const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// Create new post
router.post('/', async (req, res) => {

    post = new Post({
        message: req.body.message,
        user: req.body.user
    })

    await post.save().then(post => {

        res.status(201).json({
            message: "Post Created Successfuly",
            data: {
                post: post
            }
        })
    }).catch(err => {
        res.status(400).json({
            message: "Data Error",
            data: err
        })
    })

})


// Get all posts by User

router.get('/user/:id', (req, res) => {

    Post.find({ user: req.params.id })
        .select('date message')
        .populate('user','first_name last_name')
        .then(posts => {
            if(posts.length > 0){ 
            res.status(200).json({
                message: "All User's Posts retrived Successfully",
                data: {
                    count: posts.length,
                    posts: posts
                }
            }) }
            else {
                res.status(200).json({
                    message : `No Posts Found`
                })
            }
        })
        
})

// Get post by post id

router.get('/:id', (req, res) => {

    Post.find({ _id: req.params.id }).then(posts => {

        res.status(200).json({
            message: "Post retrived Successfully",
            data: {
                posts: posts
            }
        })
    })
})

module.exports = router