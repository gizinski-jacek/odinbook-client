import { useContext } from 'react';
import { UserContext } from '../../hooks/UserProvider';
import { Message } from '../myTypes';
import timeSinceDate from '../timeSinceDate';
import styles from '../../../styles/ChatMessage.module.scss';

type Props = {
	message: Message;
};

const ChatMessageWrapper: React.FC<Props> = ({ message }) => {
	const { user } = useContext(UserContext);

	return (
		user && (
			<li
				className={
					user._id === message.author._id
						? styles.user_message
						: styles.recipient_message
				}
			>
				<div className='profile_pic_style'>
					<img
						src={
							message.author.profile_picture_url ||
							'/placeholder_profile_pic.png'
						}
						alt={`${message.author.first_name} ${message.author.last_name}`}
					/>
					<h6 className={styles.timestamp}>
						{timeSinceDate(message.createdAt, true)}
					</h6>
				</div>
				<p>{message.text}</p>
			</li>
		)
	);
};

export default ChatMessageWrapper;
