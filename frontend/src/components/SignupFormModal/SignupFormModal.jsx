import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { makeErr } from "../../context/util";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = () => {
		if(submitting) return
		setSubmitting(true)

		if (password !== confirmPassword) {
			setSubmitting(false)
			return setErrors({ confirmPassword: "Must match exactly with Password"})
		}
		setErrors({})

		dispatch(thunkSignup({ credential, username, password }, (ok,res) => {
			setSubmitting(false)

			if(ok) return closeModal()
			setErrors(res.errors)
		}))
	}

	return <>
		<div id="modalTitle" style={{width:'400px'}}>Sign Up</div>
			<div className={`formInputText ${errors.email && 'error'}`}>
				<label>Email {errors.email && makeErr(1,errors.email)}</label>
				<input
					type="text"
					value={credential}
					onChange={e => setCredential(e.target.value)}
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
			<div className={`formInputText ${errors.password && 'error'}`}>
				<label>Password {errors.password && makeErr(1,errors.password)}</label>
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			<div className={`formInputText ${errors.confirmPassword && 'error'}`}>
				<label>Confirm Password {errors.confirmPassword && makeErr(1,errors.confirmPassword)}</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
				/>
			</div>
			<div id="modalBtns">
				<div className="btn" onClick={closeModal}>Cancel</div>
				<div
					className={`btn bRed${submitting?' disabled':''}`}
					onClick={handleSubmit}
				>
					{submitting
						? <><i className="fas fa-cog fa-spin"/> Submitting...</>
						: 'Sign Up'
					}
				</div>
			</div>
	</>

	// return (
	// 	<>
	// 		<div className='s500 wbold'>Sign Up</div>
	// 		{errors.server && <p>{errors.server}</p>}
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
	// 				Username
	// 				<input
	// 					type="text"
	// 					value={username}
	// 					onChange={(e) => setUsername(e.target.value)}
	// 					required
	// 				/>
	// 			</label>
	// 			{errors.username && <p>{errors.username}</p>}
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
	// 			<label>
	// 				Confirm Password
	// 				<input
	// 					type="password"
	// 					value={confirmPassword}
	// 					onChange={(e) => setConfirmPassword(e.target.value)}
	// 					required
	// 				/>
	// 			</label>
	// 			{errors.confirmPassword && <p>{errors.confirmPassword}</p>}
	// 			<button type="submit">Sign Up</button>
	// 		</form>
	// 	</>
	// );
}

export default SignupFormModal;
