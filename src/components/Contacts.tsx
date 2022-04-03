import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from './hooks/UserProvider';
import type { SocketType, User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import RequestWrapper from './utils/RequestWrapper';
import FriendWrapper from './utils/FriendWrapper';
import styles from '../styles/Contacts.module.scss';

const Contacts = () => {
	const { user, setUser } = useContext(UserContext);

	const navigate = useNavigate();

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
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
			console.error(error);
		});

		return () => {
			socket.off();
		};
	}, [socket, navigate]);

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
				if (error.response && error.response.status === 401) {
					navigate('/');
				}
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [user, navigate]);

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
			setUser(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setUser(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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
			setUser(data);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
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

	return (
		<div className={styles.contacts}>
			{requestsDisplay.length > 0 && (
				<>
					<div className={styles.friend_requests}>
						<ul>
							<div className={styles.top}>
								<img
									src='single_icons/friends_icon.png'
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
		</div>
	);
};

export default Contacts;
