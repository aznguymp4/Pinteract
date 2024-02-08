const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);

for (const route of ['session','users','pins','boards','comments','cdn']) 
	router.use('/'+route, require(`./${route}.js`))

router.get("/csrf/restore", (req, res) => {
	const csrfToken = req.csrfToken();
	res.cookie("XSRF-TOKEN", csrfToken);
	res.status(200).json({
		'XSRF-Token': csrfToken
	});
});

module.exports = router;