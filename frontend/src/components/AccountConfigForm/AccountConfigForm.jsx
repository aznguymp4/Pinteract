import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { makeErr } from "../../context/util";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";
import FileUpload from "../FileUpload"
import "./AccountConfigForm.css";

function AccountConfigForm() {
	const sessionUser = useSelector(s=>s.session.user)
	const dispatch = useDispatch();

	if(!sessionUser) return <>
		<div id="modalTitle">Unauthorized</div>
		<div className="ac">You're not logged in!</div>
		<div id="modalBtns">
			<div className="btn" onClick={()=>setModalContent(<SignupFormModal/>)}>Sign Up</div>
			<div className="btn bRed" onClick={()=>setModalContent(<LoginFormModal/>)}>Log In</div>
		</div>
	</>

	const handleSubmit = () => {
		if(submitting) return
		setSubmitting(true)
		setErrors({})

		setTimeout(()=>setSubmitting(false), 800)

		// dispatch(thunkSignup({ credential, username, password }, (ok,res) => {
		// 	setSubmitting(false)

		// 	if(ok) return closeModal()
		// 	setErrors(res.errors)
		// }))
	}

	const [username, setUsername] = useState(sessionUser.username)
	const [displayName, setDisplayName] = useState(sessionUser.displayName)
	const [firstName, setFirstName] = useState(sessionUser.firstName)
	const [lastName, setLastName] = useState(sessionUser.lastName)
	const [bio, setBio] = useState(sessionUser.bio)
	const [bioL, setBioL] = useState(sessionUser.bio?.length || 0)
	const [icon, setIcon] = useState(sessionUser.icon)
	const [errors, setErrors] = useState({})
	const { setModalContent, closeModal } = useModal()
	const [submitting, setSubmitting] = useState(false)

	return <>
		<div id="modalTitle">Account Settings</div>
			<div id="accountFormPfp">
				<FileUpload
					types={'image/*'}
					id={'accountFormPfpInput'}
					src={icon}
					setSrc={setIcon}
				/>
			</div>
			<div id='accountFormNames'>
				<div className={`formInputText ${errors.firstName && 'error'}`}>
					<label>First Name {errors.firstName && makeErr(1,errors.firstName)}</label>
					<input
						type="text"
						value={firstName}
						placeholder="John (optional)"
						onChange={e => setFirstName(e.target.value)}
					/>
				</div>
				<div className={`formInputText ${errors.lastName && 'error'}`}>
					<label>Last Name {errors.lastName && makeErr(1,errors.lastName)}</label>
					<input
						type="text"
						value={lastName}
						placeholder="Doe (optional)"
						onChange={e => setLastName(e.target.value)}
					/>
				</div>
			</div>
			<div className={`formInputText ${errors.displayName && 'error'}`}>
				<label>Display Name {errors.displayName && makeErr(1,errors.displayName)}</label>
				<input
					type="text"
					value={displayName}
					placeholder="JohnDoe123 (optional)"
					onChange={e => setDisplayName(e.target.value)}
				/>
			</div>
			<div className={`formInputText ${errors.username && 'error'}`}>
				<label>Username {errors.username && makeErr(1,errors.username)}</label>
				<input
					type="text"
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
			</div>
			<div className={`formInputText ${errors.bio && 'error'}`}>
				<label>Bio {errors.bio && makeErr(1,errors.bio)}</label>
				{!bioL && <div className="spanPlaceholder">Describe yourself (optional)</div>}
				<span
					contentEditable
					className="spanTextInput"
					onBlur={e => setBio(e.target.innerText)}
					onInput={e => setBioL(e.target.innerText.length)}
					style={{maxHeight:'80px',minHeight:'80px', maxWidth:'405px'}}
				>{bio}</span>
			</div>
			<div id="modalBtns">
				<div className="btn" onClick={closeModal}>Cancel</div>
				<div
					className={`btn bRed${submitting?' disabled':''}`}
					onClick={handleSubmit}
				>
					{submitting
						? <><i className="fas fa-cog fa-spin"/> Saving...</>
						: 'Save'
					}
				</div>
			</div>
	</>
}

export default AccountConfigForm;
