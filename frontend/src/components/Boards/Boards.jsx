import { useState } from "react";
// import { useSelector } from "react-redux";
// import { thunkFetchPins } from "../../redux/pin";
// import PinTile from './PinTile'
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";
import "./Boards.css";
import BoardCreateForm from "../BoardCreateForm";

const BoardTile = ({src, title, subtitle, onClick}) => {
	const [loaded, setLoaded] = useState(false)
	return <div className={`boardTile${loaded?' loaded':''}`} onClick={onClick}>
		<div className='boardTileThumb'>
			<img
				src={src}
				onLoad={setTimeout(()=>setLoaded(true),Math.random()*250)}
			/>
		</div>
		<div className='s400 wsemibold boardTileTitle'>{title}</div>
		{subtitle && <div className="s100 c400">{subtitle}</div>}
	</div>
}

const Boards = ({ boardsArg, showNew }) => { // Preload Boards instead of fetching from thunk
	// const dispatch = useDispatch()
	// const nav = useNavigate()
	const { setModalContent } = useModal()
	let boards
	// const boards = useSelector(state => state.boards)
	// useEffect(()=>{
	// 	if(!boardsArg) dispatch(thunkFetchBoards())
	// }, [dispatch, boardsArg])

	// useEffect(()=>{
	// 	const handleResize = () => {
	// 		const x = vwToColumns(window.innerWidth)
	// 		if(x !== columns) setColumns(x)
	// 	}
	// 	window.addEventListener('resize', handleResize);
	// 	return () => window.removeEventListener('resize', handleResize);
	// }, [columns])

	return (boards || boardsArg) && <div className="boardGrid">{
		<>
			{(boardsArg || Object.values(boards)).map(b => 
			// <div className='boardTile' key={b?.id}>
			// 	<div className='boardTileThumb'><img src="/blankBoard.svg"/></div>
			// 	<div className='s400 wsemibold boardTileTitle'>{!b?.public && <i className="fas fa-lock" title="This Board is private"/>} {b?.title}</div>
			// 	<div className="s100 c400">5 Pins</div>
			// </div>
				<Link key={b.id} to={`/board/${b.id}`}>
					<BoardTile
						src={b.coverSrc || '/blankBoard.svg'}
						title={<>{!b?.public && <i className="fas fa-lock" title="This Board is private"/>} {b?.title}</>}
						subtitle={`${b.pinCount} Pin${b.pinCount===1?'':'s'}`}
					/>
				</Link>
			)}
			{showNew && <BoardTile
				src='/blankBoardNew.svg'
				title={<div className='ac'><i className="fas fa-plus-circle" title="Create a new Board"/> New Board</div>}
				onClick={()=>setModalContent(<BoardCreateForm/>)}
			/>}
		</>
	}</div>
}

export default Boards;