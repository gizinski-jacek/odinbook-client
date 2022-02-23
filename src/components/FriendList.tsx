// @ts-nocheck

import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styling/FriendList.module.scss';
import FriendWrapper from './utils/FriendWrapper';
import RequestWrapper from './utils/RequestWrapper';

const FriendList = () => {
	const [friendList, setFriendList] = useState();
	const [friendRequests, setFriendRequests] = useState();

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

	const acceptRequest = async (request) => {
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

	const declineRequest = async (request) => {
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

	const openChat = async (friend) => {
		try {
			// fetch past messages and load chat window
			console.log('load chat window');
		} catch (error: any) {
			console.error(error);
		}
	};

	const friendListDisplay = friendList?.map((friend) => {
		return (
			<FriendWrapper key={friend._id} friend={friend} openChat={openChat} />
		);
	});

	const friendRequestsDisplay = friendRequests?.map((request) => {
		return (
			<RequestWrapper
				key={request._id}
				request={request}
				acceptRequest={acceptRequest}
				declineRequest={declineRequest}
			/>
		);
	});

	return (
		<div className={styles.friends}>
			<div>Friend Requests</div>
			<div>{friendRequestsDisplay}</div>
			<div>Friend List</div>
			<div>{friendListDisplay}</div>
		</div>
	);
};

export default FriendList;
