import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import type { User } from '../../myTypes';
import { axiosPut } from './axiosFunctions';
import styles from '../../styles/Person.module.scss';

type Props = {
	person: User;
};

const PersonWrapper: React.FC<Props> = ({ person }) => {
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	const [personData, setPersonData] = useState<User>(person);

	const handleBlockStatus = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/block`, { userId });
			const data = resData.find((u: User) => u._id === userId);
			setPersonData(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setPersonData(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setPersonData(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setPersonData(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setPersonData(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
			console.error(error);
		}
	};

	return user && personData ? (
		<li className={styles.person}>
			<Link to={`/profile/${personData._id}`}>
				<div className={styles.pic_link}>
					<img
						src={
							personData.profile_picture_url || '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
				<h4>
					{personData.first_name} {personData.last_name}
				</h4>
			</Link>
			<div className={styles.controls}>
				{user._id &&
					(personData.blocked_by_other_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-disabled ${styles.blocked}`}
							onClick={(e) => handleBlockStatus(e, personData._id)}
						></button>
					) : personData.blocked_user_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-disabled ${styles.blocked_by}`}
						></button>
					) : personData.friend_list.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-confirm ${styles.friend}`}
							onClick={(e) => handleRemoveFriend(e, personData._id)}
						></button>
					) : personData.incoming_friend_requests.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-active ${styles.sent}`}
							onClick={(e) => handleCancelRequest(e, personData._id)}
						></button>
					) : personData.outgoing_friend_requests.includes(user._id) ? (
						<button
							type='button'
							className={`btn-default btn-active ${styles.request}`}
							onClick={(e) => handleAcceptRequest(e, personData._id)}
						></button>
					) : personData._id === user._id ? null : (
						<button
							type='button'
							className={`btn-default btn-confirm ${styles.not_friend}`}
							onClick={(e) => handleSendRequest(e, personData._id)}
						></button>
					))}
			</div>
		</li>
	) : null;
};

export default PersonWrapper;
