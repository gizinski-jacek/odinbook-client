import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Request.module.scss';
import { axiosPut } from './axiosFunctions';

type Props = {
	setData: Function;
	request: User;
};

const RequestWrapper: React.FC<Props> = ({ setData, request }) => {
	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		requestId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				requestId,
			});
			const data = resData.find((u: User) => u._id === requestId);
			setData(data.incoming_friend_requests);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		requestId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/decline`, {
				requestId,
			});
			const data = resData.find((u: User) => u._id === requestId);
			setData(data.incoming_friend_requests);
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<li className={styles.request}>
			<Link to={`/profile/${request._id}`}>
				<div className='profile-pic-style'>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
			</Link>
			<div className={styles.contents}>
				<h4>{request.full_name}</h4>
				<div className={styles.controls}>
					<button
						className='btn-default btn-confirm'
						onClick={(e) => handleAcceptRequest(e, request._id)}
					>
						Confirm
					</button>
					<button
						className='btn-default btn-remove'
						onClick={(e) => handleCancelRequest(e, request._id)}
					>
						Remove
					</button>
				</div>
			</div>
		</li>
	);
};

export default RequestWrapper;
