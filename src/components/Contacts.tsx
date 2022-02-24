import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './styling/Contacts.module.scss';

type StateList = {
	_id: string;
	first_name: string;
	last_name: string;
}[];

type StateRequests = StateList;

const Contacts = () => {
	const [friendList, setFriendList] = useState<StateList>([]);
	const [friendRequests, setFriendRequests] = useState<StateRequests>([]);

	useEffect(() => {
		(async () => {
			try {
				const resFriendsData = await axios.get('/api/user/user-friends-data/', {
					withCredentials: true,
				});
				setFriendList(resFriendsData.data[0]);
				setFriendRequests(resFriendsData.data[1]);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const acceptRequest = async (request: {
		_id: string;
		first_name: string;
		last_name: string;
	}) => {
		try {
			const resFriendsData = await axios.post(
				`/api/user/accept-request/${request._id}`,
				null,
				{
					withCredentials: true,
				}
			);
			setFriendList(resFriendsData.data[0]);
			setFriendRequests(resFriendsData.data[1]);
		} catch (error: any) {
			console.error(error);
		}
	};

	const declineRequest = async (request: {
		_id: string;
		first_name: string;
		last_name: string;
	}) => {
		try {
			const resFriendRequests = await axios.post(
				`/api/user/decline-request/${request._id}`,
				null,
				{
					withCredentials: true,
				}
			);
			setFriendRequests(resFriendRequests.data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const openChat = async (friend: {
		_id: string;
		first_name: string;
		last_name: string;
	}) => {
		try {
			// fetch past messages and load chat window
			console.log('load chat window');
		} catch (error: any) {
			console.error(error);
		}
	};

	const friendListDisplay = friendList?.map((friend) => {
		return (
			<li key={friend._id} className={styles.friend}>
				<div onClick={() => openChat(friend)}>
					<div>profile picture</div>
					<div>
						<div>
							{friend.first_name} {friend.last_name}
						</div>
					</div>
				</div>
			</li>
		);
	});

	const friendRequestsDisplay = friendRequests?.map((request) => {
		return (
			<li key={request._id} className={styles.request}>
				<div className={styles.info}>
					<div>profile picture</div>
					<div>
						<div>
							{request.first_name} {request.last_name}
						</div>
					</div>
				</div>
				<div className={styles.controls}>
					<button
						className='button-accept'
						onClick={() => acceptRequest(request)}
					>
						accept
					</button>
					<button
						className='button-decline'
						onClick={() => declineRequest(request)}
					>
						decline
					</button>
				</div>
			</li>
		);
	});

	return (
		<div className={styles.contacts}>
			{friendRequests.length > 0 ? (
				<>
					<div>Requests</div>
					<ul className={styles.friend_requests}>{friendRequestsDisplay}</ul>
				</>
			) : null}
			<div className={styles.contacts}>Contacts</div>
			<ul className={styles.friend_list}>{friendListDisplay}</ul>
		</div>
	);
};

export default Contacts;
