

const Post = require('../models/Post')
const dError = 'Data Error'
const iP= 'Invalid Post ID'

const checkPost = async (req, res, next) => {
    try {

        const PostExists = await Post.findOne({ _id:req.body.post })
        if (PostExists) {
            
            next()
            
        }
    } catch (err) {
        return res.status(400).json({
            message: dError,
            error: iP
        })
    }
}
module.exports.PostExists = checkPost


