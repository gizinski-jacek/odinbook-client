import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './hooks/UserProvider';
import { ChatContext, ChatReducerActions } from './hooks/ChatProvider';
import type { Chatroom, SocketType, User } from './utils/myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import RequestWrapper from './utils/wrappers/RequestWrapper';
import FriendWrapper from './utils/wrappers/FriendWrapper';
import Chat from './Chat';
import styles from '../styles/Contacts.module.scss';

const Contacts = () => {
	const { user } = useContext(UserContext);
	const { state, dispatch } = useContext(ChatContext);

	const [requestsData, setRequestsData] = useState<User[]>([]);
	const [friendsData, setFriendsData] = useState<User[]>([]);
	const [socket, setSocket] = useState<SocketType | null>(null);

	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_API_URI}/chats`, {
			withCredentials: true,
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on('oops', (error) => {
			console.error(error);
		});

		return () => {
			socket.off();
		};
	}, [socket]);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts', {
					signal: controller.signal,
				});
				setRequestsData(resData.incoming_friend_requests);
				setFriendsData(resData.friend_list);
			} catch (error: any) {
				if (controller.signal.aborted) {
					return;
				}
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [user]);

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		if (!user) {
			return;
		}
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		if (!user) {
			return;
		}
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (
		e: React.MouseEvent<HTMLDivElement>,
		userId: string
	) => {
		e.stopPropagation();
		if (!user) {
			return;
		}
		try {
			const resData = await axiosPut(`/api/users/friends/remove`, { userId });
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
		} catch (error: any) {
			console.error(error);
		}
	};

	const requestsDisplay = requestsData?.map((request) => {
		return (
			<RequestWrapper
				key={request._id}
				handleAccept={handleAcceptRequest}
				handleCancel={handleCancelRequest}
				request={request}
			/>
		);
	});

	const friendsDisplay = friendsData?.map((friend) => {
		return (
			<FriendWrapper
				key={friend._id}
				handleRemove={handleRemoveFriend}
				friend={friend}
				socket={socket}
			/>
		);
	});

	const setChatAsActive = (
		e: React.MouseEvent<HTMLLIElement>,
		chat: Chatroom
	) => {
		e.stopPropagation();
		dispatch({ type: ChatReducerActions.SWITCH_CHAT, payload: { chat: chat } });
	};

	const closeChat = (
		e: React.MouseEvent<HTMLButtonElement>,
		chat: Chatroom
	) => {
		e.stopPropagation();
		dispatch({ type: ChatReducerActions.CLOSE_CHAT, payload: { chat: chat } });
	};

	const closeChatWindow = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		dispatch({ type: ChatReducerActions.CLOSE_CHAT_WINDOW });
	};

	const openChatListDisplay = state.chatList?.map((chat) => {
		return (
			<li
				key={chat._id}
				className={`${styles.chat_list_item} ${
					chat._id === state.activeChat?._id && styles.isActiveChat
				}`}
				onClick={(e) => setChatAsActive(e, chat)}
			>
				{chat.participants.find((u) => u._id !== user?._id)?.first_name}
				<button
					type='button'
					className={styles.close_btn}
					onClick={(e) => closeChat(e, chat)}
				>
					<span></span>
				</button>
			</li>
		);
	});

	return (
		<div className={styles.contacts}>
			{requestsDisplay.length > 0 && (
				<>
					<div className={styles.friend_requests}>
						<ul>
							<div className={styles.top}>
								<img
									src='./single_icons/friends_icon.png'
									alt='Friend requests'
								/>
								<h5>Friend requests</h5>
							</div>
							{requestsDisplay}
						</ul>
					</div>
					<hr />
				</>
			)}
			<div className={styles.friend_list}>
				<div className={styles.top}>
					<h3>Contacts</h3>
				</div>
				<ul>{friendsDisplay}</ul>
			</div>
			{state.chatWindowOpen && state.chatList && state.chatList.length > 0 && (
				<div className={styles.chat_list_container}>
					<ul className={styles.open_chat_list}>
						{openChatListDisplay}
						<li
							className={styles.close_chat_window}
							onClick={(e) => closeChatWindow(e)}
						>
							<span></span>
						</li>
					</ul>
					<hr />
					<div className={styles.container}>
						<Chat />
					</div>
				</div>
			)}
		</div>
	);
};

export default Contacts;
