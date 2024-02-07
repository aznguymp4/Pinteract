import { Link } from "react-router-dom"

const PinTile = ({ pin }) => {
	return <Link
		to={`/pin/${pin.id}`}
		className="pinTile"
	>
		{/* <div className="pinTileHover">
			{pin.title}
		</div> */}
		<img src={pin.img}/>
	</Link>
}
export default PinTile