import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { useModal } from "../../context/Modal"
import { thunkRemoveBoardPin } from "../../redux/board"
import modalTemplates from "../../context/ModalTemplates"

const PinTile = ({ pin, deleting }) => {
	const dispatch = useDispatch()
	const [loaded, setLoaded] = useState(false)
	const { setModalContent, closeModal } = useModal()
	const { boardId } = useParams()
	const [removing, setRemoving] = useState(false)

	const pic = <img
		loading="lazy"
		src={pin.img}
		onLoad={()=>setTimeout(()=>setLoaded(true), Math.random()*250)}
	/>
	
	const removePin = e => {
		if(removing) return
		setRemoving(true)
		e.target.innerHTML = '<i class="fas fa-cog fa-spin"></i> Removing...'
		e.target.classList.add('disabled')
		dispatch(thunkRemoveBoardPin(boardId, pin.id, closeModal))
	}

	const askRemove = () => {
		if(!boardId) return
		setModalContent(<modalTemplates.ConfirmModal
			title='Remove Pin'
			sub1='Are you sure you want to remove this Pin this Board?'
			sub2='You can re-add public Pins at any time.'
			confirmTxt='Remove'
			onCancel={closeModal}
			onConfirm={removePin}
		/>)
	}
		
	const className = `pinTile${loaded?' loaded':''}`
	return deleting
	? <div className={className} onClick={askRemove}>
		<div className="pinTileMinus"><i className="fas fa-times"/></div>
		{pic}
	</div>
	: <Link to={`/pin/${pin.id}`} className={className}>{pic}</Link>
}
export default PinTile