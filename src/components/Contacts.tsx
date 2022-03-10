import { useContext, useEffect, useState } from 'react';
import type { User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import RequestWrapper from './utils/RequestWrapper';
import FriendWrapper from './utils/FriendWrapper';
import styles from '../styles/Contacts.module.scss';
import { UserContext } from './hooks/UserContext';

const Contacts = () => {
	const { user } = useContext(UserContext);

	const [requestsData, setRequestsData] = useState<User[]>();
	const [friendsData, setFriendsData] = useState<User[]>();
	const [conversationsData, setConversationsData] = useState<User[]>();

	useEffect(() => {
		(async () => {
			try {
				setRequestsData(await axiosGet('/api/users/requests'));
				setFriendsData(await axiosGet('/api/users/friends'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const openChat = async () => {
		try {
			// fetch past messages and load chat window
		} catch (error: any) {
			console.error(error);
		}
	};

	const requestsDisplay = requestsData?.map((request) => {
		return (
			<RequestWrapper
				key={request._id}
				request={request}
				setData={setRequestsData}
			/>
		);
	});

	const friendsDisplay = friendsData?.map((friend) => {
		return (
			<FriendWrapper key={friend._id} friend={friend} openChat={openChat} />
		);
	});

	const conversationsDisplay = conversationsData?.map((group) => {
		return (
			<li key={group._id} className={styles.group} onClick={() => openChat()}>
				<div className='profile-pic-style'>
					<span>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</span>
				</div>
				<div>
					<div>
						{/* First names of user's in group convo */}
						{group.first_name} {group.first_name}
					</div>
				</div>
			</li>
		);
	});

	return (
		<div className={styles.contacts}>
			{requestsData && requestsData.length > 0 ? (
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
			) : null}
			<div className={styles.friend_list}>
				<div className={styles.top}>
					<h3>Contacts</h3>
				</div>
				<ul>{friendsDisplay}</ul>
			</div>
			<hr />
			<div className={styles.group_conversations}>
				<div className={styles.top}>
					<h3>Group conversations</h3>
				</div>
				<ul>
					{conversationsDisplay}
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
