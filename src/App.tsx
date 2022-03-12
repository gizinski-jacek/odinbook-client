// @ts-nocheck

import { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { UserContext } from './components/hooks/UserContext';
import { axiosGet } from './components/utils/axiosFunctions';
import './App.scss';
import LoadingIcon from './components/utils/LoadingIcon';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FrontPage from './components/FrontPage';
import SideBar from './components/SideBar';
import Timeline from './components/Timeline';
import Contacts from './components/Contacts';
import People from './components/People';
import ProfileMain from './components/ProfileMain';
import ProfilePosts from './components/ProfilePosts';
import ProfileAbout from './components/ProfileAbout';
import ProfileFriends from './components/ProfileFriends';

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				setUser(await axiosGet('/api/verify-token'));
				setIsLoading(false);
			} catch (error: any) {
				setUser(null);
				setIsLoading(false);
				console.error(error);
			}
		})();
	}, []);

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
							<div className='home-container'>
								<SideBar />
								<Timeline />
								<Contacts />
							</div>
						}
					></Route>
					<Route
						path='profile/:userid'
						element={
							<div className='profile-container'>
								<ProfileMain />
								<Outlet />
							</div>
						}
					>
						<Route path='' element={<ProfilePosts />}></Route>
						<Route path='about' element={<ProfileAbout />}></Route>
						<Route path='friends' element={<ProfileFriends />}></Route>
					</Route>
					<Route path='friends' element={<People />}></Route>
				</Route>
			</Routes>
		</UserContext.Provider>
	);
};

export default App;
