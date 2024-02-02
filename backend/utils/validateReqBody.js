const { Pin, Board } = require('../db/models');
const { createError } = require('./validation')
const { Op } = require("sequelize");
const x = undefined
const frbdn = 'Forbidden'

module.exports = {
  checkPinExists: (ifBelongsToUser=true, ifPublic=false) => async (req, res, next) => {
    const pinId = req.params.pinId || req.body.pinId
    const or = []
    if(ifPublic) or.push({ id: pinId, public: true })
    if(ifBelongsToUser) or.push({ id: pinId, authorId: req.user?.id || 0 })
    
    req.pin = await Pin.findByPk(pinId)
    if(!req.pin) return next(createError(`Pin couldn't be found`, 404))
    const belongsToUser = req.user?.id === req.pin.authorId
    return next((
      (ifBelongsToUser && !ifPublic && !belongsToUser) ||
      (ifPublic && !req.pin.public && !belongsToUser)
    )? createError(frbdn, 401) : x)
  },
  checkBoardExists: (ifBelongsToUser=true, ifPublic=false, includePins=false) => async (req, res, next) => {
    const boardId = req.params.boardId || req.body.boardId
    const or = []
    if(ifPublic) or.push({ id: boardId, public: true })
    if(ifBelongsToUser) or.push({ id: boardId, authorId: req.user?.id || 0 })
    
    req.board = await Board.findByPk(boardId, includePins && {include: [Pin]})
    if(!req.board) return next(createError(`Board couldn't be found`, 404))
    const belongsToUser = req.user?.id === req.board.authorId
    return next((
      (ifBelongsToUser && !ifPublic && !belongsToUser) ||
      (ifPublic && !req.board.public && !belongsToUser)
    )? createError(frbdn, 401) : x)
  },
  // checkBoardExistsIfAny: async (req, res, next) => {
  //   const boardId = req.params.boardId || req.body.boardId
  //   if(!boardId) {
  //     [req.params.boardId, req.body.boardId] = [undefined, undefined]
  //     return next(x)
  //   }
  //   req.board = await Board.findByPk(boardId)
  //   // return next(!req.board? createError(`Board couldn't be found`, 404) : x)

  //   return next(
  //     (user.id!==req.board.authorId)+(req.invertOwn?-1:0)?
  //     createError(frbdn, 401)
  //     : x
  //   )
  // },
  // checkBoardExistsAndBelongsToUser: async (req, res, next) => {
  //   req.board = await Board.findByPk(req.params.boardId)
  //   if(!req.board) return next(createError(`Board couldn't be found`, 404))
    
  //   return next(
  //     (req.user.id!==req.board.authorId)+(req.invertOwn?-1:0)?
  //     createError(frbdn, 401)
  //     : x
  //   )
  // }
}