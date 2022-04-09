import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { UserContext } from './hooks/UserProvider';
import type { FormError, User } from './utils/myTypes';
import { axiosDelete, axiosGet, axiosPut } from './utils/axiosFunctions';
import EditProfileModal from './modals/EditProfileModal';
import FormErrorWrapper from './utils/wrappers/FormErrorWrapper';
import styles from '../styles/ProfileMain.module.scss';

const Profile = () => {
	const { user, updateUser } = useContext(UserContext);

	const params = useParams();

	const optionsRef = useRef<HTMLDivElement>(null);

	const [profileData, setProfileData] = useState<User>();
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState<FormError[]>([]);
	const [changePassword, setChangePassword] = useState(false);
	const [passwordData, setPasswordData] = useState({ password: '' });

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				setProfileData(
					await axiosGet(`/api/users/${params.userid}`, {
						signal: controller.signal,
					})
				);
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [params.userid]);

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeModal = (
		e:
			| React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
			| React.FormEvent<HTMLFormElement>
	) => {
		e.stopPropagation();
		setShowModal(false);
	};

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', closeOptionsListener);
	};

	const closeOptionsListener = (e: any) => {
		e.stopPropagation();
		if (e.target.closest('div') !== optionsRef.current) {
			document.removeEventListener('click', closeOptionsListener);
			setShowOptions(false);
		}
	};

	const handleBlockStatus = async (
		e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
		userId: string
	) => {
		try {
			const resData: User[] = await axiosPut(`/api/users/block`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setProfileData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (
		e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData: User[] = await axiosPut(`/api/users/friends/remove`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setProfileData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
		userId: string
	) => {
		try {
			const resData: User[] = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setProfileData(data);
			setShowOptions(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		try {
			const resData: User[] = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setProfileData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleSendRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		try {
			const resData: User[] = await axiosPut(`/api/users/friends/request`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setProfileData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const toggleInput = (e: React.MouseEvent<HTMLButtonElement>) => {
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
			const resData: User = await axiosDelete(
				`/api/users/picture/${pictureId}`
			);
			setProfileData(resData);
			updateUser(resData);
		} catch (error: any) {
			console.error(error);
		}
	};

	const errorsDisplay = errors.map((error, index) => {
		return <FormErrorWrapper key={index} error={error} />;
	});

	return (
		user && (
			<div className={styles.profile_page}>
				<div className={styles.profile_page_main}>
					<div className={styles.top}>
						<span className={styles.shade}></span>
						<div className={styles.user_panel}>
							<div className={styles.user_info}>
								<div className={styles.pic_wrapper}>
									<div className='profile-pic-style'>
										<img
											src={
												profileData?.profile_picture_url ||
												'/placeholder_profile_pic.png'
											}
											alt='User profile pic'
										/>
										{profileData?._id === user._id &&
											profileData.profile_picture_name && (
												<button
													type='button'
													className={styles.delete_btn}
													onClick={(e) =>
														handlePictureDelete(
															e,
															profileData.profile_picture_name
														)
													}
												>
													<span></span>
												</button>
											)}
									</div>
								</div>
								<h2>
									{profileData?.first_name} {profileData?.last_name}
								</h2>
							</div>
							{profileData?._id === user._id && (
								<div className={styles.user_edit_profile_controls}>
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
												onClick={(e) => toggleInput(e)}
											>
												Cancel
											</button>
										</form>
									) : (
										<div className={styles.profile_controls}>
											<button
												type='button'
												className={`btn-default btn-confirm ${styles.change_password_btn}`}
												onClick={(e) => toggleInput(e)}
											>
												Change Password
											</button>
											<button
												type='button'
												className={`btn-default btn-confirm ${styles.edit_btn}`}
												onClick={(e) => openModal(e)}
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
									className={({ isActive }) =>
										isActive ? styles.isActive : ''
									}
								>
									Posts
								</NavLink>
							</li>
							<li>
								<NavLink
									to='friends'
									className={({ isActive }) =>
										isActive ? styles.isActive : ''
									}
								>
									Friends
								</NavLink>
							</li>
						</ul>
						{profileData &&
							(profileData._id === user._id ? null : (
								<div className={styles.user_controls}>
									{user._id &&
										profileData &&
										(profileData.blocked_by_other_list.includes(user._id) ? (
											<button
												type='button'
												className={`btn-default btn-disabled btn-w180 ${styles.blocked}`}
												onClick={(e) => handleBlockStatus(e, profileData._id)}
											></button>
										) : profileData.blocked_user_list.includes(user._id) ? (
											<button
												type='button'
												className={`btn-default btn-disabled btn-w180 ${styles.blocked_by}`}
											></button>
										) : profileData.friend_list.includes(user._id) ? (
											<button
												type='button'
												className={`btn-default btn-confirm btn-w180 ${styles.friend}`}
												onClick={(e) => handleRemoveFriend(e, profileData._id)}
											></button>
										) : profileData.incoming_friend_requests.includes(
												user._id
										  ) ? (
											<button
												type='button'
												className={`btn-default btn-active btn-w180 ${styles.sent}`}
												onClick={(e) => handleCancelRequest(e, profileData._id)}
											></button>
										) : profileData.outgoing_friend_requests.includes(
												user._id
										  ) ? (
											<button
												type='button'
												className={`btn-default btn-confirm btn-w180 ${styles.request}`}
												onClick={(e) => handleAcceptRequest(e, profileData._id)}
											></button>
										) : (
											<button
												type='button'
												className={`btn-default btn-confirm btn-w180 ${styles.not_friend}`}
												onClick={(e) => handleSendRequest(e, profileData._id)}
											></button>
										))}
									<div ref={optionsRef} className={styles.right}>
										<span
											className={styles.options_toggle}
											onClick={(e) => toggleOptions(e)}
										>
											<svg viewBox='0 0 20 20' width='20' height='20'>
												<g transform='translate(-446 -350)'>
													<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
												</g>
											</svg>
										</span>
										{showOptions && user._id && profileData && (
											<div className={styles.options_menu}>
												{profileData.incoming_friend_requests.includes(
													user._id
												) && (
													<div
														className={styles.cancel_btn}
														onClick={(e) =>
															handleCancelRequest(e, profileData._id)
														}
													>
														Cancel request
													</div>
												)}
												{profileData.outgoing_friend_requests.includes(
													user._id
												) && (
													<div
														className={styles.cancel_btn}
														onClick={(e) =>
															handleCancelRequest(e, profileData._id)
														}
													>
														Decline request
													</div>
												)}
												{profileData.friend_list.includes(user._id) ? (
													<div
														className={styles.cancel_btn}
														onClick={(e) =>
															handleRemoveFriend(e, profileData._id)
														}
													>
														Remove friend
													</div>
												) : (
													<div
														className={styles.cancel_btn}
														onClick={(e) =>
															handleRemoveFriend(e, profileData._id)
														}
													>
														Add friend
													</div>
												)}
												{profileData.blocked_by_other_list.includes(
													user._id
												) ? (
													<div
														className={styles.block_btn}
														onClick={(e) =>
															handleBlockStatus(e, profileData._id)
														}
													>
														Unblock user
													</div>
												) : (
													<div
														className={styles.block_btn}
														onClick={(e) =>
															handleBlockStatus(e, profileData._id)
														}
													>
														Block user
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
				{showModal && profileData && (
					<EditProfileModal
						closeModal={closeModal}
						setData={setProfileData}
						data={profileData}
					/>
				)}
			</div>
		)
	);
};

export default Profile;
