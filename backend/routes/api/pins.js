const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { createError } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Pin } = require('../../db/models');
const vrb = require('../../utils/validateReqBody');
const bqv = require('../../utils/bodyQueryValidators');

// Get all Public Pins
router.get('/', async (req,res) => {
  res.json(await Pin.findAll({
    where: {public: true}
  }))
})

// Get Current User's Pins
router.get('/@me', requireAuth, async (req,res) => {
  res.json(await Pin.findAll({
    where: {authorId: req.user.id}
  }))
})

// Get Pin details by ID
// - Anyone can get public Pin details
// - Only author can get private Pin details
router.get('/:pinId', async (req,res,next) => {
  const { pinId } = req.params
  const pin = await Pin.findOne({
    where: {[Op.or]: [
      { id: pinId, public: true },
      { id: pinId, authorId: req.user?.id || 0 }
    ]}
  })
  if(!pin) return next(createError(`Pin couldn't be found`, 404))
  res.json(pin)
})

// Create a Pin
router.post('/', requireAuth, bqv.validatePinCreate, async (req,res) => {
  const { user } = req
  req.body.authorId = user.id
  res.status(201).json(await Pin.create(req.body))
})

// Edit a Pin
router.put('/:pinId', requireAuth, vrb.checkPinExistsAndBelongsToUser, bqv.validatePinUpdate, async (req,res) => {
  const { pin } = req
  await pin.update(req.body)
  res.json(pin)
})

// Delete a Pin
router.delete('/:pinId', requireAuth, vrb.checkPinExistsAndBelongsToUser, async (req,res) => {
  const { pin } = req
  await pin.destroy()
  res.json({message: 'Successfully deleted', success: true})
})

module.exports = router;