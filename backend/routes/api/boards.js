const express = require('express');
const router = express.Router();
const { createError } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Board, Pin, BoardPin, User } = require('../../db/models');
const vrb = require('../../utils/validateReqBody');
const bqv = require('../../utils/bodyQueryValidators');
const agg = require('../../utils/aggregate');

// Get all Public Boards
router.get('/', async (req,res) => {
	res.json(await Board.findAll({
		where: {public: true}
	}))
})

// Get Board details and associated Pins by Board ID
// - Anyone can get public Boards details
// - Only author can get private Boards details
router.get('/:boardId', vrb.checkBoardExists(true,true,{include:[{model:User,as:'Author'},Pin]}), async (req,res) => {
	res.json(agg.getBoardPinData(req.board.toJSON(), false))
})

// Create a Board
router.post('/', requireAuth, bqv.validateBoardCreate, async (req,res) => {
	delete req.body.coverPin
	res.status(201).json(await Board.create({...req.body, authorId: req.user.id}))
})

// Edit a Board
// - Board must belong to user
router.patch('/:boardId', requireAuth, vrb.checkBoardExists(), bqv.validateBoardUpdate, async (req,res,next) => {
	const { board } = req

	let coverPin = board.coverPin 
	if(req.body.coverPin) { // if client is requesting to change the coverPin, make sure the Pin is associated with the Board first.
		const pin = await BoardPin.findOne({where:{
			pinId: req.body.coverPin,
			boardId: req.board.id
		}})
		if(!pin) return next(createError(`body.coverPin: Pin ${req.body.coverPin} is either not found or not associated with Board ${req.board.id}`, 403))
		coverPin = pin.pinId
	}

	delete req.body.coverPin
	await board.update({...req.body, coverPin})
	res.json(board)
})

// Delete a Board
router.delete('/:boardId', requireAuth, vrb.checkBoardExists(), async (req,res) => {
	await req.board.destroy()
	res.json({message: 'Successfully deleted', success: true})
})

// Add a Pin to a Board
// - Board must be owned by user
// - Pin (if public) can be owned by anyone
// - Pin (if private) must be owned by user
router.put('/:boardId/pins/:pinId', requireAuth, bqv.validateAddPinToBoard, vrb.checkBoardExists(true,false,{include:[Pin]}), vrb.checkPinExists(true,true), async (req,res) => {
	if(await req.board.hasPin(req.pin))
	return res.json({pin: req.pin, board: req.board})

	await req.board.addPin(req.pin)
	res.json({pin: req.pin, board: await Board.findByPk(req.board.id, {include:[Pin]})})
})
// Remove a Pin from Board
// - Board must be owned by user
// - Pin can be owned by anyone, public boolean is ignored
router.delete('/:boardId/pins/:pinId', requireAuth, bqv.validateAddPinToBoard, vrb.checkBoardExists(true,false,{include:[Pin]}), vrb.checkPinExists(false), async (req,res) => {
	if(!await req.board.hasPin(req.pin))
	return res.json({pin: req.pin, board: req.board})

	await req.board.removePin(req.pin)
	res.json({pin: req.pin, board: await Board.findByPk(req.board.id, {include:[Pin]})})
})

module.exports = router;