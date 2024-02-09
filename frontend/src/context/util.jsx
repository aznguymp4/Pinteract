export const makeErr = (bool, msg) => {
  return bool && <span className="labelErr"><i className="fas fa-exclamation-triangle"/> {msg}</span>
}