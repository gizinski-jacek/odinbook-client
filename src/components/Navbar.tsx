import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import type { PostFull } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import AccountMenu from './menus/AccountMenu';
import NotificationsMenu from './menus/NotificationsMenu';
import MessengerMenu from './menus/MessengerMenu';
import MainMenu from './menus/MainMenu';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
	const { user } = useContext(UserContext);

	const location = useLocation();

	const searchRef = useRef<HTMLInputElement>(null);
	const menuContainerRef = useRef<HTMLDivElement>(null);

	const [openMenuContainer, setOpenMenuContainer] = useState(false);
	const [openMenuId, setOpenMenuId] = useState(0);

	const [searchInput, setSearchInput] = useState('');
	const [searchData, setSearchData] = useState<PostFull[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [notificationAlert, setNotificationAlert] = useState(0);

	useEffect(() => {
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts');
				setNotificationAlert(resData.incoming_friend_requests.length);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	useEffect(() => {
		setOpenMenuContainer(false);
		setOpenMenuId(0);
	}, [location]);

	const toggleMenu = (
		e: React.MouseEvent<HTMLLIElement>,
		menuNumber: number
	) => {
		e.stopPropagation();
		if (!openMenuContainer) {
			setOpenMenuContainer(true);
			setOpenMenuId(menuNumber);
			document.addEventListener('click', closeMenuContainer);
			return;
		}
		if (openMenuContainer && openMenuId === menuNumber) {
			setOpenMenuContainer(false);
			setOpenMenuId(0);
			document.removeEventListener('click', closeMenuContainer);
			return;
		}
		setOpenMenuId(menuNumber);
	};

	const closeMenuContainer = (e: any) => {
		e.stopPropagation();
		if (!menuContainerRef.current?.contains(e.target)) {
			setOpenMenuContainer(false);
			setOpenMenuId(0);
			document.removeEventListener('click', closeMenuContainer);
		}
	};

	const handleSearch = async (
		e: React.FormEvent<HTMLFormElement>,
		query: string
	) => {
		e.preventDefault();
		try {
			setSearchData(await axiosGet(`/api/search/posts?q=${query}`));
			setShowResults(true);
			document.addEventListener('click', windowListener);
		} catch (error: any) {
			console.error(error);
		}
	};

	const clearSearch = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setSearchInput('');
		setSearchData([]);
		setShowResults(false);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (searchRef.current !== e.target) {
			setShowResults(false);
			document.removeEventListener('click', windowListener);
		}
	};

	const searchDisplay = searchData?.map((post) => {
		return (
			<li key={post._id} onClick={clearSearch}>
				<Link
					className={styles.search_result}
					to={`/profile/${post.author._id}`}
				>
					<div className='profile-pic-style'>
						<img
							src={
								post.author.profile_picture
									? `http://localhost:4000/photos/${user.profile_picture}`
									: '/placeholder_profile_pic.png'
							}
							alt='User profile pic'
						/>
					</div>
					<span className={styles.text}>{post.text}</span>
				</Link>
			</li>
		);
	});

	return (
		<nav className={styles.navbar}>
			<div className={styles.left}>
				<Link to='/'>
					<div className={styles.logo}>
						<svg
							viewBox='0 0 36 36'
							fill='url(#jsc_c_2)'
							height='40'
							width='40'
						>
							<defs>
								<linearGradient
									x1='50%'
									x2='50%'
									y1='97.0782153%'
									y2='0%'
									id='jsc_c_2'
								>
									<stop offset='0%' stopColor='#0062E0'></stop>
									<stop offset='100%' stopColor='#19AFFF'></stop>
								</linearGradient>
							</defs>
							<path d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z'></path>
							<path
								className={styles.logo_f}
								d='M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
							></path>
						</svg>
					</div>
				</Link>
				<div className={styles.search_posts}>
					<form onSubmit={(e) => handleSearch(e, searchInput)}>
						<label>
							<span>
								<svg viewBox='0 0 16 16' width='16' height='16'>
									<g transform='translate(-448 -544)'>
										<g>
											<path
												d='M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z'
												transform='translate(448 544)'
											></path>
											<path
												d='M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z'
												transform='translate(448 544)'
											></path>
											<path
												d='M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z'
												transform='translate(448 544)'
											></path>
											<path
												d='m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z'
												transform='translate(448 544)'
											></path>
										</g>
									</g>
								</svg>
							</span>
							<input
								type='text'
								id='search_posts'
								name='search_posts'
								minLength={1}
								maxLength={512}
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder='Search Posts'
							/>
							<button
								type='button'
								style={{
									visibility: searchInput || showResults ? 'visible' : 'hidden',
								}}
								className={styles.clear_btn}
								onClick={(e) => clearSearch(e)}
							>
								<span></span>
							</button>
						</label>
					</form>
					{showResults && searchDisplay.length > 0 ? (
						<div ref={searchRef} className={styles.search_results_container}>
							<ul>{searchDisplay}</ul>
						</div>
					) : null}
				</div>
			</div>
			<div className={styles.center}>
				<ul className={styles.navigation}>
					<li>
						<NavLink
							to='/'
							className={({ isActive }) => (isActive ? styles.isActive : '')}
						>
							<span>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg1}
								>
									<path d='M17.5 23.979 21.25 23.979C21.386 23.979 21.5 23.864 21.5 23.729L21.5 13.979C21.5 13.427 21.949 12.979 22.5 12.979L24.33 12.979 14.017 4.046 3.672 12.979 5.5 12.979C6.052 12.979 6.5 13.427 6.5 13.979L6.5 23.729C6.5 23.864 6.615 23.979 6.75 23.979L10.5 23.979 10.5 17.729C10.5 17.04 11.061 16.479 11.75 16.479L16.25 16.479C16.939 16.479 17.5 17.04 17.5 17.729L17.5 23.979ZM21.25 25.479 17 25.479C16.448 25.479 16 25.031 16 24.479L16 18.327C16 18.135 15.844 17.979 15.652 17.979L12.348 17.979C12.156 17.979 12 18.135 12 18.327L12 24.479C12 25.031 11.552 25.479 11 25.479L6.75 25.479C5.784 25.479 5 24.695 5 23.729L5 14.479 3.069 14.479C2.567 14.479 2.079 14.215 1.868 13.759 1.63 13.245 1.757 12.658 2.175 12.29L13.001 2.912C13.248 2.675 13.608 2.527 13.989 2.521 14.392 2.527 14.753 2.675 15.027 2.937L25.821 12.286C25.823 12.288 25.824 12.289 25.825 12.29 26.244 12.658 26.371 13.245 26.133 13.759 25.921 14.215 25.434 14.479 24.931 14.479L23 14.479 23 23.729C23 24.695 22.217 25.479 21.25 25.479Z'></path>
								</svg>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg2}
								>
									<path d='M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079 14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825 12.29'></path>
								</svg>
							</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/friends'
							className={({ isActive }) => (isActive ? styles.isActive : '')}
						>
							<span>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg1}
								>
									<path d='M10.5 4.5c-2.272 0-2.75 1.768-2.75 3.25C7.75 9.542 8.983 11 10.5 11s2.75-1.458 2.75-3.25c0-1.482-.478-3.25-2.75-3.25zm0 8c-2.344 0-4.25-2.131-4.25-4.75C6.25 4.776 7.839 3 10.5 3s4.25 1.776 4.25 4.75c0 2.619-1.906 4.75-4.25 4.75zm9.5-6c-1.41 0-2.125.841-2.125 2.5 0 1.378.953 2.5 2.125 2.5 1.172 0 2.125-1.122 2.125-2.5 0-1.659-.715-2.5-2.125-2.5zm0 6.5c-1.999 0-3.625-1.794-3.625-4 0-2.467 1.389-4 3.625-4 2.236 0 3.625 1.533 3.625 4 0 2.206-1.626 4-3.625 4zm4.622 8a.887.887 0 00.878-.894c0-2.54-2.043-4.606-4.555-4.606h-1.86c-.643 0-1.265.148-1.844.413a6.226 6.226 0 011.76 4.336V21h5.621zm-7.122.562v-1.313a4.755 4.755 0 00-4.749-4.749H8.25A4.755 4.755 0 003.5 20.249v1.313c0 .518.421.938.937.938h12.125c.517 0 .938-.42.938-.938zM20.945 14C24.285 14 27 16.739 27 20.106a2.388 2.388 0 01-2.378 2.394h-5.81a2.44 2.44 0 01-2.25 1.5H4.437A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.25 14h4.501a6.2 6.2 0 013.218.902A5.932 5.932 0 0119.084 14h1.861z'></path>
								</svg>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg2}
								>
									<path d='M20.34 22.428c.077-.455.16-1.181.16-2.18 0-1.998-.84-3.981-2.12-5.41-.292-.326-.077-.838.36-.838h2.205C24.284 14 27 16.91 27 20.489c0 1.385-1.066 2.51-2.378 2.51h-3.786a.496.496 0 01-.495-.571zM20 13c-1.93 0-3.5-1.794-3.5-4 0-2.467 1.341-4 3.5-4s3.5 1.533 3.5 4c0 2.206-1.57 4-3.5 4zm-9.5-1c-2.206 0-4-2.019-4-4.5 0-2.818 1.495-4.5 4-4.5s4 1.682 4 4.5c0 2.481-1.794 4.5-4 4.5zm2.251 2A6.256 6.256 0 0119 20.249v1.313A2.44 2.44 0 0116.563 24H4.438A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.249 14h4.502z'></path>
								</svg>
							</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/'
							className={({ isActive }) => (isActive ? styles.isActive : '')}
						>
							<span>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg1}
								>
									<path d='M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z'></path>
								</svg>
								<svg
									viewBox='0 0 28 28'
									height='28'
									width='28'
									className={styles.svg2}
								>
									<path d='M21.877 19 21.364 19C21.139 19 20.971 18.802 20.996 18.577 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.066 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.877 19ZM17.75 10.75C17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13 18.647 13 17.75 11.991 17.75 10.75ZM19.5 18.221C19.5 19.202 18.682 20 17.678 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.442 13.5 12.828 13.5L15.173 13.5C17.559 13.5 19.5 15.395 19.5 17.724L19.5 18.221ZM6.25 10.75C6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13 7.147 13 6.25 11.991 6.25 10.75ZM7.934 14.591C7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.991 18.461 7.004 18.577 7.03 18.802 6.861 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14L7.631 14C7.933 14 8.102 14.338 7.934 14.591ZM14 6C15.697 6 16.75 7.15 16.75 9 16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6ZM14 1C6.832 1 1 6.832 1 14 1 21.169 6.832 27 14 27 21.169 27 27 21.169 27 14 27 6.832 21.169 1 14 1Z'></path>
								</svg>
							</span>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className={styles.right}>
				<ul className={styles.user_controls}>
					<li
						id='menu-1'
						tabIndex={0}
						className={styles.account}
						onClick={(e) => toggleMenu(e, 1)}
					>
						<span
							className={`${styles.icon} ${
								openMenuId === 1 ? 'btn-active' : ''
							}`}
						>
							<svg viewBox='0 0 20 20' width='20' height='20'>
								<path d='M10 14a1 1 0 0 1-.755-.349L5.329 9.182a1.367 1.367 0 0 1-.205-1.46A1.184 1.184 0 0 1 6.2 7h7.6a1.18 1.18 0 0 1 1.074.721 1.357 1.357 0 0 1-.2 1.457l-3.918 4.473A1 1 0 0 1 10 14z'></path>
							</svg>
						</span>
					</li>
					<li
						id='menu-2'
						tabIndex={0}
						className={styles.notifications}
						onClick={(e) => toggleMenu(e, 2)}
					>
						<span
							className={`${styles.icon} ${
								openMenuId === 2 ? 'btn-active' : ''
							}`}
						>
							<svg viewBox='0 0 28 28' height='20' width='20'>
								<path d='M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z'></path>
							</svg>
						</span>
						{notificationAlert > 0 ? (
							<span className={styles.notification_alert}></span>
						) : null}
					</li>
					<li
						id='menu-3'
						tabIndex={0}
						className={styles.messenger}
						onClick={(e) => toggleMenu(e, 3)}
					>
						<span
							className={`${styles.icon} ${
								openMenuId === 3 ? 'btn-active' : ''
							}`}
						>
							<svg viewBox='0 0 28 28' height='20' width='20'>
								<path d='M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z'></path>
							</svg>
						</span>
					</li>
					<li
						id='menu-4'
						tabIndex={0}
						className={styles.main_menu}
						onClick={(e) => toggleMenu(e, 4)}
					>
						<span
							className={`${styles.icon} ${
								openMenuId === 4 ? 'btn-active' : ''
							}`}
						>
							<svg viewBox='0 0 44 44' width='20' height='20'>
								<circle cx='7' cy='7' r='6'></circle>
								<circle cx='22' cy='7' r='6'></circle>
								<circle cx='37' cy='7' r='6'></circle>
								<circle cx='7' cy='22' r='6'></circle>
								<circle cx='22' cy='22' r='6'></circle>
								<circle cx='37' cy='22' r='6'></circle>
								<circle cx='7' cy='37' r='6'></circle>
								<circle cx='22' cy='37' r='6'></circle>
								<circle cx='37' cy='37' r='6'></circle>
							</svg>
						</span>
					</li>
					<li>
						<NavLink
							to={`/profile/${user._id}`}
							className={({ isActive }) =>
								isActive ? `${styles.me_link} btn-active` : styles.me_link
							}
						>
							<div className='profile-pic-style'>
								<img
									src={
										user.profile_picture
											? `http://localhost:4000/photos/${user.profile_picture}`
											: '/placeholder_profile_pic.png'
									}
									alt='User profile pic'
								/>
							</div>
							<h4>{user.first_name}</h4>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/friends'
							className={({ isActive }) =>
								isActive
									? `${styles.friends_link} btn-active`
									: styles.friends_link
							}
						>
							<h5>Find Friends</h5>
						</NavLink>
					</li>
				</ul>
				{!openMenuContainer ? null : (
					<div ref={menuContainerRef} className={styles.menu_container}>
						{openMenuId === 1 ? <AccountMenu /> : null}
						{openMenuId === 2 ? (
							<NotificationsMenu setNotificationAlert={setNotificationAlert} />
						) : null}
						{openMenuId === 3 ? <MessengerMenu /> : null}
						{openMenuId === 4 ? <MainMenu /> : null}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
