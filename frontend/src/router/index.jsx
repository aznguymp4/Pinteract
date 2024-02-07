import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Discovery from '../components/Discovery';
import PinDetails from '../components/PinDetails';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Discovery/>,
			},
			{
				path: "/create",
				element: <h1>Create a new Pin</h1>,
			},
			{
				path: "/pin/:pinId",
				element: <PinDetails/>,
			}
		]
	},
]);