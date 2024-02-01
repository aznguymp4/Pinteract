const { Pin } = require('../db/models');
const { createError } = require('./validation')
const x = undefined
const frbdn = 'Forbidden'

module.exports = {
  checkPinExistsAndBelongsToUser: async (req, res, next) => {
    const { user } = req
    req.pin = await Pin.findByPk(req.params.pinId)
    if(!req.pin) return next(createError(`Pin couldn't be found`, 404))
    
    return next(
      (user.id!==req.pin.authorId)+(req.invertOwn?-1:0)?
      createError(frbdn, 401)
      : x
    )
  }
}