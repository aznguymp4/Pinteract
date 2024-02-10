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
			<div className={`formInputText ${(errors.email||errors.credential) && 'error'}`}>
				<label>Email {(errors.email||errors.credential) && makeErr(1,errors.email||errors.credential)}</label>
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
}

export default SignupFormModal;
