import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { makeErr } from "../../context/util";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = (c,p) => {
		if(submitting) return
		setSubmitting(true)
		setErrors({})

		dispatch(thunkLogin({ credential: c||credential, password: p||password }, (ok,res) => {
			setSubmitting(false)
			
			if(ok) return closeModal()
			console.log(res.errors)
			setErrors(res.errors)
		}))
	}

	return <>
		<div id="modalTitle" style={{width:'400px'}}>Log In</div>
		<div className="s200 ac">{errors.credential && makeErr(1,errors.credential)}</div>
		<div className={`formInputText ${(errors.email || errors.credential) && 'error'}`}>
			<label>Email {errors.email && makeErr(1,errors.email)}</label>
			<input
				type="text"
				value={credential}
				onChange={e => setCredential(e.target.value)}
			/>
		</div>
		<div className={`formInputText ${(errors.password || errors.credential) && 'error'}`}>
			<label>Password {errors.password && makeErr(1,errors.password)}</label>
			<input
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
		</div>
		<div id="modalBtns">
			<div className="btn bWhite" onClick={()=>handleSubmit('demo@aa.io','password')}>Demo User</div>
			<div className="btn" onClick={closeModal}>Cancel</div>
			<div
				className={`btn bRed${submitting?' disabled':''}`}
				onClick={()=>handleSubmit()}
			>
				{submitting
					? <><i className="fas fa-cog fa-spin"/> Logging In...</>
					: 'Log In'
				}
			</div>
		</div>
	</>

	// return (
	// 	<>
	// 		<div className="s600 wbold">Log In</div>
	// 		<form onSubmit={handleSubmit}>
	// 			<label>
	// 				Email
	// 				<input
	// 					type="text"
	// 					value={credential}
	// 					onChange={(e) => setCredential(e.target.value)}
	// 					required
	// 				/>
	// 			</label>
	// 			{errors.email && <p>{errors.email}</p>}
	// 			<label>
	// 				Password
	// 				<input
	// 					type="password"
	// 					value={password}
	// 					onChange={(e) => setPassword(e.target.value)}
	// 					required
	// 				/>
	// 			</label>
	// 			{errors.password && <p>{errors.password}</p>}
	// 			<button type="submit">Log In</button>
	// 		</form>
	// 	</>
	// );
}

export default LoginFormModal;
