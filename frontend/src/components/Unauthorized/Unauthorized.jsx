import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEnable } from '../../redux/search';

import './Unauthorized.css'

const Unauthorized = ({ message }) => {
	const nav = useNavigate()
	const dispatch = useDispatch()
	dispatch(setEnable(false))

	return <h2 id="unauthorized">
		<span className='s500'>{message || 'You’re not authorized to view this page! :('}</span>
		<div className="btn bRed s300" id='unauthorizedHomeBtn' onClick={()=>nav('/')}>Go Home</div>
	</h2>;
}

export default Unauthorized;