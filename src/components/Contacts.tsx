import { useContext, useEffect, useState } from 'react';
import { UserContext } from './hooks/UserContext';
import type { User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import RequestWrapper from './utils/RequestWrapper';
import FriendWrapper from './utils/FriendWrapper';
import styles from '../styles/Contacts.module.scss';

const Contacts = () => {
	const { user, setUser } = useContext(UserContext);

	const [requestsData, setRequestsData] = useState<User[]>([]);
	const [friendsData, setFriendsData] = useState<User[]>([]);
	// const [conversationsData, setConversationsData] = useState<User[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts');
				setRequestsData(resData.incoming_friend_requests);
				setFriendsData(resData.friend_list);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [user]);

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
			setUser(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
			setUser(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleRemoveFriend = async (
		e: React.MouseEvent<HTMLDivElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/remove`, { userId });
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setFriendsData(data.friend_list);
			setUser(data);
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
			/>
		);
	});

	// const conversationsDisplay = friendsData?.map((group) => {
	// 	return (
	// 		<li key={group._id} className={styles.group}>
	// 			<div className='profile-pic-style'>
	// 				<span>
	// 					<img
	// 						src={
	// 							group.profile_picture
	// 								? `http://localhost:4000/photos/${group.profile_picture}`
	// 								: '/placeholder_profile_pic.png'
	// 						}
	// 						alt='User profile pic'
	// 					/>
	// 					<img
	// 						src={
	// 							group.profile_picture
	// 								? `http://localhost:4000/photos/${group.profile_picture}`
	// 								: '/placeholder_profile_pic.png'
	// 						}
	// 						alt='User profile pic'
	// 					/>
	// 				</span>
	// 			</div>
	// 			<div>
	// 				<div>
	// 					{/* First names of user's in group convo */}
	// 					{group.first_name} {group.first_name}
	// 				</div>
	// 			</div>
	// 		</li>
	// 	);
	// });

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
			{/* <hr /> */}
			{/* <div className={styles.group_conversations}>
				<div className={styles.top}>
					<h3>Group conversations</h3>
				</div>
				<ul>
					{conversationsDisplay}
					<li className={styles.new_group}>
						<button type='button' className={styles.plus_btn}>
							<span></span>
						</button>
						<h4>Create New Group</h4>
					</li>
				</ul>
			</div> */}
		</div>
	);
};

export default Contacts;
