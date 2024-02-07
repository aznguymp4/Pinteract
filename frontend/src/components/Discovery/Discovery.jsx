import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchPins } from "../../redux/pin";
import PinTile from './PinTile'
import "./Discovery.css";

// https://www.desmos.com/calculator/jel78zxkxa
const vwToColumns = p => Math.max(1,~~(p*.00390625)) // 0.00390625 = 1/256 because CPUs multiply faster than dividing

function Discovery() {
	const dispatch = useDispatch()
	const [columns, setColumns] = useState(vwToColumns(window.innerWidth))
	const pins = useSelector(state => state.pin)
	useEffect(()=>{
		dispatch(thunkFetchPins())
	}, [dispatch])
	useEffect(()=>{
		const handleResize = () => {
			const x = vwToColumns(window.innerWidth)
			if(x !== columns) setColumns(x)
		}
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
	}, [columns])

	return pins && <div className="pinMasonryGrid">{(()=>{
		const pinz = Object.values(pins)
		const cols = []
		for(let i=0;i<columns;i++){
			const col = <div key={i} className="pinMasonryCol">{(()=>{
				const arr = []
				for(let ii=i;ii<pinz.length;ii+=columns) {
					arr.push(<PinTile key={ii} pin={pinz[ii]}/>)
				}
				return arr
			})()}</div>
			cols.push(col)
		}
		return cols
	})()}</div>
}

export default Discovery;