import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import type { User } from '../../myTypes';
import { axiosPut } from './axiosFunctions';
import styles from '../../styles/Person.module.scss';

type Props = {
	person: User;
};

const PersonWrapper: React.FC<Props> = ({ person }) => {
	const { user } = useContext(UserContext);

	const [userData, setUserData] = useState<User | null>(person);

	const handleCancelRequest = async (requestId: string) => {
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
			await axiosPut(`/api/users/friends/accept`, { requestId });
			setUserData(null);
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

	return userData ? (
		<li className={styles.person}>
			<Link to={`/profile/${userData._id}`}>
				<div className={styles.pic_link}>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
			</Link>
			<Link to={`/profile/${userData._id}`}>
				<h4>{userData.full_name}</h4>
			</Link>
			<div className={styles.controls}>
				{user._id && userData?.incoming_friend_requests.includes(user._id) ? (
					<button
						type='button'
						className={`btn-default btn-active ${styles.sent}`}
						onClick={() => handleCancelRequest(userData._id)}
					>
						<span>Request Sent</span>
					</button>
				) : user._id &&
				  userData?.outgoing_friend_requests.includes(user._id) ? (
					<button
						type='button'
						className='btn-default btn-confirm'
						onClick={() => handleAcceptRequest(userData._id)}
					>
						Accept Request
					</button>
				) : (
					<button
						type='button'
						className='btn-default btn-confirm'
						onClick={() => handleSendRequest(userData._id)}
					>
						Add Friend
					</button>
				)}
			</div>
		</li>
	) : null;
};

export default PersonWrapper;
