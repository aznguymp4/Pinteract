import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'

function Unauthorized({ message }) {
	const nav = useNavigate()
	return <h2 id="unauthorized">
		<span className='s500'>{message || 'You’re not authorized to view this page! :('}</span>
		<div className="btn bRed s300" id='unauthorizedHomeBtn' onClick={()=>nav('/')}>Go Home</div>
	</h2>;
}

export default Unauthorized;