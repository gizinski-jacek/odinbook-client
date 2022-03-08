import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import type { User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import styles from '../styles/ProfileMain.module.scss';

const Profile = () => {
	const { user } = useContext(UserContext);

	const params = useParams();

	const [userData, setUserData] = useState<User>();
	const [showOptions, setShowOptions] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setUserData(await axiosGet(`/api/users/${params.userid}`));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params.userid]);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowListener);
	};

	const closeOptions = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowOptions(false);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (!e.target.className.includes('options_menu')) {
			document.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const handleSendRequest = async (userId: string | undefined) => {
		try {
			const resData = await axiosPut(`/api/users/friends/request`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (requestId: string | undefined) => {
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				requestId,
			});
			const data = resData.find((u: User) => u._id === requestId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleAcceptRequest = async (requestId: string | undefined) => {
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				requestId,
			});
			const data = resData.find((u: User) => u._id === requestId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (userId: string | undefined) => {
		try {
			const resData = await axiosPut(`/api/users/friends/remove`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleBlockStatus = async (userId: string | undefined) => {
		try {
			const resData = await axiosPut(`/api/users/block`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div className={styles.profile_page}>
			<div className={styles.profile_page_main}>
				<div className={styles.cover_photo}>
					<div className='profile-pic-style'>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</div>
				</div>
				<h2>{userData?.full_name}</h2>
				<hr />
				<div className={styles.controls}>
					<ul className={styles.left}>
						<li>
							<NavLink
								to='.'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Posts
							</NavLink>
						</li>
						<li>
							<NavLink
								to='about'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								About
							</NavLink>
						</li>
						<li>
							<NavLink
								to='friends'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Friends
							</NavLink>
						</li>
						<li>
							<NavLink
								to='photos'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Photos
							</NavLink>
						</li>
						<li>
							<NavLink
								to='videos'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Videos
							</NavLink>
						</li>
					</ul>
					<div className={styles.right}>
						{(user._id && userData?.blocked_user_list.includes(user._id)) ||
						(user._id && userData?.blocked_by_other_list.includes(user._id)) ? (
							<div className='btn-default btn-disabled btn-w180'>Blocked</div>
						) : user._id &&
						  userData?.incoming_friend_requests.includes(user._id) ? (
							<div
								className={`btn-default btn-active btn-w180 ${styles.sent}`}
								onClick={() => handleCancelRequest(userData?._id)}
							>
								<span>Request Sent</span>
							</div>
						) : user._id &&
						  userData?.outgoing_friend_requests.includes(user._id) ? (
							<div
								className='btn-default btn-confirm btn-w180'
								onClick={() => handleAcceptRequest(userData?._id)}
							>
								Accept Request
							</div>
						) : user._id && userData?.friend_list.includes(user._id) ? (
							<div
								className={`btn-default btn-confirm btn-w180 ${styles.friend}`}
								onClick={() => handleRemoveFriend(userData?._id)}
							>
								<span>Friend</span>
							</div>
						) : (
							<div
								className='btn-default btn-confirm btn-w180'
								onClick={() => handleSendRequest(userData?._id)}
							>
								Add Friend
							</div>
						)}
						<div className='btn-default btn-remove'>Message</div>
						<span
							className={`btn-default btn-remove ${styles.options_toggle}`}
							onClick={(e) => toggleOptions(e)}
						>
							<svg viewBox='0 0 20 20' width='20' height='20'>
								<g transform='translate(-446 -350)'>
									<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
								</g>
							</svg>
						</span>
						{showOptions ? (
							<div className={styles.options_menu}>
								{user._id &&
								userData?.incoming_friend_requests.includes(user._id) ? (
									<div
										className={styles.cancel_btn}
										onClick={() => handleCancelRequest(userData?._id)}
									>
										Cancel request
									</div>
								) : null}
								{user._id &&
								userData?.outgoing_friend_requests.includes(user._id) ? (
									<div
										className={styles.cancel_btn}
										onClick={(e) => {
											handleCancelRequest(userData?._id);
											closeOptions(e);
										}}
									>
										Decline request
									</div>
								) : null}
								{user._id && userData?.friend_list.includes(user._id) ? (
									<div
										className={styles.cancel_btn}
										onClick={(e) => {
											handleRemoveFriend(userData?._id);
											closeOptions(e);
										}}
									>
										Remove friend
									</div>
								) : null}
								{user._id &&
								userData?.blocked_by_other_list.includes(user._id) ? (
									<div
										className={styles.block_btn}
										onClick={(e) => {
											handleBlockStatus(userData?._id);
											closeOptions(e);
										}}
									>
										Unblock user
									</div>
								) : (
									<div
										className={styles.block_btn}
										onClick={(e) => {
											handleBlockStatus(userData?._id);
											closeOptions(e);
										}}
									>
										Block user
									</div>
								)}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
