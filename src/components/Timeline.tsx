// @ts-nocheck

import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styling/Timeline.module.scss';
import PostWrapper from './utils/PostWrapper';

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

const Timeline: React.FC<Props> = ({ loggedUser }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newPostFormData, setNewPostFormData] = useState({ text: '' });
	const [timelinePosts, setTimelinePosts] = useState();

	useEffect(() => {
		(async () => {
			try {
				const resUserPosts = await axios.get('/api/posts/user-posts', {
					withCredentials: true,
					headers: { 'Content-type': 'application/json' },
				});
				const resUserFriendsPosts = await axios.get(
					'/api/posts/user-friends-posts',
					{
						withCredentials: true,
						headers: { 'Content-type': 'application/json' },
					}
				);
				const posts = resUserPosts.data.concat(resUserFriendsPosts.data);
				setTimelinePosts(posts);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNewPostFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const toggleModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setShowCreateModal(false);
		}
	};

	const timelineDisplay = timelinePosts?.map((post) => {
		return <PostWrapper key={post._id} post={post} />;
	});

	return (
		<div className={styles.posts}>
			<div className='create-a-post'>
				<img src='' alt='user-profile-pic' />
				<div onClick={() => setShowCreateModal(true)}>
					<h3>{`What's on your mind, ${loggedUser.first_name}?`}</h3>
				</div>
			</div>
			{showCreateModal ? (
				<div className='new-post-modal' onClick={(e) => toggleModal(e)}>
					<div className='new-post-container'>
						<div className='top'>
							<h3>Create post</h3>
							<span>
								<img src='' alt='user-profile-pic' />
								<h4>{`${loggedUser.first_name} ${loggedUser.last_name}`}</h4>
							</span>
						</div>
						<div>
							<textarea
								id='text'
								name='text'
								minLength={8}
								maxLength={512}
								onChange={(e) => {
									handleChange(e);
								}}
								value={newPostFormData.text}
								required
								placeholder={`What's on your mind, ${loggedUser.first_name}?`}
							/>
						</div>
					</div>
				</div>
			) : null}
			<div>
				Timeline
				{timelineDisplay ? timelineDisplay : null}
			</div>
		</div>
	);
};

export default Timeline;
