import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import type { FormError, User } from '../myTypes';
import { axiosDelete, axiosGet, axiosPut } from './utils/axiosFunctions';
import styles from '../styles/ProfileMain.module.scss';
import EditProfileModal from './EditProfileModal';
import FormErrorWrapper from './utils/FormErrorWrapper';

const Profile = () => {
	const { user, setUser } = useContext(UserContext);

	const params = useParams();

	const optionsRef = useRef<HTMLDivElement>(null);

	const [userData, setUserData] = useState<User>();
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState<FormError[]>([]);
	const [changePassword, setChangePassword] = useState(false);
	const [passwordData, setPasswordData] = useState({ password: '' });

	useEffect(() => {
		(async () => {
			try {
				setUserData(await axiosGet(`/api/users/${params.userid}`));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params]);

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeModal = (
		e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>
	) => {
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

	const toggleInput = (e: any) => {
		e.stopPropagation();
		setChangePassword((prevState) => !prevState);
		setPasswordData({ password: '' });
		setErrors([]);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handlePasswordChange = async (
		e: React.FormEvent<HTMLFormElement>,
		data: { password: string }
	) => {
		e.preventDefault();
		try {
			await axiosPut('/api/users/password-change', data);
			setChangePassword(false);
		} catch (error: any) {
			if (!Array.isArray(error.response.data)) {
				if (typeof error.response.data === 'object') {
					setErrors([error.response.data]);
					return;
				}
				if (typeof error.response.data === 'string') {
					setErrors([{ msg: error.response.data }]);
					return;
				}
			} else {
				setErrors(error.response.data);
			}
		}
	};

	const handlePictureDelete = async (
		e: React.MouseEvent<HTMLButtonElement>,
		pictureId: string
	) => {
		e.preventDefault();
		try {
			const resData = await axiosDelete(`/api/users/picture/${pictureId}`);
			setUserData(resData);
			setUser(resData);
		} catch (error: any) {
			console.error(error);
		}
	};

	const errorsDisplay = errors.map((error, index) => {
		return <FormErrorWrapper key={index} error={error} />;
	});

	return (
		<div className={styles.profile_page}>
			<div className={styles.profile_page_main}>
				<div className={styles.top}>
					<span className={styles.shade}></span>
					<div className={styles.user_panel}>
						<div className={styles.left}>
							<div className={styles.pic_wrapper}>
								<div className='profile-pic-style'>
									<img
										src={
											userData?.profile_picture
												? `http://localhost:4000/photos/${userData.profile_picture}`
												: '/placeholder_profile_pic.png'
										}
										alt='User profile pic'
									/>
									{userData?._id === user._id && userData.profile_picture && (
										<button
											type='button'
											className={styles.delete_btn}
											onClick={(e) =>
												handlePictureDelete(e, userData.profile_picture)
											}
										>
											<span></span>
										</button>
									)}
								</div>
							</div>
							<h2>
								{userData?.first_name} {userData?.last_name}
							</h2>
						</div>
						{userData?._id === user._id && (
							<div className={styles.right}>
								{changePassword ? (
									<form
										className={styles.change_password_form}
										onSubmit={(e) => handlePasswordChange(e, passwordData)}
									>
										{errorsDisplay.length > 0 && (
											<ul className='error-list'>{errorsDisplay}</ul>
										)}
										<input
											type='password'
											id='password'
											name='password'
											minLength={8}
											maxLength={64}
											value={passwordData.password}
											onChange={handleChange}
											required
											placeholder='New password'
										/>

										<button className='btn-default btn-confirm'>Save</button>
										<button
											className='btn-default btn-decline'
											onClick={toggleInput}
										>
											Cancel
										</button>
									</form>
								) : (
									<div className={styles.profile_controls}>
										<button
											type='button'
											className={`btn-default btn-confirm ${styles.change_password_btn}`}
											onClick={toggleInput}
										>
											Change Password
										</button>
										<button
											type='button'
											className={`btn-default btn-confirm ${styles.edit_btn}`}
											onClick={openModal}
										>
											Edit Profile
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<hr />
				<div className={styles.bottom}>
					<ul className={styles.pages}>
						<li>
							<NavLink
								to='.'
								end
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Posts
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
					{userData &&
						(userData._id === user._id ? null : (
							<div className={styles.user_controls}>
								{user._id &&
									userData &&
									(userData.blocked_by_other_list.includes(user._id) ? (
										<button
											type='button'
											className={`btn-default btn-disabled btn-w180 ${styles.blocked}`}
											onClick={() => handleBlockStatus(userData._id)}
										>
											<span>Blocked User</span>
										</button>
									) : userData.blocked_user_list.includes(user._id) ? (
										<button
											type='button'
											className='btn-default btn-disabled btn-w180'
										>
											Blocked by User
										</button>
									) : userData.friend_list.includes(user._id) ? (
										<button
											type='button'
											className={`btn-default btn-confirm btn-w180 ${styles.friend}`}
											onClick={() => handleRemoveFriend(userData._id)}
										>
											<span>Friends</span>
										</button>
									) : userData.incoming_friend_requests.includes(user._id) ? (
										<button
											type='button'
											className={`btn-default btn-active btn-w180 ${styles.sent}`}
											onClick={() => handleCancelRequest(userData._id)}
										>
											<span>Request Sent</span>
										</button>
									) : userData.outgoing_friend_requests.includes(user._id) ? (
										<button
											type='button'
											className='btn-default btn-confirm btn-w180'
											onClick={() => handleAcceptRequest(userData._id)}
										>
											Accept Request
										</button>
									) : (
										<button
											type='button'
											className='btn-default btn-confirm btn-w180'
											onClick={() => handleSendRequest(userData._id)}
										>
											Add Friend
										</button>
									))}
								<button type='button' className='btn-default btn-decline'>
									Message
								</button>
								<span className={styles.options_toggle} onClick={toggleOptions}>
									<svg viewBox='0 0 20 20' width='20' height='20'>
										<g transform='translate(-446 -350)'>
											<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
										</g>
									</svg>
								</span>
								{showOptions && user._id && userData && (
									<div ref={optionsRef} className={styles.options_menu}>
										{userData.incoming_friend_requests.includes(user._id) && (
											<div
												className={styles.cancel_btn}
												onClick={() => handleCancelRequest(userData._id)}
											>
												Cancel request
											</div>
										)}
										{userData.outgoing_friend_requests.includes(user._id) && (
											<div
												className={styles.cancel_btn}
												onClick={(e) => handleCancelRequest(userData._id)}
											>
												Decline request
											</div>
										)}
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
								)}
							</div>
						))}
				</div>
			</div>
			{showModal && userData && (
				<EditProfileModal
					closeModal={closeModal}
					setData={setUserData}
					data={userData}
				/>
			)}
		</div>
	);
};

export default Profile;
