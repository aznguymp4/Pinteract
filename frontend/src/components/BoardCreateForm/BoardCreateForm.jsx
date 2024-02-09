import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { makeErr } from "../PinCreateForm/PinCreateForm";
import { useNavigate } from "react-router-dom";
import { thunkCreateBoard, thunkEditBoard } from "../../redux/board";
import ToggleSwitch from "../PinCreateForm/ToggleSwitch";
import "./BoardCreateForm.css";

const BoardCreateForm = ({ editBoard }) => {
	const dispatch = useDispatch()
	const nav = useNavigate()
	const { closeModal } = useModal()
	const [title, setTitle] = useState(editBoard?.title || '')
	const [desc, setDesc] = useState(editBoard?.desc || '')
	const [isPublic, setPublic] = useState(editBoard?.public || false)
	const [canCreate, setCanCreate] = useState(false)
	const [creating, setCreating] = useState(false)

	useEffect(()=>{
		setCanCreate(title.length && title.length<=64 && desc.length<=256)
	}, [title, desc])

	const navC=l=>{nav(l);closeModal()}
	const createBoard = () => {
		if(!canCreate || creating) return
		setCreating(true)
		const body = {title, desc, public: isPublic}

		dispatch(
			editBoard
			? thunkEditBoard(editBoard.id, body, navC)
			: thunkCreateBoard(body, navC)
		)
	}

	return <>
		<div id="modalTitle">{`${editBoard?'Edit':'Create'} Board`}</div>
		<br/>
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
