const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const bqv = require('../../utils/bodyQueryValidators');

const router = express.Router();

router.get('/', (req, res) => {
	const { user } = req;
	if (user) {
		const safeUser = {
			id: user.id,
			email: user.email,
			username: user.username,
			displayName: user.displayName,
			firstName: user.firstName,
			lastName: user.lastName,
			icon: user.icon,
			bio: user.bio,
		};
		return res.json({
			user: safeUser
		});
	} else return res.json({ user: null });
});

router.post('/', bqv.validateLogin, async (req, res, next) => {
	const { credential, password } = req.body;

	const user = await User.unscoped().findOne({
		where: {
			[Op.or]: {
				username: credential,
				email: credential
			}
		}
	});

	if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
		const err = new Error('Login failed');
		err.status = 401;
		err.title = 'Login failed';
		err.errors = { credential: 'The provided credentials were invalid.' };
		return next(err);
	}

	const safeUser = {
		id: user.id,
		email: user.email,
		username: user.username,
		displayName: user.displayName,
		firstName: user.firstName,
		lastName: user.lastName,
		icon: user.icon,
		bio: user.bio,
	};

	await setTokenCookie(res, safeUser);

	return res.json({
		user: safeUser
	});
});

router.patch('/', requireAuth, bqv.validateUserUpdate, async (req, res) => {
	const { user, body } = req
	console.log(body)
	const safeBody = {}
	// no email or password changing (yet)
	;['firstName','lastName','displayName','username','bio','icon'].map(k => {if(k in body) safeBody[k] = !isNaN(body[k])? body[k]+'' : body[k]})

	await user.update(safeBody)
	res.json({user})
})

router.delete('/', (_req, res) => {
	res.clearCookie('token');
	return res.json({ message: 'success' });
});


module.exports = router;