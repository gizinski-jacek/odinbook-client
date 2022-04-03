import { Link } from 'react-router-dom';
import { Message } from '../../myTypes';
import timeSinceDate from './timeSinceDate';
import styles from '../../styles/MessengerMessage.module.scss';

type Props = {
	dismissMessage: (
		e: React.MouseEvent<HTMLButtonElement>,
		messageId: string
	) => void;
	message: Message;
};

const MessengerMessageWrapper: React.FC<Props> = ({
	dismissMessage,
	message,
}) => {
	return (
		<li className={styles.message}>
			<div className='profile-pic-style'>
				<img
					src={
						message.author.profile_picture_url || '/placeholder_profile_pic.png'
					}
					alt='User profile pic'
				/>
				<h6 className={styles.timestamp}>
					{timeSinceDate(message.createdAt, true)}
				</h6>
			</div>
			<div className={styles.contents}>
				<Link to={`/profile/${message.author._id}`}>
					{message.author.first_name} {message.author.last_name}
				</Link>
				<p>{message.text}</p>
			</div>
			<button
				type='button'
				className={styles.mark_btn}
				onClick={(e) => dismissMessage(e, message._id)}
			>
				<span></span>
			</button>
		</li>
	);
};

export default MessengerMessageWrapper;
