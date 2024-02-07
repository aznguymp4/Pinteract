const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Pin, Comment, Favorite, User } = require('../../db/models');
const vrb = require('../../utils/validateReqBody');
const bqv = require('../../utils/bodyQueryValidators');

// Get all Public Pins
router.get('/', async (req,res) => {
	res.json(await Pin.findAll({
		where: {public: true}
	}))
})

// Get Pin details by ID
// - Anyone can get public Pin details
// - Only author can get private Pin details
router.get('/:pinId',
vrb.checkPinExists(true,true,false,{include:[
	{model: User, as:'Author'},
	{model: Comment, include: [User]}
]}),
async (req,res) => {
	res.json({
		favoriteCount: await req.pin.countFavorites(),
		commentCount: await req.pin.countComments(),
		...req.pin.toJSON()
	})
})

// Create a Pin
router.post('/', requireAuth, bqv.validatePinCreate, async (req,res) => {
	res.status(201).json(await Pin.create({...req.body, authorId: req.user.id}))
})

// Edit a Pin
// - Pin must belong to user
router.patch('/:pinId', requireAuth, vrb.checkPinExists(), bqv.validatePinUpdate, async (req,res) => {
	const { pin } = req
	await pin.update(req.body)
	res.json(pin)
})

// Delete a Pin
router.delete('/:pinId', requireAuth, vrb.checkPinExists(), async (req,res) => {
	await req.pin.destroy()
	res.json({message: 'Successfully deleted', success: true})
})

// Create a Comment on Pin
// - Pin.canComment must be true to post a comment, regardless of Pin.public
router.post('/:pinId/comments', requireAuth, vrb.checkPinExists(true,true,true), bqv.validateCommentCreate, async (req,res) => {
	const comment = await Comment.create({
		authorId: req.user.id,
		pinId: req.pin.id,
		content: req.body.content.trim()
	})
	res.json(comment)
})

// Toggle Favorite a Pin
// - Anyone can favorite public Pins
// - Only author can favorite private Pins
router.put('/:pinId/favorites', requireAuth, vrb.checkPinExists(true,true), async (req, res) => {
	const where = {
		authorId: req.user.id,
		pinId: req.pin.id
	}
	let favorite = await Favorite.findOne({where})
	if(favorite) {
		await favorite.destroy()
		res.status(200).json({message: 'Successfully unfavorited'})
	} else {
		favorite = await Favorite.create(where)
		res.status(201).json(favorite)
	}
})

module.exports = router;