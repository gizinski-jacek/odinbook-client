import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import type { Chatroom, SocketType, User } from '../myTypes';
import { axiosPost, axiosPut } from './utils/axiosFunctions';
import styles from '../styles/Chat.module.scss';
import ChatMessageWrapper from './utils/ChatMessageWrapper';

type Props = {
	closeChat: (e: React.MouseEvent<HTMLButtonElement>) => void;
	recipient: User;
	socket: SocketType | null;
	data: Chatroom;
};

const Chat: React.FC<Props> = ({ closeChat, recipient, socket, data }) => {
	const { user } = useContext(UserContext);

	const lastMessage = useRef<HTMLLIElement>(null);

	const [messageInput, setMessageInput] = useState('');

	useEffect(() => {
		lastMessage.current?.scrollIntoView({ behavior: 'smooth' });
	}, [data]);

	useEffect(() => {
		(async () => {
			try {
				const unReadMessageData = data.message_list.filter(
					(message) =>
						!message.readBy.includes(user._id) &&
						message.author._id !== user._id
				);
				if (unReadMessageData.length > 0) {
					const unReadMessageListIDs = unReadMessageData.map(
						(message) => message._id
					);
					await axiosPut('/api/chats/messages/mark-many', {
						messageList: unReadMessageListIDs,
					});
				}
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [data, user]);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		chatId: string,
		input: string,
		recipientId: string
	) => {
		e.preventDefault();
		if (!socket) {
			return;
		}
		try {
			const message = {
				chat_ref: chatId,
				text: input,
				recipient: recipientId,
			};
			await axiosPost('/api/chats/messages', message);
		} catch (error: any) {
			console.error(error);
		}
		setMessageInput('');
	};

	const messageDisplay = data?.message_list
		.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
		.map((message) => {
			return <ChatMessageWrapper key={message._id} message={message} />;
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
				<button type='button' className={styles.close_btn} onClick={closeChat}>
					<span></span>
				</button>
			</div>
			<hr />
			<div className={styles.body}>
				<ul className={styles.message_list}>
					{messageDisplay && messageDisplay.length > 0 && messageDisplay}
					<li ref={lastMessage}></li>
				</ul>
				<form
					onSubmit={(e) =>
						handleSubmit(e, data._id, messageInput, recipient._id)
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
		</div>
	);
};

export default Chat;
