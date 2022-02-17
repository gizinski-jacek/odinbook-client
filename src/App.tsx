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

const App = () => {
	const location = useLocation();

	const [isLoading, setIsLoading] = useState(true);
	const [loggedUser, setLoggedUser] = useState(null);

	useEffect(() => {
		(async () => {})();
	}, [location]);

	return (
		<Routes>
			<Route
				path='/'
				element={
					<main className='main'>
						{loggedUser ? (
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
				<Route path='' element={<HomePage />} />
				<Route path='profile' element={<MyProfile />}></Route>
				<Route path='user' element={<UserProfile />}></Route>
			</Route>
		</Routes>
	);
};

export default App;
