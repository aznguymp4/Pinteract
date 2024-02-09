import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { thunkFetch1Pin, thunkDeletePin } from "../../redux/pin"
import { findDisplayName, findPfpSrc } from "../../redux/user"
import { useModal } from "../../context/Modal";
import './PinDetails.css'

const PinDetails = () => {
	const dispatch = useDispatch()
	const nav = useNavigate()
	const { setModalContent, closeModal } = useModal()
	const { pinId } = useParams()
	const pin = useSelector(s=>s.pin[pinId])
	const sessionUser = useSelector(s=>s.session.user)
	const [deleting, setDeleting] = useState(false)

	useEffect(()=>{
		dispatch(thunkFetch1Pin(pinId, nav));
	}, [pinId, dispatch])

	const deletePin = e => {
		if(deleting) return
		setDeleting(true)
		e.target.innerHTML = '<i class="fas fa-cog fa-spin"></i> Deleting...'
		e.target.classList.add('disabled')
		dispatch(thunkDeletePin(pinId))
	}

	useEffect(()=>{
		if(!deleting || pin) return
		nav(`/user/${sessionUser?.id}?v=pin` || '/')
		closeModal()
	}, [deleting, pin])

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
					<div id="pinDetailsRTitleTxt">{pin?.title || 'Unnamed Pin'}</div>
					<div id="pinDetailsRBtns">
						{sessionUser?.id === pin?.authorId && <>
							<i className="fas fa-trash-alt fa-xs" onClick={()=>setModalContent(<>
								<div id="modalTitle">Delete Pin</div>
								<div className="modalTxt ac">
									<div>Are you sure you want to delete this Pin?</div>
									<div className="c400 s200">It will also be inaccessible for those who&apos;ve saved it.</div>
								</div>
								<div id="modalBtns">
									<div className="btn" onClick={closeModal}>Cancel</div>
									<div className='btn bRed' onClick={deletePin}>Delete</div>
								</div>
							</>)}/>
							<i onClick={()=>nav(`/pin/${pinId}/edit`)} className="fas fa-edit fa-xs"/>
						</>}
						<i className="fas fa-bookmark fa-xs"/>
					</div>
				</div>
				<div id="pinDetailsRDesc">{pin?.desc || 'No description'}</div>
				<div>
					<div id="comments">{pin?.canComment?
						<>
							<div className="wsemibold">Comments・{pin?.commentCount || 0}</div>
							<div id="commentsList">{
								pin?.Comments?.length? pin.Comments.sort((a,b)=>b.id-a.id).map(c => <div key={c.id} className="comment">
									<Link className="commentL" to={`/user/${c.User.id}`}>
										<img className="commentIcon" src={findPfpSrc(c.User)}/>
									</Link>
									<div className="commentR">
										<Link className="wsemibold commentRName" to={`/user/${c.User.id}`}>{findDisplayName(c.User)}</Link>
										<span>{c.content}</span>
										<div className="commentRFooter c400">
											<span className="s100 si" title={`Commented: ${formatTime(c.createdAt,'full')}${c.createdAt===c.updatedAt?'':`\n\nEdited: ${formatTime(c.updatedAt,'full')}`}`}>
												{formatTime(c.createdAt)} {c.createdAt===c.updatedAt?'':'(edited)'}
											</span>
											{c.User.id === sessionUser?.id && <div className="commentRFooterBtns">
												<i className="fas fa-pencil-alt"/>
												<i className="fas fa-trash-alt"/>
											</div>}
										</div>
									</div>
								</div>)
								: <div className="c400">No comments yet! Add one to start the conversation.</div>
							}</div>
							<div id="commentsFooter">
								{/* TODO */}
							</div>
						</> : <div className="ac wbold">Comments are disabled</div>
					}</div>
				</div>
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