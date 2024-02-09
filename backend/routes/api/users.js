const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { createError } = require('../../utils/validation')
const { User, Pin, Board, Favorite } = require('../../db/models');
const { Op } = require('sequelize')
const bqv = require('../../utils/bodyQueryValidators');
const agg = require('../../utils/aggregate')

const router = express.Router();

// Sign up
router.post('/', bqv.validateSignup, async (req, res) => {
	const { credential, email, password, username, firstName, lastName } = req.body;
	const hashedPassword = bcrypt.hashSync(password);
	const user = await User.create({ email: email||credential, username, hashedPassword, firstName, lastName });

	const safeUser = {
		id: user.id,
		email: user.email,
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName
	};

	await setTokenCookie(res, safeUser);

	return res.json({
		user: safeUser
	});
});

// Get current user's Pins, Boards, or Favorites (open img for explanation)
// https://pbs.twimg.com/media/GFXYonAWcAAnOQp?format=jpg
// ;['Pins','Boards','Favorites'].map(m => router.get(`/@me/${m.toLowerCase()}`, async(rq,rs)=>rs.json(await rq.user[`get${m}`]())))

// Get current user's Favorites
router.get('/@me/favorites', requireAuth, async (req, res) => res.json(await req.user.getFavorites()))

// Get a certain user's profile info
// Can use query.include to include Pins or Boards ['include=pins','include=boards','include=both']
// Private items will not be included unless the req.params.userId === sessionUserId
router.get('/:userId', async(req,res,next) => {
	const { userId } = req.params
	const where = {[Op.or]: [
		{authorId: req.user?.id || 0},
		{public: true}
	]}
	const include = []
	const [getPin,getBoard] = [['pins','both'].includes(req.query.include), ['boards','both'].includes(req.query.include)]

	if(getPin) include.push({model: Pin, where})
	if(getBoard) include.push({
		model: Board,
		where,
		include: [{model: Pin, attributes: ['id','authorId','public','img']}],
	})

	let user = await User.findByPk(userId, {include})
	if(!user) return next(createError(`User couldn't be found`, 404))
	user = user.toJSON()

	if(getBoard) {
		user.Boards = user.Boards.map(b => agg.getBoardPinData(b, req.user?.id||0))
	}

	res.json(user)
})

module.exports = router;