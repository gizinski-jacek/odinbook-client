//@ts-nocheck

import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Timeline.module.scss';
import { UserContext } from './hooks/UserContext';
import PostFormModal from './utils/PostFormModal';
import PostWrapper from './utils/PostWrapper';

type Post = {
	_id?: string;
	author?: {
		_id: string;
		first_name: string;
		last_name: string;
	};
	text: string;
	comments?: string[];
	likes?: string[];
	createdAt?: string;
	updatedAt?: string;
};

type TimelinePosts = [Post];

const Timeline = () => {
	const { user } = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const [timelinePosts, setTimelinePosts] = useState<TimelinePosts>();
	const [postFormData, setPostFormData] = useState<Post>({ text: '' });

	useEffect(() => {
		(async () => {
			try {
				const resTimelinePosts = await axios.get(
					'/api/posts/user-timeline-posts',
					{ withCredentials: true }
				);
				setTimelinePosts(resTimelinePosts.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resPosts = await axios.post('/api/posts', postFormData, {
				withCredentials: false,
			});
			setTimelinePosts(resPosts.data);
			setPostFormData({ text: '' });
			setShowModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = async (
		e: React.FormEvent<HTMLFormElement>,
		postId: string | undefined
	) => {
		e.preventDefault();
		try {
			const resPosts = await axios.put(`/api/posts/${postId}`, postFormData, {
				withCredentials: true,
			});
			setTimelinePosts(resPosts.data);
			setPostFormData({ text: '' });
			setShowModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const openModal = (e: React.MouseEvent<HTMLDivElement>, post?: Post) => {
		e.stopPropagation();
		if (post) {
			setPostFormData(post);
		}
		setShowModal(true);
	};

	const closeModal = (
		e: React.MouseEvent<HTMLDivElement>,
		postFormData?: string
	) => {
		e.stopPropagation();
		if (postFormData._id) {
			setPostFormData({ text: '' });
		} else {
			setPostFormData((prevState) => ({
				...prevState,
				text: postFormData.text,
			}));
		}
		setShowModal(false);
	};

	const timelineDisplay = timelinePosts?.map((post) => {
		return <PostWrapper key={post._id} post={post} openEditModal={openModal} />;
	});

	return (
		<div className={styles.timeline}>
			<div className={styles.create_new_post}>
				<div className='profile-pic-style'>
					<Link to={`/profile/${user._id}`}>
						<img
							src='icons/placeholder_profile_pic.png'
							alt='user-profile-pic'
						/>
					</Link>
				</div>
				<span
					className={postFormData.text ? styles.not_empty : ''}
					onClick={(e) => openModal(e)}
				>
					<h4>
						{postFormData.text
							? postFormData.text
							: `What's on your mind, ${user.first_name}?`}
					</h4>
				</span>
			</div>
			{showModal ? (
				<PostFormModal
					closeModal={closeModal}
					handleSubmit={handleSubmit}
					handleUpdate={handleUpdate}
					post={postFormData}
				/>
			) : null}
			{timelineDisplay ? timelineDisplay : null}
		</div>
	);
};

export default Timeline;
