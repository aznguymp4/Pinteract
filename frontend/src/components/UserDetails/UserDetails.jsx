import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { thunkFetch1User } from '../../redux/user'
import { findDisplayName, findPfpSrc } from '../../redux/user'
import Discovery from '../Discovery'
import Boards from '../Boards'
import './UserDetails.css'

const UserDetails = () => {
	const dispatch = useDispatch()
	const { userId } = useParams()
	// const sessionUser = useSelector(s=>s.session.user)
	const user = useSelector(s=>s.user[userId])
	const [pinView, setPinView] = useState(false) // true: viewing pins, false: viewing boards

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
				<div className={`wsemibold viewPickBtn${pinView?' selected':''}`} onClick={()=>setPinView(true)}>Pins</div>
				<div className={`wsemibold viewPickBtn${pinView?'':' selected'}`} onClick={()=>setPinView(false)}>Boards</div>
			</div>
			{
				pinView
				? user?.Pins?.length? <Discovery pinsArg={user?.Pins}/> : <div className='wsemibold s400 ac'>No Pins Found...</div>
				: <Boards boardsArg={user?.Boards}/>
			}
		</div>
	</>
}

export default UserDetails