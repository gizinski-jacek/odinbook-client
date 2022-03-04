import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/NotFriends.module.scss';
import NotFriendWrapper from './utils/NotFriendWrapper';

type AllUsers = [
	user: {
		_id: string;
		email: string;
		first_name: string;
		last_name: string;
	}
];

const NotFriends = () => {
	const [notFriendsList, setNotFriendsList] = useState<AllUsers>();

	useEffect(() => {
		(async () => {
			try {
				const resNotFriendsData = await axios.get('/api/users', {
					withCredentials: true,
				});
				setNotFriendsList(resNotFriendsData.data);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	const handleSendRequest = async (userId: string) => {
		try {
			const resNotFriendsData = await axios.put(
				`/api/users/${userId}/send-request`,
				{ withCredentials: true }
			);
			// setNotFriendsList(resNotFriendsData.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.not_friend_list}>
			<h3>People you may want to know</h3>
			{notFriendsList ? (
				<ul>
					{notFriendsList.map((notFriend) => {
						return (
							<NotFriendWrapper
								key={notFriend._id}
								notFriend={notFriend}
								handleSendRequest={handleSendRequest}
							/>
						);
					})}
				</ul>
			) : null}
		</div>
	);
};

export default NotFriends;
