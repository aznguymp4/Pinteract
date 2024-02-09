module.exports = {
  getBoardPinData: (b, delPins=true) => {
    b.pinCount = b.Pins.length
    // Return coverPin src, or first-pin src if not set, or null
    b.coverSrc =
      (b.coverPin && b.Pins.find(p => p.id===b.coverPin)?.img)
    ||(b.Pins[0]?.img)
    || null
    if(delPins) delete b.Pins
    return b
  }
}