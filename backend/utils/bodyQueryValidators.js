const { body, param } = require('express-validator');
const { handleValidationErrors } = require('./validation');
// const { Op } = require("sequelize");
const [falsy, nul1, undef] = [{values: 'falsy'}, {values: 'null'}, {values: 'undefined'}]

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
			.isEmail().withMessage('Please provide a valid email.')
			.isLength({ max: 256 }).withMessage('Email must be 256 characters or less'),
		body('username')
			.exists({ checkFalsy: true })
			.not().isEmail().withMessage('Username cannot be an email.')
			.isLength({ max: 30 }).withMessage('Username must be 30 characters or less'),
		body('password')
			.exists({ checkFalsy: true })
			.isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
		handleValidationErrors
	],
	validateUserUpdate: [
		body('firstName')
			.optional(undef)
			// .isString().withMessage('firstName must be a string')
			.isLength({max: 48}).withMessage('firstName must be 48 characters or less'),
		body('lastName')
			.optional(undef)
			// .isString().withMessage('lastName must be a string')
			.isLength({max: 48}).withMessage('lastName must be 48 characters or less'),
		body('displayName')
			.optional(undef)
			// .isString().withMessage('displayName must be a string')
			.isLength({max: 30}).withMessage('displayName must be 30 characters or less'),
		body('username')
			.optional(falsy)
			.isString().withMessage('username must be a string')
			.isLength({max: 30}).withMessage('username must be 30 characters or less'),
		body('bio')
			.optional(undef)
			// .isString().withMessage('bio must be a string')
			.isLength({max: 512}).withMessage('bio must be 512 characters or less'),
		body('icon')
			.optional(undef)
			// .isString().withMessage('icon must be a string')
			.isURL().withMessage('img must be a valid URL')
			.isLength({max: 256}).withMessage('icon must be 256 characters or less'),
		handleValidationErrors
	],
	validatePinCreate: [
		body('img')
			.exists(falsy).withMessage('img is required')
			.isString().withMessage('img must be a string')
			.isURL().withMessage('img must be a valid URL')
			.isLength({max: 256}).withMessage('img must be 256 characters or less'),
		body('title')
			.isString().withMessage('title must be a string')
			.default(null)
			.isLength({max: 128}).withMessage('title must be 128 characters or less'),
		body('desc')
			.isString().withMessage('desc must be a string')
			.default(null)
			.isLength({max: 800}).withMessage('desc must be 800 characters or less'),
		body('public')
			.exists(nul1).withMessage('public is required')
			.isBoolean().withMessage('public must be a boolean'),
		body('canComment')
			.exists(nul1).withMessage('canComment is required')
			.isBoolean().withMessage('canComment must be a boolean'),
		handleValidationErrors
	],
	validatePinUpdate: [
		body('img')
			.optional(falsy)
			.isString().withMessage('img must be a string')
			.isURL().withMessage('img must be a valid URL')
			.isLength({max: 256}).withMessage('img must be 256 characters or less'),
		body('title')
			.isString().withMessage('title must be a string')
			.default(null)
			.isLength({max: 128}).withMessage('title must be 128 characters or less'),
		body('desc')
			.isString().withMessage('desc must be a string')
			.default(null)
			.isLength({max: 800}).withMessage('desc must be 800 characters or less'),
		body('public')
			.optional(nul1)
			.isBoolean().withMessage('public must be a boolean'),
		body('canComment')
			.optional(nul1)
			.isBoolean().withMessage('canComment must be a boolean'),
		handleValidationErrors
	],
	validateBoardCreate: [
		body('title')
			.exists(falsy).withMessage('title is required')
			.isString().withMessage('title must be a string')
			.isLength({max: 64}).withMessage('title must be 64 characters or less'),
		body('desc')
			.isString().withMessage('desc must be a string')
			.default(null)
			.isLength({max: 256}).withMessage('desc must be 256 characters or less'),
		body('public')
			.exists(nul1).withMessage('public is required')
			.isBoolean().withMessage('public must be a boolean'),
		handleValidationErrors
	],
	validateBoardUpdate: [
		body('title')
			.optional(falsy)
			.isString().withMessage('title must be a string')
			.isLength({max: 64}).withMessage('title must be 64 characters or less'),
		body('desc')
			.optional(falsy)
			.isString().withMessage('desc must be a string')
			.isLength({max: 256}).withMessage('desc must be 256 characters or less'),
		body('public')
			.optional(nul1)
			.isBoolean().withMessage('public must be a boolean'),
		body('coverPin')
			.optional(falsy)
			.isInt({gt:0}).withMessage('coverPin must be a positive integer'),
		handleValidationErrors
	],
	validateAddPinToBoard: [
		param('pinId')
			.exists(falsy).withMessage('pinId is required')
			.isInt({gt:0}).withMessage('pinId must be a positive integer'),
		handleValidationErrors
	],
	validateCommentCreate: [
		body('content')
			.exists(falsy).withMessage('content is required')
			.isString().withMessage('content must be a string')
			.trim().exists(falsy).withMessage('content cannot be an empty')
			.isLength({max: 512}).withMessage('content must be 512 characters or less'),
		handleValidationErrors
	]
}