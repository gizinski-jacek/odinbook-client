import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Person.module.scss';

type Props = {
	handleSendRequest: Function;
	person: User;
};

const PersonWrapper: React.FC<Props> = ({ person, handleSendRequest }) => {
	return (
		<li className={styles.not_friend}>
			<Link to={`/profile/${person._id}`}>
				<div className={styles.pic_link}>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
			</Link>
			<Link to={`/profile/${person._id}`}>
				<h4>{person.full_name}</h4>
			</Link>
			<div className={styles.controls}>
				<button
					type='button'
					className='btn-default btn-active'
					onClick={() => {
						handleSendRequest(person._id);
					}}
				>
					Add Friend
				</button>
			</div>
		</li>
	);
};

export default PersonWrapper;
