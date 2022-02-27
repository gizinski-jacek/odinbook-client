import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Contacts.module.scss';

type StateFriendList = {
	_id: string;
	first_name: string;
	last_name: string;
}[];

type StateFriendRequests = StateFriendList;

const Contacts = () => {
	const [friendList, setFriendList] = useState<StateFriendList>([]);
	const [friendRequests, setFriendRequests] = useState<StateFriendRequests>([]);

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

	const friendRequestsDisplay = friendRequests?.map((request) => {
		return (
			<li key={request._id} className={styles.request}>
				<div className='profile-pic-style'>
					<Link to={`/profile/${request._id}`}>
						<img
							src='icons/placeholder_profile_pic.png'
							alt='user-profile-pic'
						/>
					</Link>
				</div>
				<div className={styles.contents}>
					<h4>
						{request.first_name} {request.last_name}
					</h4>
					<div className={styles.controls}>
						<button
							className='btn-confirm'
							onClick={() => acceptRequest(request)}
						>
							Confirm
						</button>
						<button
							className='btn-remove'
							onClick={() => declineRequest(request)}
						>
							Remove
						</button>
					</div>
				</div>
			</li>
		);
	});

	const friendListDisplay = friendList?.map((friend) => {
		return (
			<li
				key={friend._id}
				className={styles.friend}
				onClick={() => openChat(friend)}
			>
				<div className='profile-pic-style'>
					<Link to={`/profile/${friend._id}`}>
						<img
							src='icons/placeholder_profile_pic.png'
							alt='user-profile-pic'
						/>
					</Link>
				</div>
				<div>
					<div>
						{friend.first_name} {friend.last_name}
					</div>
				</div>
			</li>
		);
	});

	return (
		<div className={styles.contacts}>
			{friendRequests.length > 0 ? (
				<div className={styles.friend_requests}>
					<ul>
						<div className={styles.top}>
							<img src='icons/requests_icon.png' alt='requests-icon' />
							<h5>Friend requests</h5>
						</div>
						{friendRequestsDisplay}
					</ul>
				</div>
			) : null}
			<div className={styles.friend_list}>
				<div className={styles.top}>
					<h3>Contacts</h3>
				</div>
				<ul>{friendListDisplay}</ul>
			</div>
		</div>
	);
};

export default Contacts;
