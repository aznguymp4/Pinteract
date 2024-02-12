import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkRestoreUser } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import { setQuery } from "../redux/search";

export default function Layout() {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user)
	const loc = useLocation()
	useEffect(() => {
		dispatch(thunkRestoreUser())
	}, [dispatch]);
	useEffect(() => {
		dispatch(setQuery('')) // reset search bar when page changes
	}, [dispatch, loc])

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
