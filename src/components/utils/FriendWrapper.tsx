import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Friend.module.scss';

type Props = {
	openChat: Function;
	friend: User;
};

const FriendWrapper: React.FC<Props> = ({ friend, openChat }) => {
	return (
		<li className={styles.friend} onClick={() => openChat()}>
			<div className='profile-pic-style'>
				<Link to={`/profile/${friend._id}`}>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</Link>
			</div>
			<div>
				<div>{friend.full_name}</div>
			</div>
		</li>
	);
};

export default FriendWrapper;
