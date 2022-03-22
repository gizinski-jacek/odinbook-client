// @ts-nocheck

import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import { io, Socket } from 'socket.io-client';
import { Chatroom, MessageNew, User } from '../myTypes';
import styles from '../styles/Chat.module.scss';
import LoadingIcon from './utils/LoadingIcon';

type ServerToClientEvents = {
	oops: (error: any) => void;
	load_chat: (data: Chatroom) => void;
	receive_message: (data: Chatroom) => void;
};

type ClientToServerEvents = {
	open_chat: (participants: string[]) => void;
	send_message: (message: MessageNew) => void;
};

type Props = {
	closeChat: Function;
	recipient: User;
};

const Chat: React.FC<Props> = ({ closeChat, recipient }) => {
	const { user } = useContext(UserContext);

	const lastMsg = useRef<HTMLLIElement>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);
	const [chatData, setChatData] = useState<Chatroom>();
	const [messageInput, setMessageInput] = useState('');

	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_API_URL}`);
		setSocket(newSocket);
		return () => newSocket.disconnect();
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
		socket.on('oops', (error) => {
			console.error(error);
		});
		socket.on('load_chat', (data) => {
			setChatData(data);
			setIsLoading(false);
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
		userId: string,
		string: string
	) => {
		e.preventDefault();
		if (!socket) {
			return;
		}
		socket.emit('send_message', { chatId, userId, string });
		setMessageInput('');
	};

	const messageDisplay = chatData?.message_list
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
			{isLoading ? (
				<LoadingIcon text={'Loading Messages'} />
			) : (
				<>
					<hr />
					<div className={styles.body}>
						<ul className={styles.message_list}>
							{messageDisplay && messageDisplay.length > 0 && messageDisplay}
							<li ref={lastMsg}></li>
						</ul>
						<form
							onSubmit={(e) =>
								handleSubmit(e, chatData._id, user._id, messageInput)
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
							<button
								type='submit'
								className='btn-default btn-confirm'
								disabled={messageInput ? false : true}
							>
								Send
							</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
};

export default Chat;
