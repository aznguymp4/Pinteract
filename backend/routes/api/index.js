const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);

for (const route of ['session','users','pins','boards']) {
	router.use('/'+route, require(`./${route}.js`))
}

module.exports = router;