import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import PinDetails from '../components/PinDetails';
import UserDetails from '../components/UserDetails';
import BoardDetails from '../components/BoardDetails';
import PinCreateForm from '../components/PinCreateForm';
import Unauthorized from '../components/Unauthorized'

export const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <><Layout/><Unauthorized message='The page you were looking for was not found… :('/></>,
		children: [
			{
				path: "/",
				element: <HomePage/>,
			},
			{
				path: "/unauthorized",
				element: <Unauthorized/>,
			},
			{
				path: "/user/not-found",
				element: <Unauthorized message='The user you were looking for was not found… :('/>,
			},
			{
				path: "/not-found",
				element: <Unauthorized message='The page you were looking for was not found… :('/>,
			},
			{
				path: "/create",
				element: <PinCreateForm/>,
			},
			{
				path: "/user/:userId",
				element: <UserDetails/>,
			},
			{
				path: "/pin/:pinId",
				element: <PinDetails/>,
			},
			{
				path: "/board/:boardId",
				element: <BoardDetails/>,
			},
			{
				path: "/pin/:pinId/edit",
				element: <PinCreateForm edit={true}/>,
			}
		]
	},
]);