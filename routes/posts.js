const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const PostType = require('../models/PostType');
const { createPostValidation , commentValidation} = require('../models/Validations/Post')
const { userExists } = require('../repositories/userRepo');
const { PostExists, isCommentSpam } = require('../repositories/postRepo');
const Comment = require('../models/Comment')
// create new post
router.post('/', [createPostValidation, userExists], async (req, res) => {

    const post_types = { G: 'General', E: 'Emergency', D: 'Donation' }
    post = new Post({
        message: req.body.message,
        user: req.body.user,
        posttype: await PostType.findOne({ ptype: post_types[req.body.ptype] })

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


// get all posts by a user

router.get('/user/:id', (req, res) => {

    Post.find({ user: req.params.id })
        .select('date message')
        .populate('user', 'first_name last_name')
        .populate('posttype', 'ptype')
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json({
                    message: "All User's Posts retrived Successfully",
                    data: {
                        count: posts.length,
                        posts: posts
                    }
                })
            }
            else {
                res.status(200).json({
                    message: `No Posts Found`
                })
            }
        })

})

// get a post by id

router.get('/:id', (req, res) => {

    Post.find({ _id: req.params.id })
        .populate('user', 'first_name last_name')
        .populate('posttype', 'ptype')
        .then(async post => {
            if (post.length > 0) {

                const post_comments = await Comment.find({ post: req.params.id });
                console.log(post_comments);
                res.status(200).json({
                    message: "Post retrived Successfully",
                    data: {
                        post: post,
                        comments: post_comments
                    }
                })
            }
            else {
                res.status(200).json({
                    message: `No Post Found`
                })
            }
        })
})

// delete a post by id

router.delete('/:id', (req, res) => {

    Post.deleteOne({ _id: req.params.id }).then(data => {

        res.status(200).json({
            message: "Post Deleted"
        })
    }).catch(err => {
        res.status(400).json({
            message: "Data Error",
            error: 'Invalid Post id'
        })
    })
})

// update a post by id

router.put('/:id', async (req, res) => {
    const updateOps = {}

    /**  Request body Sample {  
	"data" : [{"prop":"message","value": "yeppi"}]
    } */
    for (const ops of req.body.data) {
        updateOps[ops.prop] = ops.value

    }
    await Post.updateOne({ _id: req.params.id }, { $set: updateOps })
        .then(post => {
            res.status(200).json({
                message: "Post Updated"
            })
        })
        .catch(err => {
            res.status(400).json({
                message: "Data Error",
                error: 'Invalid Post id'
            })
        })
})

// comment on post

router.post('/comment', [commentValidation,PostExists,userExists,isCommentSpam],(req, res) => {

    new_comment = new Comment({
        comment: req.body.comment,
        user: req.body.user
    })
    new_comment.save().then(comment => {
        Post.findByIdAndUpdate(req.body.post, { $push: { comments: comment } }, { upsert: true }).then(data => {
            res.status(201).json({ message: "Comment Saved" })
        }).catch(err => {
            console.log(err);
        })
    })
})
module.exports = router