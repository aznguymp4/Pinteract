import { useParams, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { thunkFetch1User } from '../../redux/user'
import { findDisplayName, findPfpSrc } from '../../redux/user'
import Discovery from '../Discovery'
import Boards from '../Boards'
import './UserDetails.css'

const UserDetails = () => {
	const dispatch = useDispatch()
	const [params] = useSearchParams()
	const { userId } = useParams()
	const sessionUser = useSelector(s=>s.session.user)
	const user = useSelector(s=>s.user[userId])
	const [pinView, setPinView] = useState(params.get('v')==='pin') // true: viewing pins, false: viewing boards

	useEffect(()=>{
		dispatch(thunkFetch1User(userId, 'both'))
	},[dispatch, userId])

	return <>
		<div id='userDetailInfo'>
			<div id='userDetailInfoPfp'><img src={findPfpSrc(user)}/></div>
			<div className='s600 wsemibold'>{findDisplayName(user)}</div>
			<div className='s200 c400'>@{user?.username}</div>
		</div>
		<div>
			<div id='userDetailViewPick'>
				{/* <div className={`wsemibold viewPickBtn${pinView?' selected':''}`} onClick={()=>setPinView(true)}>Pins</div> */}
				{/* <div className={`wsemibold viewPickBtn${pinView?'':' selected'}`} onClick={()=>setPinView(false)}>Boards</div> */}
				<div className={`wsemibold btn ${pinView?'bBlack':'bWhite'}`} onClick={()=>setPinView(true)}>Pins</div>
				<div className={`wsemibold btn ${pinView?'bWhite':'bBlack'}`} onClick={()=>setPinView(false)}>Boards</div>
			</div>
			{
				pinView
				? user?.Pins?.length? <Discovery pinsArg={user?.Pins}/> : <div className='wsemibold s400 ac'>No Pins Found...</div>
				: <Boards boardsArg={user?.Boards} showNew={sessionUser?.id===user?.id}/>
			}
		</div>
	</>
}

export default UserDetails