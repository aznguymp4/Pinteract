import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkRestoreUser } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user)
	useEffect(() => {
		dispatch(thunkRestoreUser())
	}, [dispatch]);

	return (
		<>
			<ModalProvider>
				<Navigation />
				<div style={{height:'81px'}}/>
				{sessionUser !== undefined && <Outlet />}
				<Modal />
			</ModalProvider>
		</>
	);
}
