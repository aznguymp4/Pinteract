import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { findDisplayName, findPfpSrc } from "../../redux/user";
import { useNavigate } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import AccountConfigForm from "../AccountConfigForm";
import './ProfileButton.css'

function ProfileButton() {
	const dispatch = useDispatch();
	const nav = useNavigate()
	const [showMenu, setShowMenu] = useState(false);
	const sessionUser = useSelector((store) => store.session.user);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;
		
		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};
		
		document.addEventListener("click", closeMenu);
		
		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);
	
	const closeMenu = () => setShowMenu(false);
	const navC=l=>{nav(l);closeMenu()}

	const logout = (e) => {
		e.preventDefault();
		dispatch(thunkLogout());
		closeMenu();
	};
	const pfp = <img src={sessionUser? findPfpSrc(sessionUser) : '/icons/bars.svg'} alt="" />

	return (
		<>
			{/* <button onClick={toggleMenu}>
				<i className="fas fa-user-circle" />
			</button>
			 */}
			<div id="pfpBtn" onClick={toggleMenu}>{pfp}</div>
			{showMenu && (
				<div id="authDropdown" ref={ulRef}>
					{sessionUser ? (
						<>
							<div onClick={()=>navC(`/user/${sessionUser?.id}`)} id="authDropdownUser">
								<div id="authDropdownUserPfp">
									{pfp}
								</div>
								<div id="authDropdownUserNames">
									<div className="wsemibold">{findDisplayName(sessionUser)}</div>
									<div className="s100 w300 si c400">@{sessionUser.username}</div>
									<div className="s100 w300 si c400">{sessionUser.email}</div>
								</div>
							</div>
							<div onClick={()=>navC(`/user/${sessionUser?.id}`)}>My Profile</div>
							<OpenModalMenuItem
								itemText="Settings"
								onItemClick={closeMenu}
								modalComponent={<AccountConfigForm/>}
							/>
							<div onClick={logout}>Log Out</div>
						</>
					) : (
						<>
							<OpenModalMenuItem
								itemText="Log In"
								onItemClick={closeMenu}
								modalComponent={<LoginFormModal/>}
							/>
							<OpenModalMenuItem
								itemText="Sign Up"
								onItemClick={closeMenu}
								modalComponent={<SignupFormModal/>}
							/>
						</>
					)}
				</div>
			)}
		</>
	);
}

export default ProfileButton;
