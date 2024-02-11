import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { thunkFetch1User } from '../../redux/user'
import { findDisplayName, findPfpSrc } from '../../redux/user'
import { useModal } from '../../context/Modal'
import Discovery from '../Discovery'
import Boards from '../Boards'
import AccountConfigForm from '../AccountConfigForm'
import './UserDetails.css'

const UserDetails = () => {
	const nav = useNavigate()
	const dispatch = useDispatch()
	const { setModalContent } = useModal()
	const [params] = useSearchParams()
	const { userId } = useParams()
	const sessionUser = useSelector(s=>s.session.user)
	const user = useSelector(s=>s.user[userId])
	const [pinView, setPinView] = useState(params.get('v')==='pin') // true: viewing pins, false: viewing boards

	useEffect(()=>{
		dispatch(thunkFetch1User(userId, 'both'))
	},[dispatch, userId])

	useEffect(()=>{
		nav(`/user/${userId}${pinView?'?v=pin':''}`)
	}, [pinView, userId, nav])

	return <>
		<div id='userDetailInfo'>
			<div id='userDetailInfoPfp'><img src={findPfpSrc(user)}/></div>
			<div className='s600 wsemibold' id='userDetailInfoName'>
				<div id='userDetailInfoNameTxt'>{findDisplayName(user)}</div>
				{(user?.id === sessionUser?.id) && <div className='btn mah' style={{padding:'14.5px 14px'}} onClick={()=>setModalContent(<AccountConfigForm/>)}><i className="fas fa-user-cog"/></div>}
			</div>
			<div className='s200 c400'>@{user?.username}</div>
			<div id='userDetailInfoBio'>{user?.bio}</div>
		</div>
		<div id='userDetailBody'>
			<div id='userDetailViewPick'>
				<div className={`wsemibold btn ${pinView?'bBlack':'bWhite'}`} onClick={()=>setPinView(true)}>Pins</div>
				<div className={`wsemibold btn ${pinView?'bWhite':'bBlack'}`} onClick={()=>setPinView(false)}>Boards</div>
			</div>
			{
				params.get('v')==='pin'
				? user?.Pins?.length? <Discovery pinsArg={user?.Pins}/> : <div className='wsemibold s400 ac c400'><br/>No Pins found...</div>
				: <Boards boardsArg={user?.Boards} showNew={sessionUser?.id===user?.id}/>
			}
		</div>
	</>
}

export default UserDetails