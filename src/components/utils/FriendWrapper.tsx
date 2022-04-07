import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import { ChatContext } from '../hooks/ChatProvider';
import type { Chatroom, SocketType, User } from '../../myTypes';
import { axiosGet } from './axiosFunctions';
import styles from '../../styles/Friend.module.scss';

type Props = {
	handleRemove: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
	friend: User;
	socket: SocketType | null;
};

const FriendWrapper: React.FC<Props> = ({ handleRemove, friend, socket }) => {
	const { user } = useContext(UserContext);
	const { addChat, updateChat } = useContext(ChatContext);

	const optionsRef = useRef<HTMLDivElement>(null);

	const [showOptions, setShowOptions] = useState(false);
	const [newMessageAlert, setNewMessageAlert] = useState(false);

	useEffect(() => {
		if (!user || !friend) {
			return;
		}
		const controller = new AbortController();
		(async () => {
			try {
				const resData: Chatroom = await axiosGet(`/api/chats/${friend._id}`, {
					signal: controller.signal,
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
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [friend]);

	useEffect(() => {
		if (!socket || !user) {
			return;
		}
		socket.emit('subscribe_chat', friend._id);

		socket.on('receive_message', (data) => {
			if (!data.participants.find((p) => p._id === friend._id)) {
				return;
			}
			if (
				data.message_list.some(
					(message) =>
						!message.readBy.includes(user._id) &&
						message.author._id !== user._id
				)
			) {
				setNewMessageAlert(true);
			}
			updateChat(data);
		});

		return () => {
			socket.off();
		};
	}, [socket, friend, updateChat]);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', closeOptionsListener);
	};

	const closeOptionsListener = (e: any) => {
		e.stopPropagation();
		if (e.target.closest('div') !== optionsRef.current) {
			document.removeEventListener('click', closeOptionsListener);
			setShowOptions(false);
		}
	};

	const openChat = async (
		e: React.MouseEvent<HTMLLIElement>,
		friendId: string
	) => {
		const target = e.target as HTMLLIElement;
		if (target.closest('div') === optionsRef.current) {
			return;
		}
		const resData: Chatroom = await axiosGet(`/api/chats/${friendId}`);
		addChat(resData);
		setNewMessageAlert(false);
	};

	return (
		<>
			<li className={styles.friend} onClick={(e) => openChat(e, friend._id)}>
				<Link
					to={`/profile/${friend._id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className={`profile-pic-style ${styles.picture}`}>
						<img
							src={friend.profile_picture_url || '/placeholder_profile_pic.png'}
							alt='User profile pic'
						/>
						{newMessageAlert && <span className={styles.new_message}></span>}
					</div>
				</Link>
				<div className={styles.contents}>
					{friend.first_name} {friend.last_name}
				</div>
				<div ref={optionsRef} className={styles.right}>
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
						<span className={styles.options_menu}>
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
		</>
	);
};

export default FriendWrapper;
