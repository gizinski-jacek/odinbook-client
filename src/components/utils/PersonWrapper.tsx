import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import type { User } from '../../myTypes';
import { axiosPut } from './axiosFunctions';
import styles from '../../styles/Person.module.scss';

type Props = {
	person: User;
};

const PersonWrapper: React.FC<Props> = ({ person }) => {
	const { user } = useContext(UserContext);

	const [userData, setUserData] = useState<User>(person);

	const handleBlockStatus = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/block`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/remove`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
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

	const handleSendRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/request`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setUserData(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	return user && userData ? (
		<li className={styles.person}>
			<Link to={`/profile/${userData._id}`}>
				<div className={styles.pic_link}>
					<img
						src={
							userData.profile_picture
								? `http://localhost:4000/photos/users/${userData.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
				<h4>
					{userData.first_name} {userData.last_name}
				</h4>
			</Link>
			<div className={styles.controls}>
				{user._id &&
					(userData.blocked_by_other_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-disabled ${styles.blocked}`}
							onClick={(e) => handleBlockStatus(e, userData._id)}
						></button>
					) : userData.blocked_user_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-disabled ${styles.blocked_by}`}
						></button>
					) : userData.friend_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-confirm ${styles.friend}`}
							onClick={(e) => handleRemoveFriend(e, userData._id)}
						></button>
					) : userData.incoming_friend_requests.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-active ${styles.sent}`}
							onClick={(e) => handleCancelRequest(e, userData._id)}
						></button>
					) : userData.outgoing_friend_requests.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-active ${styles.request}`}
							onClick={(e) => handleAcceptRequest(e, userData._id)}
						></button>
					) : userData._id === user._id ? null : (
						<button
							type='button'
							className={`btn-default btn-confirm ${styles.not_friend}`}
							onClick={(e) => handleSendRequest(e, userData._id)}
						></button>
					))}
			</div>
		</li>
	) : null;
};

export default PersonWrapper;
