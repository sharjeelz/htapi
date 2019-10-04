const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const config = require('../functions/config')

//get all posts

router.get('/:p?', async (req, res) => {

    const resPerPage = config.postresperpage
    const page = req.params.p
    
    Post.find({})
        .select('data message user posttype')
        .sort('-createdAt')
        .populate('user', 'first_name last_name')
        .populate('posttype', 'ptype')
        .populate({
            path: 'comments',
            select: 'comment createdAt',
            //match: { user:'5d92f0d3cf6ef50f2866a07e'},
            options: { sort: { createdAt: -1 } } ,
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
                count: posts.length,
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
    const resPerPage = config.postresperpage;
    const page = req.params.p
    Post.find({ message: regex })
        .sort('-createdAt')
        .populate('user', 'first_name last_name')
        .populate('profile')
        .populate('posttype', 'ptype').populate({
            path: 'comments',
            select: 'comment createdAt',
            //match: { user:'5d92f0d3cf6ef50f2866a07e'},
            options: { sort: { createdAt: -1 } } ,
            populate: {
                path: 'user',
                select: 'first_name last_name pic',
            }
        })
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