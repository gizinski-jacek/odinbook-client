import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from './components/hooks/UserProvider';
import { ChatContext, ChatProvider } from './components/hooks/ChatProvider';
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
import { ChatReducerActions } from './components/hooks/ChatProvider';

const App = () => {
	const { user, updateUser } = useContext(UserContext);
	const { dispatch } = useContext(ChatContext);

	const location = useLocation();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				updateUser(
					await axiosGet('/api/verify-token', { signal: controller.signal })
				);
				setIsLoading(false);
			} catch (error: any) {
				updateUser(null);
				dispatch({ type: ChatReducerActions.CLEAR_DATA });
				setIsLoading(false);
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [location, updateUser, dispatch]);

	return (
		<ChatProvider>
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
								</>
							) : (
								<>
									<FrontPage />
								</>
							)}
							<Footer />
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
		</ChatProvider>
	);
};

export default App;
