import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import type { User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import styles from '../styles/ProfileMain.module.scss';
import EditProfileModal from './EditProfileModal';

const Profile = () => {
	const { user } = useContext(UserContext);

	const params = useParams();

	const optionsRef = useRef(null);

	const [userData, setUserData] = useState<User>();
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setUserData(await axiosGet(`/api/users/${params.userid}`));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params.userid]);

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(false);
	};

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowListener);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const handleBlockStatus = async (userId: string) => {
		try {
			const resData = await axiosPut(`/api/users/block`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (userId: string) => {
		try {
			const resData = await axiosPut(`/api/users/friends/remove`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (userId: string) => {
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleAcceptRequest = async (userId: string) => {
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleSendRequest = async (userId: string) => {
		try {
			const resData = await axiosPut(`/api/users/friends/request`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div className={styles.profile_page}>
			<div className={styles.profile_page_main}>
				<div className={styles.top}>
					<div className={styles.cover_photo}>
						<span className={styles.shade}></span>
					</div>
					<div className={styles.pic_name_edit}>
						<div className={styles.left}>
							<Link to={`/profile/${userData?._id}`}>
								<div className='profile-pic-style'>
									<img
										src='/placeholder_profile_pic.png'
										alt='User profile pic'
									/>
								</div>
							</Link>
							<h2>{userData?.full_name}</h2>
						</div>
						{userData?._id === user._id ? (
							<div className={styles.right}>
								<div className={styles.edit_controls}>
									<div
										className={`btn-default btn-confirm ${styles.edit_btn}`}
										onClick={openModal}
									>
										Edit Profile
									</div>
								</div>
							</div>
						) : null}
					</div>
				</div>
				<hr />
				<div className={styles.bottom}>
					<ul className={styles.pages}>
						<li>
							<NavLink
								to='./'
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
					</ul>
					{userData ? (
						userData._id === user._id ? null : (
							<div className={styles.user_controls}>
								{user._id && userData ? (
									userData.blocked_by_other_list.includes(user._id) ? (
										<div
											className={`btn-default btn-disabled btn-w180 ${styles.blocked}`}
											onClick={() => handleBlockStatus(userData._id)}
										>
											<span>Blocked User</span>
										</div>
									) : userData.blocked_user_list.includes(user._id) ? (
										<div className='btn-default btn-disabled btn-w180'>
											Blocked by User
										</div>
									) : userData.friend_list.includes(user._id) ? (
										<div
											className={`btn-default btn-confirm btn-w180 ${styles.friend}`}
											onClick={() => handleRemoveFriend(userData._id)}
										>
											<span>Friends</span>
										</div>
									) : userData.incoming_friend_requests.includes(user._id) ? (
										<div
											className={`btn-default btn-active btn-w180 ${styles.sent}`}
											onClick={() => handleCancelRequest(userData._id)}
										>
											<span>Request Sent</span>
										</div>
									) : userData.outgoing_friend_requests.includes(user._id) ? (
										<div
											className='btn-default btn-confirm btn-w180'
											onClick={() => handleAcceptRequest(userData._id)}
										>
											Accept Request
										</div>
									) : (
										<div
											className='btn-default btn-confirm btn-w180'
											onClick={() => handleSendRequest(userData._id)}
										>
											Add Friend
										</div>
									)
								) : null}
								<div className='btn-default btn-remove'>Message</div>
								<span
									className={`btn-default btn-remove ${styles.options_toggle}`}
									onClick={toggleOptions}
								>
									<svg viewBox='0 0 20 20' width='20' height='20'>
										<g transform='translate(-446 -350)'>
											<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
										</g>
									</svg>
								</span>
								{showOptions && user._id && userData ? (
									<div ref={optionsRef} className={styles.options_menu}>
										{userData.incoming_friend_requests.includes(user._id) ? (
											<div
												className={styles.cancel_btn}
												onClick={() => handleCancelRequest(userData._id)}
											>
												Cancel request
											</div>
										) : null}
										{userData.outgoing_friend_requests.includes(user._id) ? (
											<div
												className={styles.cancel_btn}
												onClick={(e) => handleCancelRequest(userData._id)}
											>
												Decline request
											</div>
										) : null}
										{userData.friend_list.includes(user._id) ? (
											<div
												className={styles.cancel_btn}
												onClick={(e) => handleRemoveFriend(userData._id)}
											>
												Remove friend
											</div>
										) : (
											<div
												className={styles.cancel_btn}
												onClick={(e) => handleRemoveFriend(userData._id)}
											>
												Add friend
											</div>
										)}
										{userData.blocked_by_other_list.includes(user._id) ? (
											<div
												className={styles.block_btn}
												onClick={(e) => handleBlockStatus(userData._id)}
											>
												Unblock user
											</div>
										) : (
											<div
												className={styles.block_btn}
												onClick={(e) => handleBlockStatus(userData._id)}
											>
												Block user
											</div>
										)}
									</div>
								) : null}
							</div>
						)
					) : null}
				</div>
			</div>
			{showModal && userData ? (
				<EditProfileModal
					closeModal={closeModal}
					setData={setUserData}
					data={userData}
				/>
			) : null}
		</div>
	);
};

export default Profile;
