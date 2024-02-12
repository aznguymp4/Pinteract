import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { thunkCreateBoard, thunkEditBoard } from "../../redux/board";
import { makeErr } from "../../context/util";
import ToggleSwitch from "../PinCreateForm/ToggleSwitch";
import PinSelect from "./PinSelect";
import "./BoardCreateForm.css";

const BoardCreateForm = ({ editBoard }) => {
	const dispatch = useDispatch()
	const nav = useNavigate()
	const { closeModal } = useModal()
	const [title, setTitle] = useState(editBoard?.title || '')
	const [desc, setDesc] = useState(editBoard?.desc || '')
	const [isPublic, setPublic] = useState(editBoard?.public || false)
	const [coverPin, setCoverPin] = useState(editBoard?.coverPin || null)
	const [coverPinSrc, setCoverPinSrc] = useState((editBoard?.coverPin && editBoard?.coverSrc) || editBoard?.defaultCoverSrc)
	const [canCreate, setCanCreate] = useState(false)
	const [creating, setCreating] = useState(false)
	const [showPinSel, setShowPinSel] = useState(false)

	useEffect(()=>{
		setCanCreate(title.length && title.length<=64 && desc.length<=256)
	}, [title, desc])

	const navC=l=>{nav(l);closeModal()}
	const createBoard = () => {
		if(!canCreate || creating) return
		setCreating(true)
		const body = {title, desc, public: isPublic}
		if(editBoard) body.coverPin = coverPin

		console.log(body)

		dispatch(
			editBoard
			? thunkEditBoard(editBoard.id, body, closeModal)
			: thunkCreateBoard(body, navC)
		)
	}

	const selectPinCover = (_,pin) => {
		setShowPinSel(false)
		setCoverPin(pin.id)
		setCoverPinSrc(pin.img)
	}
	const resetPinCover = () => {
		setCoverPin(null)
		setCoverPinSrc(editBoard?.defaultCoverSrc || '/blankBoard.svg')
	}

	return <>
		<div id="modalTitle">{`${editBoard?'Edit':'Create'} Board`}</div>
		{editBoard && <div className="formInputText">
			<label>Board Cover</label>
			<div id="boardEditCover">
				<img src={coverPinSrc || '/blankBoard.svg'}/>
				<div id="boardEditBtns">
					<div className="btn" onClick={()=>setShowPinSel(s=>!s)}>
						{showPinSel? <><i className="fas fa-window-close"/> Cancel</> :  <><i className="fas fa-exchange-alt"/> Change</>}
					</div>
						{showPinSel && <div className="boardEditPinSel"><PinSelect pins={editBoard?.Pins} fixWidth={3} onPinSelect={selectPinCover}/></div>}
					<div className="btn" onClick={resetPinCover}><i className="fas fa-undo-alt"/> Reset</div>
					<div className="w300 c400" id="boardEditCoverNote"><b>•</b> By default, the latest pin in your Board will be the cover. To other users, the default will be the latest <b>public</b> pin.</div>
				</div>
			</div>
		</div>}
		<div className={`formInputText ${title.length>64 && 'error'}`}>
			<label>Name {makeErr(title.length>64, 'Name must be 64 characters or less')}</label>
			<input
				type="text"
				placeholder="Like “Places to Go” or “Recipes to Make”"
				value={title}
				onChange={e => setTitle(e.target.value)}
				style={{width:'350px'}}
			/>
		</div>
		<div className={`formInputText ${desc.length>256 && 'error'}`}>
			<label>Description {makeErr(desc.length>256, 'Description must be 256 characters or less')}</label>
			<input
				type="text"
				placeholder="What will your new Board be about?"
				value={desc}
				onChange={e => setDesc(e.target.value)}
				style={{width:'350px'}}
			/>
		</div>
		<ToggleSwitch
			label='Public – Allow anyone to view this Board'
			setState={setPublic}
			state={isPublic}
		/>
		<br/>
		<div id="modalBtns">
			<div className="btn" onClick={closeModal}>Cancel</div>
			<div
				className={`btn bRed${!canCreate || creating?' disabled':''}`}
				onClick={createBoard}
			>
				{creating
					? <><i className="fas fa-cog fa-spin"/> {editBoard?'Sav':'Creat'}ing...</>
					: `${editBoard?'Sav':'Creat'}e`
				}
			</div>
		</div>
	</>
}

export default BoardCreateForm;
