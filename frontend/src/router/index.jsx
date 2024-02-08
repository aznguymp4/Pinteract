import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Discovery from '../components/Discovery';
import PinDetails from '../components/PinDetails';
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
				path: "/create",
				element: <PinCreateForm/>,
			},
			{
				path: "/pin/:pinId",
				element: <PinDetails/>,
			},
			{
				path: "/pin/:pinId/edit",
				element: <PinCreateForm edit={true}/>,
			}
		]
	},
]);