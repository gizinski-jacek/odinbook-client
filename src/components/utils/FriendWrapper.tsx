import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Friend.module.scss';

type Props = {
	openChat: Function;
	friend: User;
};

const FriendWrapper: React.FC<Props> = ({ openChat, friend }) => {
	return (
		<li className={styles.friend} onClick={() => openChat()}>
			<Link to={`/profile/${friend._id}`}>
				<div className='profile-pic-style'>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
			</Link>
			<div>
				<div>{friend.full_name}</div>
			</div>
		</li>
	);
};

export default FriendWrapper;
