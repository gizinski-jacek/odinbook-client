import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NotFriends.module.scss';

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

	const notFriendsListDisplay = notFriendsList?.map((notFriend) => {
		return (
			<li key={notFriend._id} className={styles.not_friend}>
				<Link to={`/profile/${notFriend._id}`}>
					<div className={styles.pic_link}>
						<img
							src='icons/placeholder_profile_pic.png'
							alt='user-profile-pic'
						/>
					</div>
				</Link>
				<Link to={`/profile/${notFriend._id}`}>
					<h4>
						{notFriend.first_name} {notFriend.last_name}
					</h4>
				</Link>
				<div className={styles.controls}>
					<button
						type='button'
						className='btn-default btn-active'
						onClick={() => {
							handleSendRequest(notFriend._id);
						}}
					>
						Add Friend
					</button>
				</div>
			</li>
		);
	});

	return (
		<div className={styles.not_friend_list}>
			<h3>People you may want to know</h3>
			<ul>{notFriendsListDisplay ? notFriendsListDisplay : null}</ul>
		</div>
	);
};

export default NotFriends;
