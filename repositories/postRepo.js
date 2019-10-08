

const Post = require('../models/Post')
const dError = 'Data Error'
const iP = 'Invalid Post ID'
const Spam = require('../models/Spam')
const myLogger = require('../functions/logger')
const checkPost = async (req, res, next) => {
    try {

        const PostExists = await Post.findOne({ _id: req.body.post })
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

const isSpam = async (req, res, next) => {

    Spam.find({}).lean().select('-_id word').then(data => {

        const result = data.map(a => a.word)
        const replace = result.join('|')
        const new_expression = new RegExp(replace, "g")
        const spam_words = req.body.comment.match(new_expression)
        if (spam_words === null) {
            next()
        }
        else {
            return myLogger.SpamLogger(req, res, next, spam_words)

        }
    }).catch(err => {
        res.json(err)
    })
}
module.exports.PostExists = checkPost
module.exports.isCommentSpam = isSpam


