import Discovery from "../Discovery"
import './PinSelect.css'

const PinSelect = ({ pins, fixWidth, onPinSelect }) => {
  return <div className="pinSelect noScrollBar">
    <div className="pinSelectTitle wbold s400 ac">Choose a Pin</div>
    <Discovery pinsArg={pins} fixWidth={fixWidth} onTileClick={onPinSelect} preventDefault={true}/>
  </div>
}

export default PinSelect