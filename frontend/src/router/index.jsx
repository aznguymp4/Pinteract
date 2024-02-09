import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Discovery from '../components/Discovery';
import PinDetails from '../components/PinDetails';
import UserDetails from '../components/UserDetails';
import BoardDetails from '../components/BoardDetails';
import PinCreateForm from '../components/PinCreateForm';
import Unauthorized from '../components/Unauthorized'

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Discovery/>,
			},
			{
				path: "/unauthorized",
				element: <Unauthorized/>,
			},
			{
				path: "/not-found",
				element: <Unauthorized message={'The page you were looking for was not found… :('}/>,
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