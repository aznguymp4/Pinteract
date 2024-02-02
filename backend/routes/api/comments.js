const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Pin, Comment } = require('../../db/models');
const vrb = require('../../utils/validateReqBody');
const bqv = require('../../utils/bodyQueryValidators');

// Get a Comment
// - will only return if associated Pin is public or Pin/Comment is owned by the user
router.get('/:commentId', vrb.checkCommentExists(true, true, {include: [Pin]}), async (req, res) => {
	res.json(req.comment)
})

// Edit a Comment
// - Comment must belong to user
router.patch('/:commentId', requireAuth, vrb.checkCommentExists(), bqv.validateCommentCreate, async (req,res) => {
	const { comment } = req
	await comment.update(req.body)
	res.json(comment)
})

// Delete a Comment
router.delete('/:commentId', requireAuth, vrb.checkCommentExists(), async (req, res) => {
	await req.comment.destroy()
	res.json({message: 'Successfully deleted', success: true})
})

module.exports = router;