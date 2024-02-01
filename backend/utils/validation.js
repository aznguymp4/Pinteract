const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
	const validationErrors = validationResult(req);
	console.log(req.query)

	if (!validationErrors.isEmpty()) { 
		const errors = {};
		validationErrors
			.array()
			.forEach(error => errors[error.path] = error.msg);

		const err = Error("Bad request.");
		err.errors = errors;
		err.status = 400;
		err.title = "Bad request.";
		next(err);
	}
	next();
};

const createError = (message, status, detailed) => {
	const err = new Error(message)
	err.status = status
	if(!detailed) {
		delete err.stack
		return err
	}
	err.title = message
	err.errors = { message }
	return err
}

module.exports = {
	handleValidationErrors,
	createError
};