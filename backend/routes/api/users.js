const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { createError } = require('../../utils/validation')
const { User, Pin, Board, Favorite } = require('../../db/models');
const bqv = require('../../utils/bodyQueryValidators');

const router = express.Router();

// Sign up
router.post('/', bqv.validateSignup, async (req, res) => {
	const { email, password, username, firstName, lastName } = req.body;
	const hashedPassword = bcrypt.hashSync(password);
	const user = await User.create({ email, username, hashedPassword, firstName, lastName });

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
;['Pins','Boards','Favorites'].map(m => router.get(`/@me/${m.toLowerCase()}`, async(rq,rs)=>rs.json(rq.user[`get${m}`]())))

// Get another user's public pins
// Private pins will not be included unless the req.params.userId === sessionUserId
router.get('/:userId/pins', async (req, res, next) => {
	const { userId } = req.params
	const user = await User.findByPk(userId, {
		include: [{
			model: Pin,
			where: req.user?.id != userId && {public: true}
		}]
	})
	if(!user) return next(createError(`User couldn't be found`, 404))
	res.json(user)
})

// Get another user's public boards
// Private boards will not be included unless the req.params.userId === sessionUserId
router.get('/:userId/boards', async (req, res, next) => {
	const { userId } = req.params
	const user = await User.findByPk(userId, {
		include: [{
			model: Board,
			where: req.user?.id != userId && {public: true}
		}]
	})
	if(!user) return next(createError(`User couldn't be found`, 404))
	res.json(user)
})

module.exports = router;