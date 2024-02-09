import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { thunkFetch1Board, thunkDeleteBoard } from '../../redux/board'
import { findDisplayName, findPfpSrc } from '../../redux/user'
import Discovery from '../Discovery'
import { useModal } from "../../context/Modal";
import modalTemplates from '../../context/ModalTemplates'
import './BoardDetails.css'

const BoardDetails = () => {
	const dispatch = useDispatch()
	const nav = useNavigate()
	const { boardId } = useParams()
	const sessionUser = useSelector(s=>s.session.user)
	const board = useSelector(s=>s.board[boardId])
	const { setModalContent, closeModal } = useModal()
	const [deleting, setDeleting] = useState(false)
	
	useEffect(()=>{
		dispatch(thunkFetch1Board(boardId, nav))
	},[dispatch, boardId, nav])

	const deleteBoard = e => {
		if(deleting) return
		setDeleting(true)
		e.target.innerHTML = '<i class="fas fa-cog fa-spin"></i> Deleting...'
		e.target.classList.add('disabled')
		dispatch(thunkDeleteBoard(boardId))
	}

	useEffect(()=>{
		if(!deleting || board) return
		nav(`/user/${sessionUser?.id}` || '/')
		closeModal()
	}, [deleting, board, nav, closeModal, sessionUser])

	return <>
		<Link id="backBtn" to={-1}>
			<i className="fas fa-arrow-left fa-xl"/>
		</Link>
		<div id='boardDetails' className='ac'>
			<div id='boardDetailsTitle' className='s600 wsemibold'>{board?.title || 'Loading...'}</div>
			<div id='boardDetailsDesc'>{board? board.desc || 'No Description' : 'Loading...'}</div>
			<div id='boardDetailsUserInfo'>
				<Link to={`/user/${board?.authorId}`}>
					<img id='boardDetailsUserPfp' src={findPfpSrc(board?.Author)}/>
				</Link>
				<Link to={`/user/${board?.authorId}`} className='s300 wsemibold'>{findDisplayName(board?.Author)}</Link>
			</div>
		</div>
		{sessionUser?.id===board?.authorId && <div id='boardAction'>
			<div className='btn'>Edit</div>
			<div className='btn' onClick={()=>setModalContent(<modalTemplates.ConfirmModal
				title='Delete Board'
				sub1='Are you sure you want to delete this Board?'
				confirmTxt='Delete'
				onCancel={closeModal}
				onConfirm={deleteBoard}
			/>)}
			>Delete</div>
		</div>}
		{
			board?.Pins?.length
			? <Discovery pinsArg={board.Pins}/>
			: <div className='wsemibold s400 c400 ac'><br/>No {board?.authorId === sessionUser?.id?'':'Public'} Pins Found</div>
		}
	</>
}

export default BoardDetails