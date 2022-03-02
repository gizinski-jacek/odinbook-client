// @ts-nocheck

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Routes, Route, Outlet } from 'react-router-dom';
import { UserContext } from './components/hooks/UserContext';
import axios from 'axios';
import './App.scss';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FrontPage from './components/FrontPage';
import MyProfile from './components/MyProfile';
import UserProfile from './components/UserProfile';
import LoadingIcon from './components/utils/LoadingIcon';
import NotFriends from './components/NotFriends';
import SideMenu from './components/SideMenu';
import Timeline from './components/Timeline';
import Contacts from './components/Contacts';

const App = () => {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const resUser = await axios.get('/api/verify-token', {
					withCredentials: true,
				});
				setUser(resUser.data);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		})();
	}, [location]);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Routes>
				<Route
					path='/'
					element={
						<main className='main'>
							{isLoading ? (
								<LoadingIcon />
							) : user ? (
								<>
									<Navbar />
									<div className='home-container'>
										<Outlet />
									</div>
									<Footer />
								</>
							) : (
								<>
									<FrontPage />
									<Footer />
								</>
							)}
						</main>
					}
				>
					<Route
						path=''
						element={
							<>
								<SideMenu />
								<Timeline />
								<Contacts />
							</>
						}
					></Route>
					<Route path='me' element={<MyProfile />}></Route>
					<Route path='profile' element={<UserProfile />}></Route>
					<Route path='friends' element={<NotFriends />}></Route>
				</Route>
			</Routes>
		</UserContext.Provider>
	);
};

export default App;
