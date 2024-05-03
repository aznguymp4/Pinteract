import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchPins } from "../../redux/pin";
import { setEnable, setPlaceholder } from "../../redux/search";
import { Link } from "react-router-dom";
import PinTile from './PinTile'
import "./Discovery.css";
import { filterUserItem } from '../../context/util'


const Discovery = ({ pinsArg, editing, showNew, fixWidth, onTileClick, preventDefault }) => { // Preload Pins instead of fetching from thunk
	// https://www.desmos.com/calculator/jel78zxkxa
	const vwToColumns = p => fixWidth || Math.max(1,~~(p*.00390625)) // 0.00390625 = 1/256 because CPUs multiply faster than dividing
	
	const dispatch = useDispatch()
	const [columns, setColumns] = useState(vwToColumns(window.innerWidth))
	const search = useSelector(s=>s.search?.query?.toLowerCase()||'')
	const pins = useSelector(s=>s.pin)
	const loading = <div className="wsemibold s400 c400 ac"><br/>Loading Pins...<br/><br/></div>
	const blank = <div className="wsemibold s400 c400 ac"><br/>No Pins found...<br/><br/></div>

	useEffect(()=>{
		if(!pinsArg) dispatch(thunkFetchPins())
	}, [dispatch, pinsArg])

	useEffect(()=>{
		if(fixWidth) return;
		const handleResize = () => {
			const x = vwToColumns(window.innerWidth)
			if(x !== columns) setColumns(x)
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [fixWidth, columns])

	if(pinsArg && !pinsArg.length && !showNew) return blank

	dispatch(setEnable(true))
	dispatch(setPlaceholder('Search Pins...'))

	return (pins || pinsArg) && <div className="pinMasonryGrid">{(()=>{
		let pinz = filterUserItem((pinsArg || Object.values(pins)).sort((a,b)=>b.id-a.id), search) //.sort(()=>Math.random()-.5)
		if(!pinz.length && !showNew) return loading
		const cols = []
		for(let i=0;i<columns;i++){
			const col = <div key={i} className="pinMasonryCol">{(()=>{
				const arr = []
				if(showNew && i===0) arr.push(<Link to='/create' className="pinTile loaded" style={{border:'3px #00000040 dashed'}}>
					<img src="/blankPinNew.svg"/>
				</Link>)
				
				for(let ii=i;ii<pinz.length;ii+=columns) {
					arr.push(<PinTile key={ii} pin={pinz[ii]} deleting={editing} onClick={onTileClick} preventDefault={preventDefault}/>)
				}
				return arr
			})()}</div>
			cols.push(col)
		}
		return cols
	})()}</div>
}

export default Discovery;