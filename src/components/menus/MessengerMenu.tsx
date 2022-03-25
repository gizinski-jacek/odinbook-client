import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { Message, SocketType } from '../../myTypes';
import timeSinceDate from '../utils/timeSinceDate';
import styles from '../../styles/menus/MessengerMenu.module.scss';

type Props = {
	socket: SocketType | null;
};

const MessengerMenu: React.FC<Props> = ({ socket }) => {
	const { user } = useContext(UserContext);

	const [searchInput, setSearchInput] = useState('');

	const [newMessagesData, setNewMessagesData] = useState<Message[]>([]);

	useEffect(() => {
		socket?.emit('open_messages_menu', user._id);
	}, [socket, user]);

	useEffect(() => {
		socket?.on('load_new_messages', (data) => {
			setNewMessagesData(data);
		});
	}, [socket, user]);

	const dismissMessage = (
		e: React.MouseEvent<HTMLButtonElement>,
		messageId: string
	) => {
		e.stopPropagation();
		socket?.emit('dismiss_message', user._id, messageId);
		const newState = newMessagesData.filter((m) => m._id !== messageId);
		setNewMessagesData(newState);
	};

	const messageListDisplay = newMessagesData.map((message, index) => {
		return (
			<li key={index} className={styles.message}>
				<div className='profile-pic-style'>
					<img
						src={
							message.author.profile_picture
								? `http://localhost:4000/photos/${message.author.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt={`${message.author.first_name} ${message.author.last_name}`}
					/>
					<h6 className={styles.timestamp}>
						{timeSinceDate(message.createdAt, true)}
					</h6>
				</div>
				<div className={styles.contents}>
					<p>{message.text}</p>
				</div>
				<button
					type='button'
					className={styles.dismiss_btn}
					onClick={(e) => dismissMessage(e, message._id)}
				>
					<span></span>
				</button>
			</li>
		);
	});

	return (
		<div className={styles.menu_messenger}>
			<div className={styles.top}>
				<h3>Messenger</h3>
			</div>
			<div className={styles.search_messenger}>
				<label>
					<span>
						<svg viewBox='0 0 16 16' width='16' height='16'>
							<g transform='translate(-448 -544)'>
								<g>
									<path
										d='M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z'
										transform='translate(448 544)'
									></path>
									<path
										d='M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z'
										transform='translate(448 544)'
									></path>
									<path
										d='M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z'
										transform='translate(448 544)'
									></path>
									<path
										d='m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z'
										transform='translate(448 544)'
									></path>
								</g>
							</g>
						</svg>
					</span>
					<input
						type='text'
						id='search_messenger'
						name='search_messenger'
						minLength={1}
						maxLength={512}
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder='Search Messenger'
					/>
				</label>
			</div>
			<div className={styles.message_list_container}>
				{messageListDisplay.length > 0 ? (
					<ul className={styles.message_list}>{messageListDisplay}</ul>
				) : (
					<div className={styles.empty}>
						<h4>No new messages</h4>
					</div>
				)}
			</div>
			<hr />
			<Link to='/'>See all in Messenger</Link>
		</div>
	);
};

export default MessengerMenu;
