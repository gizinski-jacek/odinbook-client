// @ts-nocheck

import { useState } from 'react';
import styles from '../styling/FriendList.module.scss';
import FriendWrapper from './utils/FriendWrapper';
import RequestWrapper from './utils/RequestWrapper';

type Props = {
	loggedUser: {
		_id: string;
		email: string;
		first_name: string;
		last_name: string;
		friendList: string[];
		friendRequiests: string[];
	};
};

const FriendList: React.FC<Props> = ({ loggedUser }) => {
	const [friendList, setFriendList] = useState(loggedUser.friendList);
	const [friendRequests, setFriendRequests] = useState(
		loggedUser.friendRequiests
	);

	const friendListDisplay = friendList?.map((friend) => {
		return <FriendWrapper key={friend} friend={friend} />;
	});

	const friendRequestsDisplay = friendRequests?.map((request) => {
		return <RequestWrapper key={request} request={request} />;
	});

	return (
		<div className={styles.friends}>
			<div>FriendList</div>
		</div>
	);
};

export default FriendList;
