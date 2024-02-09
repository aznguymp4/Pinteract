const { body, param } = require('express-validator');
const { handleValidationErrors } = require('./validation');
// const { Op } = require("sequelize");
const [falsy, nul1] = [{values: 'falsy'}, {values: 'null'}]

module.exports = {
	validateLogin: [
		body('credential')
			.exists({ checkFalsy: true })
			.notEmpty().withMessage('Please provide a valid email or username.'),
		body('password')
			.exists({ checkFalsy: true }).withMessage('Please provide a password.'),
		handleValidationErrors
	],
	validateSignup: [
		body('credential')
			.exists({ checkFalsy: true })
			.isEmail().withMessage('Please provide a valid email.'),
		body('username')
			.exists({ checkFalsy: true })
			.not().isEmail().withMessage('Username cannot be an email.'),
		body('password')
			.exists({ checkFalsy: true })
			.isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
		handleValidationErrors
	],
	validatePinCreate: [
		body('img')
			.exists(falsy).withMessage('body.img is required')
			.isString().withMessage('body.img must be a string')
			.isURL().withMessage('body.img must be a valid URL')
			.isLength({max: 256}).withMessage('body.img must be 256 characters or less'),
		body('title')
			.isString().withMessage('body.title must be a string')
			.default(null)
			.isLength({max: 128}).withMessage('body.title must be 128 characters or less'),
		body('desc')
			.isString().withMessage('body.desc must be a string')
			.default(null)
			.isLength({max: 800}).withMessage('body.desc must be 800 characters or less'),
		body('public')
			.exists(nul1).withMessage('body.public is required')
			.isBoolean().withMessage('body.public must be a boolean'),
		body('canComment')
			.exists(nul1).withMessage('body.canComment is required')
			.isBoolean().withMessage('body.canComment must be a boolean'),
		handleValidationErrors
	],
	validatePinUpdate: [
		body('img')
			.optional(falsy)
			.isString().withMessage('body.img must be a string')
			.isURL().withMessage('body.img must be a valid URL')
			.isLength({max: 256}).withMessage('body.img must be 256 characters or less'),
		body('title')
			.isString().withMessage('body.title must be a string')
			.default(null)
			.isLength({max: 128}).withMessage('body.title must be 128 characters or less'),
		body('desc')
			.isString().withMessage('body.desc must be a string')
			.default(null)
			.isLength({max: 800}).withMessage('body.desc must be 800 characters or less'),
		body('public')
			.optional(nul1)
			.isBoolean().withMessage('body.public must be a boolean'),
		body('canComment')
			.optional(nul1)
			.isBoolean().withMessage('body.canComment must be a boolean'),
		handleValidationErrors
	],
	validateBoardCreate: [
		body('title')
			.exists(falsy).withMessage('body.title is required')
			.isString().withMessage('body.title must be a string')
			.isLength({max: 64}).withMessage('body.title must be 64 characters or less'),
		body('desc')
			.isString().withMessage('body.desc must be a string')
			.default(null)
			.isLength({max: 256}).withMessage('body.desc must be 256 characters or less'),
		body('public')
			.exists(nul1).withMessage('body.public is required')
			.isBoolean().withMessage('body.public must be a boolean'),
		handleValidationErrors
	],
	validateBoardUpdate: [
		body('title')
			.optional(falsy)
			.isString().withMessage('body.title must be a string')
			.isLength({max: 64}).withMessage('body.title must be 64 characters or less'),
		body('desc')
			.optional(falsy)
			.isString().withMessage('body.desc must be a string')
			.isLength({max: 256}).withMessage('body.desc must be 256 characters or less'),
		body('public')
			.optional(nul1)
			.isBoolean().withMessage('body.public must be a boolean'),
		body('coverPin')
			.optional(falsy)
			.isInt({gt:0}).withMessage('body.coverPin must be a positive integer'),
		handleValidationErrors
	],
	validateAddPinToBoard: [
		param('pinId')
			.exists(falsy).withMessage('body.pinId is required')
			.isInt({gt:0}).withMessage('body.pinId must be a positive integer'),
		handleValidationErrors
	],
	validateCommentCreate: [
		body('content')
			.exists(falsy).withMessage('body.content is required')
			.isString().withMessage('body.content must be a string')
			.trim().exists(falsy).withMessage('body.content cannot be an empty')
			.isLength({max: 512}).withMessage('body.content must be 512 characters or less'),
		handleValidationErrors
	]
}