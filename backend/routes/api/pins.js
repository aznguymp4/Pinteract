const express = require('express');
const router = express.Router();
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

// Get Pin details by ID
// - Anyone can get public Pin details
// - Only author can get private Pin details
router.get('/:pinId', vrb.checkPinExists(true,true), async (req,res) => {
  res.json(req.pin)
})

// Create a Pin
router.post('/', requireAuth, bqv.validatePinCreate, async (req,res) => {
  res.status(201).json(await Pin.create({...req.body, authorId: req.user.id}))
})

// Edit a Pin
router.patch('/:pinId', requireAuth, vrb.checkPinExists(), bqv.validatePinUpdate, async (req,res) => {
  const { pin } = req
  await pin.update(req.body)
  res.json(pin)
})

// Delete a Pin
router.delete('/:pinId', requireAuth, vrb.checkPinExists(), async (req,res) => {
  await req.pin.destroy()
  res.json({message: 'Successfully deleted', success: true})
})

module.exports = router;