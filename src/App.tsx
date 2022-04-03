import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from './components/hooks/UserProvider';
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
import ProfileFriends from './components/ProfileFriends';

const App = () => {
	const { user, setUser } = useContext(UserContext);

	const location = useLocation();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				setUser(
					await axiosGet('/api/verify-token', { signal: controller.signal })
				);
				setIsLoading(false);
			} catch (error: any) {
				setUser(null);
				setIsLoading(false);
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [location, setUser]);

	return (
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
								<Outlet />
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
					<Route path='friends' element={<ProfileFriends />}></Route>
				</Route>
				<Route path='friends' element={<People />}></Route>
			</Route>
		</Routes>
	);
};

export default App;
