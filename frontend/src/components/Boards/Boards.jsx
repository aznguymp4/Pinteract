import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchBoards, thunkFetchUserBoards } from "../../redux/board";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";
import "./Boards.css";
import BoardCreateForm from "../BoardCreateForm";
import { setEnable, setPlaceholder } from "../../redux/search";
import { filterUserItem } from '../../context/util'

const BoardTile = ({src, title, subtitle, onClick}) => {
	const [loaded, setLoaded] = useState(false)
	return <div className={`boardTile${loaded?' loaded':''}`} onClick={onClick}>
		<div className='boardTileThumb'>
			<img
				src={src}
				onLoad={()=>setTimeout(()=>setLoaded(true),Math.random()*250)}
			/>
		</div>
		<div className='s400 wsemibold boardTileTitle'>{title}</div>
		{subtitle && <div className="s100 c400">{subtitle}</div>}
	</div>
}

const Boards = ({ boardsArg, getUsersBoards, showNew, onTileClick }) => { // Preload Boards instead of fetching from thunk
	const dispatch = useDispatch()
	const { setModalContent } = useModal()
	const boards = useSelector(state => state.board)
	const sessionUser = useSelector(s=>s.session.user)
	const search = useSelector(s=>s.search?.query?.toLowerCase()||'')

	dispatch(setEnable(true))
	dispatch(setPlaceholder('Search Boards...'))

	useEffect(()=>{
		if(!boardsArg) dispatch(getUsersBoards&&sessionUser
			? thunkFetchUserBoards(sessionUser.id)
			: thunkFetchBoards()
		)
	}, [dispatch, boardsArg, getUsersBoards, sessionUser])

	return boards || boardsArg?.length || showNew? <div className="boardGrid">{
		<>
			{showNew && <BoardTile
				src='/blankBoardNew.svg'
				title={<div className='ac'><i className="fas fa-plus-circle" title="Create a new Board"/> New Board</div>}
				onClick={()=>setModalContent(<BoardCreateForm/>)}
			/>}
			{filterUserItem((boardsArg || (boards && Object.values(boards))).sort((a,b)=>b.pinCount-a.pinCount), search).map(b => {
				const tile = <BoardTile
					src={b.coverSrc || '/blankBoard.svg'}
					title={<>{!b?.public && <i className="fas fa-lock" title="This Board is private"/>} {b?.title}</>}
					subtitle={`${b.pinCount} Pin${b.pinCount===1?'':'s'}${b.public?'':'・Private'}`}
					onClick={onTileClick? ()=>onTileClick(b) : null}
				/>
				
				return onTileClick
				? tile
				: <Link key={b.id} to={`/board/${b.id}`}>{tile}</Link>
			})}
		</>
	}</div> : <div className="wsemibold s400 c400 ac"><br/>No Boards found...<br/><br/></div>
}

export default Boards;