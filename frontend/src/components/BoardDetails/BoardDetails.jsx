import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { thunkFetch1Board } from '../../redux/board'
import { findDisplayName, findPfpSrc } from '../../redux/user'
import Discovery from '../Discovery'
import './BoardDetails.css'

const BoardDetails = () => {
	const dispatch = useDispatch()
	const { boardId } = useParams()
	const sessionUser = useSelector(s=>s.session.user)
	const board = useSelector(s=>s.board[boardId])

	useEffect(()=>{
		dispatch(thunkFetch1Board(boardId))
	},[dispatch, boardId])

	return <>
		<div id='boardDetails' className='ac'>
			<div id='boardDetailsTitle' className='s600 wsemibold'>{board?.title}</div>
			<div id='boardDetailsUserInfo'>
				<Link to={`/user/${board?.authorId}`}>
					<img id='boardDetailsUserPfp' src={findPfpSrc(board?.Author)}/>
				</Link>
				<Link to={`/user/${board?.authorId}`} className='s300 wsemibold'>{findDisplayName(board?.Author)}</Link>
			</div>
		</div>
		{sessionUser?.id===board?.authorId && <div id='boardAction'>
			<div className='boardActionBtn wsemibold'>Edit</div>
			<div className='boardActionBtn wsemibold'>Delete</div>
		</div>}
		{
			board?.Pins.length
			? <Discovery pinsArg={board.Pins}/>
			: <div className='wsemibold s400 ac'><br/>No Pins Found</div>
		}
	</>
}

export default BoardDetails