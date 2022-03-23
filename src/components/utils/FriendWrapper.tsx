// @ts-nocheck

import { useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../hooks/UserContext';
import type { Chatroom, User } from '../../myTypes';
import styles from '../../styles/Friend.module.scss';
import Chat from '../Chat';

type ServerToClientEvents = {
	oops: (error: any) => void;
	load_chat: (data: Chatroom) => void;
	receive_message: (data: Chatroom) => void;
};

type ClientToServerEvents = {
	chat_subscribe: (participants: string[]) => void;
	open_chat: (participants: string[]) => void;
};

type Props = {
	handleRemove: Function;
	friend: User;
};

const FriendWrapper: React.FC<Props> = ({ handleRemove, friend }) => {
	const { user } = useContext(UserContext);

	const optionsRef = useRef<HTMLDivElement>(null);

	const [showOptions, setShowOptions] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);
	const [chatData, setChatData] = useState<Chatroom | null>(null);

	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_API_URL}`);
		setSocket(newSocket);

		return () => newSocket.disconnect();
	}, [setSocket]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		const participants = [user._id, friend._id].sort();
		socket.emit('chat_subscribe', participants);

		return () => socket.off();
	}, [socket, user, friend]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on('oops', (error) => {
			console.error(error);
		});
		socket.on('load_chat', (data) => {
			setChatData(data);
		});
		socket.on('receive_message', (data) => {
			setChatData(data);
			setShowChat(true);
		});

		return () => socket.off();
	}, [socket]);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowListener);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const openChat = (e: React.MouseEvent<HTMLLIElement>) => {
		e.stopPropagation();
		if (!socket) {
			return;
		}
		const participants = [user._id, friend._id].sort();
		socket.emit('open_chat', participants);
		setShowChat(true);
	};

	const closeChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setShowChat(false);
	};

	return (
		<>
			<li className={styles.friend} onClick={openChat}>
				<div className='profile-pic-style'>
					<img
						src={
							friend.profile_picture
								? `http://localhost:4000/photos/${friend.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt={`${friend.first_name} ${friend.last_name}`}
					/>
				</div>
				<div>
					<div>
						{friend.first_name} {friend.last_name}
					</div>
				</div>
				<div className={styles.right}>
					<span className={styles.options_toggle} onClick={toggleOptions}>
						<svg viewBox='0 0 20 20' width='20' height='20'>
							<g transform='translate(-446 -350)'>
								<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
							</g>
						</svg>
					</span>
					{showOptions && (
						<span ref={optionsRef} className={styles.options_menu}>
							<div
								className={styles.remove_btn}
								onClick={(e) => handleRemove(e, friend._id)}
							>
								Remove friend
							</div>
						</span>
					)}
				</div>
			</li>
			{showChat && chatData && (
				<Chat
					data={chatData}
					socket={socket}
					closeChat={closeChat}
					recipient={friend}
				/>
			)}
		</>
	);
};

export default FriendWrapper;
