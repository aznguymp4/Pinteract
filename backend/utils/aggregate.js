const findFirstPublicOrOwned = (arr, userId=null) => {
  return arr.filter(p=>p.public || (p.authorId===userId)).sort((a,b)=>b.id-a.id)[0]?.img || null
}

module.exports = {
  getBoardPinData: (b, userId, delPins=true) => {
    b.pinCount = b.Pins.length
    // Return coverPin src, or first public pin src if not set, or null
    b.defaultCoverSrc = findFirstPublicOrOwned(b.Pins, userId)
    b.coverSrc = (b?.coverPin && b?.Pins?.find(p => p.id===b.coverPin)?.img) || b.defaultCoverSrc
    if(delPins) delete b.Pins
    return b
  },
  // Unless userId matches that pin
  filterPrivatePin: (b, userId) => {
    b.Pins = b.Pins.filter(p => p.public || (p.authorId===userId))
    return b
  }
}