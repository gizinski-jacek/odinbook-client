// @ts-nocheck

import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Routes, Route, Outlet } from 'react-router-dom';
import axios from 'axios';
import './App.scss';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FrontPage from './components/FrontPage';
import HomePage from './components/HomePage';
import MyProfile from './components/MyProfile';
import UserProfile from './components/UserProfile';
import LoadingIcon from './components/utils/LoadingIcon';

type StateObject = { _id: string; email: string } | null;

const App = () => {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(true);
	const [loggedUser, setLoggedUser] = useState<StateObject>(null);

	useEffect(() => {
		(async () => {
			try {
				const resUser = await axios.get('/api/verify-token', {
					withCredentials: true,
				});
				setLoggedUser(resUser.data);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		})();
	}, [location]);

	return (
		<Routes>
			<Route
				path='/'
				element={
					<main className='main'>
						{isLoading ? (
							<LoadingIcon />
						) : loggedUser ? (
							<>
								<Navbar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
								<Outlet />
								<Footer />
							</>
						) : (
							<>
								<FrontPage setLoggedUser={setLoggedUser} />
								<Footer />
							</>
						)}
					</main>
				}
			>
				<Route path='' element={<HomePage loggedUser={loggedUser} />} />
				<Route path='profile' element={<MyProfile />}></Route>
				<Route path='user' element={<UserProfile />}></Route>
			</Route>
		</Routes>
	);
};

export default App;
