import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import { Socket } from 'socket.io-client';
import { Chatroom, MessageNew, User } from '../myTypes';
import styles from '../styles/Chat.module.scss';

type ClientToServerEvents = {
	send_message: (message: MessageNew) => void;
};

type Props = {
	closeChat: Function;
	recipient: User;
	socket: Socket<ClientToServerEvents>;
	data: Chatroom;
};

const Chat: React.FC<Props> = ({ closeChat, recipient, socket, data }) => {
	const { user } = useContext(UserContext);

	const lastMsg = useRef<HTMLLIElement>(null);

	const [messageInput, setMessageInput] = useState('');

	useEffect(() => {
		lastMsg?.current?.scrollIntoView({ behavior: 'smooth' });
	}, [data]);

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		chatId: string,
		userId: string,
		input: string
	) => {
		e.preventDefault();
		if (!socket) {
			return;
		}
		const message = { chat_ref: chatId, author: userId, text: input };
		socket.emit('send_message', message);
		setMessageInput('');
	};

	const messageDisplay = data?.message_list
		.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
		.map((message, index, arr) => {
			return (
				<li
					key={index}
					className={
						user._id === message.author._id
							? styles.user_message
							: styles.recipient_message
					}
				>
					{recipient._id === message.author._id && (
						<div className='profile-pic-style'>
							<img
								src={
									recipient.profile_picture
										? `http://localhost:4000/photos/${recipient.profile_picture}`
										: '/placeholder_profile_pic.png'
								}
								alt={`${recipient.first_name} ${recipient.last_name}`}
							/>
						</div>
					)}
					<p>{message.text}</p>
				</li>
			);
		});

	return (
		<div className={styles.chat_window}>
			<div className={styles.top}>
				<div className={styles.left}>
					<h3>
						Chatting with:{' '}
						<Link to={`/profile/${recipient._id}`}>{recipient.first_name}</Link>
					</h3>
				</div>
				<button
					type='button'
					className={styles.close_btn}
					onClick={(e) => closeChat(e)}
				>
					<span></span>
				</button>
			</div>
			<hr />
			<div className={styles.body}>
				<ul className={styles.message_list}>
					{messageDisplay && messageDisplay.length > 0 && messageDisplay}
					<li ref={lastMsg}></li>
				</ul>
				<form
					onSubmit={(e) => handleSubmit(e, data._id, user._id, messageInput)}
				>
					<label>
						<input
							type='text'
							id='message'
							name='message'
							minLength={1}
							maxLength={64}
							value={messageInput}
							onChange={(e) => setMessageInput(e.target.value)}
							required
							placeholder='Message'
						/>
					</label>
					<button
						type='submit'
						className='btn-default btn-confirm'
						disabled={messageInput ? false : true}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

export default Chat;
