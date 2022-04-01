import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../hooks/UserProvider';
import type { Chatroom, SocketType, User } from '../../myTypes';
import { axiosGet } from './axiosFunctions';
import styles from '../../styles/Friend.module.scss';
import Chat from '../Chat';

type Props = {
	handleRemove: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
	friend: User;
	socket: SocketType | null;
};

const FriendWrapper: React.FC<Props> = ({ handleRemove, friend, socket }) => {
	const { user } = useContext(UserContext);

	const optionsRef = useRef<HTMLDivElement>(null);

	const [showOptions, setShowOptions] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatClosedByUser, setChatClosedByUser] = useState(false);
	const [newMessageAlert, setNewMessageAlert] = useState(false);
	const [chatData, setChatData] = useState<Chatroom | null>(null);

	useEffect(() => {
		if (!user) {
			return;
		}
		(async () => {
			const resData: Chatroom = await axiosGet('/api/chats', {
				withCredentials: true,
				params: { recipientId: friend._id },
			});
			if (
				resData.message_list.some(
					(message) =>
						!message.readBy.includes(user._id) &&
						message.author._id !== user._id
				)
			) {
				setNewMessageAlert(true);
			}
			setChatData(resData);
		})();
	}, [user, friend]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.emit('subscribe_chat', friend._id);

		socket.on('receive_message', (data) => {
			if (!data.participants.includes(friend._id)) {
				return;
			}
			if (!chatClosedByUser) {
				setChatData(data);
				setShowChat(true);
			} else if (!showChat) {
				setNewMessageAlert(true);
			} else {
				setChatData(data);
			}
		});

		return () => {
			socket.off();
		};
	}, [socket, showChat, chatClosedByUser, friend, user]);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowOptionsListener);
	};

	const windowOptionsListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowOptionsListener);
			setShowOptions(false);
		}
	};

	const openChat = async (
		e: React.MouseEvent<HTMLLIElement>,
		friendId: string
	) => {
		e.stopPropagation();
		setChatData(
			await axiosGet('/api/chats', {
				withCredentials: true,
				params: { recipientId: friendId },
			})
		);
		setShowChat(true);
		setNewMessageAlert(false);
	};

	const closeChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setChatClosedByUser(true);
		setShowChat(false);
	};

	return (
		<>
			<li className={styles.friend} onClick={(e) => openChat(e, friend._id)}>
				<div className={`profile-pic-style ${styles.picture}`}>
					<img
						src={
							friend.profile_picture
								? `http://localhost:4000/photos/${friend.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
					{newMessageAlert && <span className={styles.new_message}></span>}
				</div>
				<div className={styles.contents}>
					{friend.first_name} {friend.last_name}
				</div>
				<div className={styles.right}>
					<span
						className={styles.options_toggle}
						onClick={(e) => toggleOptions(e)}
					>
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
				<Chat data={chatData} closeChat={closeChat} recipient={friend} />
			)}
		</>
	);
};

export default FriendWrapper;
