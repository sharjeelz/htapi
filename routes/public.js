const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const config = require('../functions/config')

//get all posts

router.get('/:p(\d+)?', async (req, res) => {

    const resPerPage = config.resPerPage
    const page = req.params.p
    let post_comment = [];
    let data = [];

    Post.find({})
        .select('data message user posttype')
        .sort({ date: -1 })
        .populate('user', 'first_name last_name')
        .populate('posttype', 'ptype')
        .populate({
            path: 'comments',
            select: 'comment date',
            populate: {
                path: 'user',
                select: 'first_name last_name pic',
            }
        })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage)
        .lean()
        .then(posts => {
            res.status(200).json({
                posts: posts

            })
        }).catch(err => {
            res.status(400).json({
                message: "Data Error",
                error: err
            })
        })

})


//find in  all posts

router.get('/find', (req, res) => {
    /** find?q=help */
    regex = new RegExp(escapeRegex(req.query.q), 'gi');
    const resPerPage = config.resPerPage;
    const page = req.params.p
    Post.find({ message: regex })
        .sort({ date: -1 })
        .populate('user', 'first_name last_name')
        .populate('posttype', 'ptype')
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage)
        .then(posts => {
            res.status(200).json({
                message: "Searh Results",
                data: {
                    count: posts.length,
                    posts: posts
                }
            })
        }).catch(err => {
            res.status(400).json({
                message: "Data Error",
                error: err
            })
        })

})

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router