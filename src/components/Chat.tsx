import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './hooks/UserProvider';
import { ChatContext } from './hooks/ChatProvider';
import { axiosPost, axiosPut } from './utils/axiosFunctions';
import ChatMessageWrapper from './utils/wrappers/ChatMessageWrapper';
import styles from '../styles/Chat.module.scss';

const Chat = () => {
	const { user } = useContext(UserContext);
	const { activeChat } = useContext(ChatContext);

	const lastMessage = useRef<HTMLLIElement>(null);

	const [messageInput, setMessageInput] = useState('');

	useEffect(() => {
		lastMessage.current?.scrollIntoView({ behavior: 'smooth' });
	}, [activeChat]);

	useEffect(() => {
		if (!user || !activeChat) {
			return;
		}
		const controller = new AbortController();
		(async () => {
			try {
				const unReadMessageData = activeChat.message_list.filter(
					(message) =>
						!message.readBy.includes(user._id) &&
						message.author._id !== user._id
				);
				if (unReadMessageData.length > 0) {
					const unReadMessageListIDs = unReadMessageData.map(
						(message) => message._id
					);
					await axiosPut(
						'/api/chats/messages/mark-many',
						{
							messageList: unReadMessageListIDs,
						},
						{ signal: controller.signal }
					);
				}
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [activeChat, user]);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		chatId: string,
		input: string
	) => {
		e.preventDefault();
		try {
			const message = {
				chat_ref: chatId,
				text: input,
			};
			await axiosPost('/api/chats/messages', message);
			setMessageInput('');
		} catch (error: any) {
			console.error(error);
		}
	};

	const messageDisplay = activeChat?.message_list
		.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
		.map((message) => {
			return <ChatMessageWrapper key={message._id} message={message} />;
		});

	return (
		activeChat && (
			<div className={styles.chat_window}>
				<div className={styles.body}>
					<ul className={styles.message_list}>
						{messageDisplay && messageDisplay.length > 0 && messageDisplay}
						<li ref={lastMessage}></li>
					</ul>
					<form onSubmit={(e) => handleSubmit(e, activeChat._id, messageInput)}>
						<label>
							<input
								type='text'
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
		)
	);
};

export default Chat;
