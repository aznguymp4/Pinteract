import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Discovery from '../Discovery'
import './HomePage.css'

const HomePage = () => {
	const [showJump, setShowJump] = useState(false)
	const scrollToTop = () => {
		document.documentElement.scrollTop = 0
		document.body.scrollTop = 0
		setShowJump(false)
	}
	useEffect(()=>{
		const scrollFunc = () => {
			const newBool = window.scrollY > 200
			if(showJump!==newBool) setShowJump(newBool)
		}
		window.addEventListener('scroll', scrollFunc)
		return () => window.removeEventListener('scroll', scrollFunc)
	},[showJump])

	return <>
		<div className='floatBtn L'>
			<Link target='_blank' rel='noopener noreferrer' to='https://github.com/aznguymp4' className='floatBtnIcon'>
				<i className="fab fa-github"/>
			</Link>
			<Link target='_blank' rel='noopener noreferrer' to='https://www.linkedin.com/in/erich-n/' className='floatBtnIcon'>
				<i className="fab fa-linkedin"/>
			</Link>
		</div>
		<div className={`floatBtn R ${showJump?'':'hidden'}`} onClick={scrollToTop}>
			<div className='floatBtnIcon'><i className='fas fa-chevron-up'/></div>
		</div>
		<Discovery/>
	</>
}

export default HomePage;