// @ts-nocheck

import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import { io } from 'socket.io-client';
import { User } from '../myTypes';
import styles from '../styles/Chat.module.scss';

type Props = {
	closeChat: Function;
	recipient: User;
};

const Chat: React.FC<Props> = ({ closeChat, recipient }) => {
	const { user } = useContext(UserContext);

	const lastMsg = useRef(null);

	const [socket, setSocket] = useState(null);
	const [chatData, setChatData] = useState<{
		_id: string;
		participants: string[];
		message_list: [{ chat_ref: string; author: string; text: string }];
		last_message?: Number;
	}>();
	const [messageInput, setMessageInput] = useState('');

	useEffect(() => {
		const newSocket = io('http://localhost:4000');
		setSocket(newSocket);
		return () => newSocket.close();
	}, [setSocket]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		const participants = [user._id, recipient._id].sort();
		socket.emit('open_chat', participants);
		return () => socket.off();
	}, [socket, user, recipient]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on('chat_error', (error) => {
			console.error(error);
		});
		socket.on('load_chat', (data) => {
			setChatData(data);
			lastMsg?.current?.scrollIntoView({ behavior: 'smooth' });
		});
		socket.on('receive_message', (data) => {
			setChatData(data);
			lastMsg?.current?.scrollIntoView({ behavior: 'smooth' });
		});
		return () => socket.off();
	}, [socket]);

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		chatId: string,
		senderId: string,
		string: string,
		recipientId: string
	) => {
		e.preventDefault();
		socket.emit('send_message', { chatId, senderId, recipientId, string });
		setMessageInput('');
	};

	const messageDisplay = chatData?.message_list.map((message, index, arr) => {
		return (
			<li
				key={index}
				className={
					user._id === message.author._id
						? styles.user_message
						: styles.recipient_message
				}
				ref={index === arr.length - 1 ? lastMsg : null}
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
				</ul>
				<form
					onSubmit={(e) =>
						handleSubmit(e, chatData._id, user._id, messageInput, recipient._id)
					}
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
					<button type='submit' className='btn-default btn-confirm'>
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

export default Chat;
