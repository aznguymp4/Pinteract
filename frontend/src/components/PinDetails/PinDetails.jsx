import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { thunkFetch1Pin, thunkDeletePin } from "../../redux/pin"
import { thunkAddPin2Board } from "../../redux/board"
import { thunkFetchPinComments, thunkCreateComment, thunkDeleteComment, thunkEditComment } from "../../redux/comment"
import { findDisplayName, findPfpSrc } from "../../redux/user"
import { useModal } from "../../context/Modal";
import { setEnable } from "../../redux/search";
import { ConfirmModal, TextInputModal } from '../../context/ModalTemplates'
import DropdownPickerForm from "../DropdownPickerForm"
import Boards from '../Boards'
import './PinDetails.css'

const PinDetails = () => {
	const dispatch = useDispatch()
	const nav = useNavigate()
	const { setModalContent, closeModal } = useModal()
	const { pinId } = useParams()
	const pin = useSelector(s=>s.pin[pinId])
	const comments = useSelector(s=>s.comment)
	const sessionUser = useSelector(s=>s.session.user)
	const [deleting, setDeleting] = useState(false)
	const [comment, setComment] = useState('')
	const [commenting, setCommenting] = useState(false)

	dispatch(setEnable(false))

	useEffect(()=>{
		dispatch(thunkFetch1Pin(pinId, nav));
		dispatch(thunkFetchPinComments(pinId));
	}, [pinId, dispatch, nav])

	const deletePin = e => {
		if(deleting) return
		setDeleting(true)
		e.target.innerHTML = '<i class="fas fa-cog fa-spin"></i> Deleting...'
		e.target.classList.add('disabled')
		dispatch(thunkDeletePin(pinId))
	}
	const addToBoard = board => {
		if(!board?.id || !pin?.id) return
		document.getElementById('modalTitle').innerHTML = '<i class="fas fa-cog fa-spin c400"></i> Adding to Board...'
		dispatch(thunkAddPin2Board(board.id, pin.id, () => 
			setModalContent(<ConfirmModal
				title='Pin Added'
				sub1={<><b>{pin?.title || 'Pin'}</b> was successfully added to <b>{board?.title || 'Board'}</b></>}
				cancelTxt='Go to Board'
				confirmTxt='Close'
				onCancel={()=>{nav(`/board/${board.id}`);closeModal()}}
				onConfirm={closeModal}
			/>)
		))
	}
	const addComment = () => {
		if(commenting) return
		setCommenting(true)
		dispatch(thunkCreateComment(pinId, comment, ()=>{
			setComment('')
			setCommenting(false)
		}))
	}
	const editComment = (cId, content, e) => {
		if(commenting) return
		setCommenting(true)

		e.target.classList.add('disabled')
		e.target.innerHTML = '<i class="fas fa-cog fa-spin"></i> Saving...'
		dispatch(thunkEditComment(cId, content, () => {
			closeModal()
			setCommenting(false)
		}))
	}
	const deleteComment = (cId) => {
		closeModal()
		dispatch(thunkDeleteComment(cId))
	}

	useEffect(()=>{
		if(!deleting || pin) return
		nav(`/user/${sessionUser?.id}?v=pin` || '/')
		closeModal()
	}, [deleting, pin, closeModal, nav, sessionUser])

	return <>
		<Link id="backBtn" to={-1}>
			<i className="fas fa-arrow-left fa-xl"/>
		</Link>
		<div id="pinDetails">
			<div id="pinDetailsL">
				<img id="pinDetailsLImg" src={pin?.img}/>
			</div>
			<div id="pinDetailsR">
				<div id="pinDetailsRTitle" className="s500 wsemibold">
					<div id="pinDetailsRTitleTxt">{pin? pin.title || 'Unnamed Pin' : 'Loading...'}</div>
					<div id="pinDetailsRBtns">
						{sessionUser?.id === pin?.authorId && <>
							<i
								className="fas fa-trash-alt fa-xs" 
								onClick={()=>setModalContent(<ConfirmModal
									title='Delete Pin'
									sub1='Are you sure you want to delete this Pin?'
									sub2="It will also be inaccessible for those who've saved it."
									confirmTxt='Delete'
									onCancel={closeModal}
									onConfirm={deletePin}
								/>)}
							/>
							<i onClick={()=>nav(`/pin/${pinId}/edit`)} className="fas fa-edit fa-xs"/>
						</>}
						<i className="fas fa-bookmark fa-xs" onClick={()=>setModalContent(<DropdownPickerForm
							title='Add to Board'
							body={<Boards
								getUsersBoards={true}
								onTileClick={addToBoard}
							/>}
							
						/>)}/>
					</div>
				</div>
				<div id="pinDetailsRDesc">{pin? pin.desc || 'No Description' : 'Loading...'}</div>
				<div id="pinDetailsRAuthor">
					<div><img src={findPfpSrc(pin?.Author)}/></div>
					<div className="s200">
						<div className="wsemibold">{findDisplayName(pin?.Author)}</div>
						<div className="c400">Pin Post Date: {formatTime(pin?.createdAt)}</div>
					</div>
				</div>
				<div id="comments">{pin?.canComment?
					<>
						<div id="commentCount" className="wsemibold">Comments・{Object.keys(comments)?.length || 0}</div>
						<div id="commentsList">{
							Object.keys(comments).length? Object.values(comments).sort((a,b)=>b.id-a.id).map(c => <div key={c.id} className="comment">
								<Link className="commentL" to={`/user/${c.authorId}`}>
									<img className="commentIcon" src={findPfpSrc(c.User)}/>
								</Link>
								<div className="commentR">
									<Link className="wsemibold commentRName" to={`/user/${c.authorId}`}>{findDisplayName(c.User)}</Link>
									<span>{c.content}</span>
									<div className="commentRFooter c400">
										<span className="s100 si" title={`Commented: ${formatTime(c.createdAt,'full')}${c.createdAt===c.updatedAt?'':`\n\nEdited: ${formatTime(c.updatedAt,'full')}`}`}>
											{formatTime(c.createdAt)} {c.createdAt===c.updatedAt?'':'(edited)'}
										</span>
										{c.authorId === sessionUser?.id && <div className="commentRFooterBtns">
											<i className="fas fa-pencil-alt" onClick={()=>setModalContent(
												<TextInputModal
													title='Edit Comment'
													submitTxt='Save'
													presetValue={c.content}
													charLimit={512}
													label='Comment'
													placeholder={'Write a comment...'}
													minWidth={'calc(min(100vw, 360px))'}
													onCancel={closeModal}
													onSubmit={(e,val)=>editComment(c.id, val, e)}
												/>
											)}/>
											<i className="fas fa-trash-alt" onClick={()=>setModalContent(
												<ConfirmModal
													title='Delete Comment'
													sub1='Are you sure you want to delete this comment?'
													sub2='This action cannot be undone.'
													confirmTxt='Delete'
													onCancel={closeModal}
													onConfirm={()=>deleteComment(c.id)}
												/>
											)}/>
										</div>}
									</div>
								</div>
							</div>)
							: <div className="c400">No comments yet!{sessionUser&&' Add one to start the conversation.'}</div>
						}</div>
						{sessionUser && <div id="commentsFooter">
							<div id="commentsFooterPfp"><img src={findPfpSrc(sessionUser)}/></div>
							<div id="commentsFooterInput">
								<div className='formInputText'>
									<input
										type="text"
										value={comment}
										onChange={e => setComment(e.target.value)}
										placeholder="Add a public comment"
									/>
								</div>
							</div>
							{comment && comment.length <= 512 && <div className={`btn bRed${commenting?' disabled':''}`} onClick={addComment}>
								<i className={`fas fa-${commenting? 'cog fa-spin':'paper-plane'}`}/>
							</div>}
						</div>}
					</> : <div className="ac wbold">Comments are disabled</div>
				}</div>
			</div>
		</div>
	</>
}

export default PinDetails

function formatTime(rawTime, formatLen) {
	const msgTime = new Date(rawTime)
	// msgTime.setTime(msgTime.getTime() + msgTime.getTimezoneOffset()*6e4)
	if(formatLen==='full') return msgTime.toLocaleString(navigator.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
	let now = Date.now();
	let hours = msgTime.getHours();
	let minutes = msgTime.getMinutes();
	let ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	let strTime = hours + ':' + minutes + ' ' + ampm;
	let diff = now-msgTime.getTime();
	if(formatLen==='timeOnly') return strTime
	if(diff<1728e5) { // 24hr and 48hr
		return (diff<864e5?'Today':'Yesterday')+' at '+strTime;
	} else {
    return msgTime.toLocaleString(navigator.language, { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric' })
	}
}