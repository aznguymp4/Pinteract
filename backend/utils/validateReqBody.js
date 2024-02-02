const { Pin, Board, Comment } = require('../db/models');
const { createError } = require('./validation')
// const { Op } = require("sequelize");
const x = undefined
const frbdn = 'Forbidden'

module.exports = {
	checkPinExists: (ifBelongsToUser=true, ifPublic=false, ifCanComment=false, options) => async (req, res, next) => {
		const pinId = req.params.pinId || req.body.pinId

		req.pin = await Pin.findByPk(pinId, options)
		if(!req.pin) return next(createError(`Pin couldn't be found`, 404))
		const belongsToUser = req.user?.id === req.pin.authorId
		return next((
			(ifBelongsToUser && !ifPublic && !belongsToUser) ||
			(ifPublic && !req.pin.public && !belongsToUser) ||
			(ifCanComment && !req.pin.canComment)
		)? createError(frbdn, 401) : x)
	},
	checkBoardExists: (ifBelongsToUser=true, ifPublic=false, options) => async (req, res, next) => {
		const boardId = req.params.boardId || req.body.boardId

		req.board = await Board.findByPk(boardId, options)
		if(!req.board) return next(createError(`Board couldn't be found`, 404))
		const belongsToUser = req.user?.id === req.board.authorId
		return next((
			(ifBelongsToUser && !ifPublic && !belongsToUser) ||
			(ifPublic && !req.board.public && !belongsToUser)
		)? createError(frbdn, 401) : x)
	},
	checkCommentExists: (ifBelongsToUser=true, ifPinPublic=false, options) => async (req, res, next) => {
		const commentId = req.params.commentId || req.body.commentId
		
		req.comment = await Comment.findByPk(commentId, options)
		if(!req.comment) return next(createError(`Comment couldn't be found`, 404))
		const commentPin = await req.comment.getPin()
		const belongsToUser = req.user?.id === req.comment.authorId
		const pinBelongsToUser = commentPin.authorId === req.user?.id
	return next((
			(ifBelongsToUser && !ifPinPublic && (!belongsToUser && !pinBelongsToUser)) ||
			(ifPinPublic && !(await req.comment.getPin()).public && (!belongsToUser && !pinBelongsToUser))
		)? createError(frbdn, 401) : x)
	}
}