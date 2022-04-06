import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from './hooks/UserProvider';
import { io } from 'socket.io-client';
import type { SocketType } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import AccountMenu from './menus/AccountMenu';
import NotificationsMenu from './menus/NotificationsMenu';
import MessengerMenu from './menus/MessengerMenu';
import MainMenu from './menus/MainMenu';
import styles from '../styles/NavbarRight.module.scss';

const NavbarRight = () => {
	const { user } = useContext(UserContext);

	const location = useLocation();

	const menuContainerRef = useRef<HTMLDivElement>(null);

	const [openMenuContainer, setOpenMenuContainer] = useState(false);
	const [openMenuId, setOpenMenuId] = useState<number>(0);

	const [messageAlert, setMessageAlert] = useState(false);
	const [notificationAlert, setNotificationAlert] = useState(false);

	const [socket, setSocket] = useState<SocketType | null>(null);

	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_API_URI}/notifications`, {
			withCredentials: true,
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on('oops', (error) => {
			console.error(error);
		});

		socket.emit('subscribe_alerts');

		socket.on('notification_alert', () => {
			setNotificationAlert(true);
		});

		socket.on('message_alert', () => {
			setMessageAlert(true);
		});

		return () => {
			socket.off();
		};
	}, [socket, openMenuId]);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts', {
					signal: controller.signal,
				});
				if (resData.incoming_friend_requests.length > 0) {
					setNotificationAlert(true);
				} else {
					setNotificationAlert(false);
				}
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [user]);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				const newMessages = await axiosGet('/api/chats/messages/new', {
					signal: controller.signal,
				});
				if (newMessages.length > 0) {
					setMessageAlert(true);
				}
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		setOpenMenuContainer(false);
		setOpenMenuId(0);
	}, [location]);

	const toggleMenu = (
		e: React.MouseEvent<HTMLLIElement>,
		menuNumber: number
	) => {
		if (!openMenuContainer) {
			setOpenMenuContainer(true);
			setOpenMenuId(menuNumber);
			if (menuNumber === 3) {
				setMessageAlert(false);
			}
			if (menuNumber === 2) {
				setNotificationAlert(false);
			}
			document.addEventListener('click', closeMenuContainerListener);
			return;
		}
		if (openMenuContainer && openMenuId === menuNumber) {
			setOpenMenuContainer(false);
			setOpenMenuId(0);
			document.removeEventListener('click', closeMenuContainerListener);
			return;
		}
		setOpenMenuId(menuNumber);
	};

	const closeMenuContainerListener = (e: any) => {
		e.stopPropagation();
		if (
			!menuContainerRef.current?.contains(e.target) &&
			!e.target.closest('li')?.id.includes('menu-')
		) {
			setOpenMenuContainer(false);
			setOpenMenuId(0);
			document.removeEventListener('click', closeMenuContainerListener);
		}
	};

	return (
		user && (
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
						{notificationAlert && (
							<span className={styles.notification_alert}></span>
						)}
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
						{messageAlert && <span className={styles.messenger_alert}></span>}
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
										user.profile_picture_url || '/placeholder_profile_pic.png'
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
						{openMenuId === 1 && <AccountMenu />}
						{openMenuId === 2 && (
							<NotificationsMenu alert={notificationAlert} />
						)}
						{openMenuId === 3 && <MessengerMenu alert={messageAlert} />}
						{openMenuId === 4 && <MainMenu />}
					</div>
				)}
			</div>
		)
	);
};

export default NavbarRight;
