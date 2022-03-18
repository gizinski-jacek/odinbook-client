import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Request.module.scss';

type Props = {
	handleAccept: Function;
	handleCancel: Function;
	request: User;
};

const RequestWrapper: React.FC<Props> = ({
	handleAccept,
	handleCancel,
	request,
}) => {
	return (
		<li className={styles.request}>
			<Link to={`/profile/${request._id}`}>
				<div className='profile-pic-style'>
					<img
						src={
							request.profile_picture
								? `http://localhost:4000/${request.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
			</Link>
			<div className={styles.contents}>
				<h4>
					{request.first_name} {request.last_name}
				</h4>
				<div className={styles.controls}>
					<button
						className='btn-default btn-confirm'
						onClick={(e) => handleAccept(e, request._id)}
					>
						Confirm
					</button>
					<button
						className='btn-default btn-remove'
						onClick={(e) => handleCancel(e, request._id)}
					>
						Remove
					</button>
				</div>
			</div>
		</li>
	);
};

export default RequestWrapper;
