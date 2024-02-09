import { useState } from "react"
import { Link } from "react-router-dom"

const PinTile = ({ pin }) => {
	const [loaded, setLoaded] = useState(false)
	return <Link
		to={`/pin/${pin.id}`}
		className={`pinTile${loaded?' loaded':''}`}
	>
		{/* <div className="pinTileHover">
			{pin.title}
		</div> */}
		<img
			loading="lazy"
			src={pin.img}
			onLoad={()=>setTimeout(()=>setLoaded(true), Math.random()*250)}
		/>
	</Link>
}
export default PinTile