import Discovery from "../Discovery"
import './PinSelect.css'

const PinSelect = ({ pins, fixWidth, onPinSelect }) => {
  return <div className="pinSelect">
    <h2 className="ac">Choose a Pin</h2>
    <Discovery pinsArg={pins} fixWidth={fixWidth} onTileClick={onPinSelect} preventDefault={true}/>
  </div>
}

export default PinSelect