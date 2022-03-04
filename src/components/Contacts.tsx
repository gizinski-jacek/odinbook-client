import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Contacts.module.scss';

type FriendList = {
	_id: string;
	email: string;
	first_name: string;
	last_name: string;
}[];

type FriendRequests = FriendList;

type GroupConvos = FriendList;

const Contacts = () => {
	const [friendRequests, setFriendRequests] = useState<FriendRequests>([]);
	const [friendList, setFriendList] = useState<FriendList>([]);
	const [groupConvos, setGroupConvos] = useState<GroupConvos>([]);

	useEffect(() => {
		(async () => {
			try {
				const resFriendsData = await axios.get(
					'/api/users/user-friends-data/',
					{ withCredentials: true }
				);
				setFriendList(resFriendsData.data[0]);
				setFriendRequests(resFriendsData.data[1]);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const acceptRequest = async (requestId: string) => {
		try {
			const resFriendsData = await axios.put(
				`/api/users/friends/accept`,
				{ requestId },
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

	const declineRequest = async (requestId: string) => {
		try {
			const resFriendRequests = await axios.put(
				`/api/users/friends/decline`,
				{ requestId },
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
						<img src='placeholder_profile_pic.png' alt='User profile picture' />
					</Link>
				</div>
				<div className={styles.contents}>
					<h4>
						{request.first_name} {request.last_name}
					</h4>
					<div className={styles.controls}>
						<button
							className='btn-default btn-confirm'
							onClick={() => acceptRequest(request._id)}
						>
							Confirm
						</button>
						<button
							className='btn-default btn-remove'
							onClick={() => declineRequest(request._id)}
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
						<img src='placeholder_profile_pic.png' alt='User profile picture' />
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

	// Placeholder
	const groupConvosDisplay = friendList?.map((group) => {
		return (
			<li
				key={group._id}
				className={styles.group}
				onClick={() => openChat(group)}
			>
				<div className='profile-pic-style'>
					<span>
						<img src='placeholder_profile_pic.png' alt='User profile picture' />
						<img src='placeholder_profile_pic.png' alt='User profile picture' />
					</span>
				</div>
				<div>
					<div>
						{group.first_name} {group.last_name}
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
							<img src='icons/friends_icon.png' alt='Friend requests' />
							<h5>Friend requests</h5>
						</div>
						{friendRequestsDisplay}
					</ul>
				</div>
			) : null}
			{friendRequests.length > 0 ? <hr /> : null}
			<div className={styles.friend_list}>
				<div className={styles.top}>
					<h3>Contacts</h3>
				</div>
				<ul>{friendListDisplay}</ul>
			</div>
			<hr />
			<div className={styles.group_conversations}>
				<div className={styles.top}>
					<h3>Group conversations</h3>
				</div>
				<ul>
					{groupConvosDisplay}
					<li className={styles.new_group}>
						<div className={styles.plus_btn}>
							<span></span>
						</div>
						<h4>Create New Group</h4>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Contacts;
