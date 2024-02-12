import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchPins } from "../../redux/pin";
import { setEnable, setPlaceholder } from "../../redux/search";
import PinTile from './PinTile'
import "./Discovery.css";
import { filterUserItem } from '../../context/util'

// https://www.desmos.com/calculator/jel78zxkxa
const vwToColumns = p => Math.max(1,~~(p*.00390625)) // 0.00390625 = 1/256 because CPUs multiply faster than dividing

const Discovery = ({ pinsArg, editing }) => { // Preload Pins instead of fetching from thunk
	const dispatch = useDispatch()
	const [columns, setColumns] = useState(vwToColumns(window.innerWidth))
	const search = useSelector(s=>s.search?.query?.toLowerCase()||'')
	const pins = useSelector(s=>s.pin)

	useEffect(()=>{
		if(!pinsArg) dispatch(thunkFetchPins())
	}, [dispatch, pinsArg])

	useEffect(()=>{
		const handleResize = () => {
			const x = vwToColumns(window.innerWidth)
			if(x !== columns) setColumns(x)
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [columns])

	dispatch(setEnable(true))
	dispatch(setPlaceholder('Search Pins...'))

	return (pins || pinsArg) && <div className="pinMasonryGrid">{(()=>{
		let pinz = filterUserItem((pinsArg || Object.values(pins)).sort((a,b)=>b.id-a.id), search) //.sort(()=>Math.random()-.5)
		if(!pinz.length) return <div className='wsemibold s400 ac c400'><br/>No Pins found...</div>
		const cols = []
		for(let i=0;i<columns;i++){
			const col = <div key={i} className="pinMasonryCol">{(()=>{
				const arr = []
				for(let ii=i;ii<pinz.length;ii+=columns) {
					arr.push(<PinTile key={ii} pin={pinz[ii]} deleting={editing}/>)
				}
				return arr
			})()}</div>
			cols.push(col)
		}
		return cols
	})()}</div>
}

export default Discovery;