import { Link } from 'react-router-dom';
import styles from '../../styles/NotFriend.module.scss';

type Props = {
	handleSendRequest: Function;
	notFriend: {
		_id: string;
		email: string;
		first_name: string;
		last_name: string;
	};
};

const NotFriendWrapper: React.FC<Props> = ({
	notFriend,
	handleSendRequest,
}) => {
	return (
		<li key={notFriend._id} className={styles.not_friend}>
			<Link to={`/profile/${notFriend._id}`}>
				<div className={styles.pic_link}>
					<img src='placeholder_profile_pic.png' alt='User profile picture' />
				</div>
			</Link>
			<Link to={`/profile/${notFriend._id}`}>
				<h4>
					{notFriend.first_name} {notFriend.last_name}
				</h4>
			</Link>
			<div className={styles.controls}>
				<button
					type='button'
					className='btn-default btn-active'
					onClick={() => {
						handleSendRequest(notFriend._id);
					}}
				>
					Add Friend
				</button>
			</div>
		</li>
	);
};

export default NotFriendWrapper;
