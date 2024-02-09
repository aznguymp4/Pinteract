module.exports = {
  getBoardPinData: (b, userId, delPins=true) => {
    b.pinCount = b.Pins.length
    // Return coverPin src, or first public pin src if not set, or null
    b.coverSrc =
      (b.coverPin && b.Pins.find(p => p.id===b.coverPin)?.img)
    ||(b.Pins.find(p=>p.public || (p.authorId===userId))?.img)
    || null
    if(delPins) delete b.Pins
    return b
  },
  // Unless userId matches that pin
  filterPrivatePin: (b, userId) => {
    b.Pins = b.Pins.filter(p => p.public || (p.authorId===userId))
    return b
  }
}