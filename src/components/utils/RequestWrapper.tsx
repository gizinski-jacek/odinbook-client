import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Request.module.scss';
import { axiosPut } from './axiosFunctions';

type Props = {
	setData: Function;
	request: User;
};

const RequestWrapper: React.FC<Props> = ({ request, setData }) => {
	const handleAcceptRequest = async (requestId: string) => {
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

	const handleCancelRequest = async (requestId: string) => {
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
			<div className='profile-pic-style'>
				<Link to={`/profile/${request._id}`}>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</Link>
			</div>
			<div className={styles.contents}>
				<h4>{request.full_name}</h4>
				<div className={styles.controls}>
					<button
						className='btn-default btn-confirm'
						onClick={() => handleAcceptRequest(request._id)}
					>
						Confirm
					</button>
					<button
						className='btn-default btn-remove'
						onClick={() => handleCancelRequest(request._id)}
					>
						Remove
					</button>
				</div>
			</div>
		</li>
	);
};

export default RequestWrapper;
