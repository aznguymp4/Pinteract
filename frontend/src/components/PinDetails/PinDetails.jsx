import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { thunkFetch1Pin } from "../../redux/pin"
import { findDisplayName } from "../../redux/session"
import './PinDetails.css'

const PinDetails = () => {
	const dispatch = useDispatch()
	const { pinId } = useParams()
	const pin = useSelector(s=>s.pin[pinId])
	const sessionUser = useSelector(s=>s.session.user)

	useEffect(()=>{
		dispatch(thunkFetch1Pin(pinId));
	}, [pinId, dispatch])
	console.log(pin)

	return <>
		<Link id="backBtn" to="/">
			<i className="fas fa-arrow-left fa-xl"/>
		</Link>
		<div id="pinDetails">
			<div id="pinDetailsL">
				<img id="pinDetailsLImg" src={pin?.img}/>
			</div>
			<div id="pinDetailsR">
				<div id="pinDetailsRTitle" className="s500 wsemibold">{pin?.title || 'Unnamed Pin'}</div>
				<div id="pinDetailsRDesc">{pin?.desc || 'No description'}</div>
				<div>
					<div className="wsemibold">Comments・{pin?.commentCount || 0}</div>
					<div id="comments">
						<div id="commentsList">{
							pin?.Comments?.length? pin.Comments.sort((a,b)=>b.id-a.id).map(c => <div key={c.id} className="comment">
								<Link className="commentL" to={`/user/${c.User.id}`}>
									<img className="commentIcon" src={c.User.icon}/>
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
							: 'No comments yet! Add one to start the conversation.'
						}</div>
						<div id="commentsFooter">
							{/* TODO */}
						</div>
					</div>
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