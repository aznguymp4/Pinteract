import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'

function Unauthorized() {
	const nav = useNavigate()
	return <h2 id="unauthorized">
		<span className='s500'>You’re not authorized to view this page! :(</span>
		<div className="btnRed s300" id='unauthorizedHomeBtn' onClick={()=>nav('/')}>Go Home</div>
	</h2>;
}

export default Unauthorized;