import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Request.module.scss';

type Props = {
	acceptRequest: Function;
	cancelRequest: Function;
	request: User;
};

const RequestWrapper: React.FC<Props> = ({
	request,
	acceptRequest,
	cancelRequest,
}) => {
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
						onClick={() => acceptRequest(request._id)}
					>
						Confirm
					</button>
					<button
						className='btn-default btn-remove'
						onClick={() => cancelRequest(request._id)}
					>
						Remove
					</button>
				</div>
			</div>
		</li>
	);
};

export default RequestWrapper;
