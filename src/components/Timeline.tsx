import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Timeline.module.scss';
import { UserContext } from './hooks/UserContext';
import PostFormModal from './utils/PostFormModal';
import PostWrapper from './utils/PostWrapper';
import type { Post, PostEdit } from '../myTypes';

const Timeline = () => {
	const { user } = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const [postsData, setPostsData] = useState<Post[]>();
	const [formData, setFormData] = useState<PostEdit>({ text: '' });

	useEffect(() => {
		(async () => {
			try {
				const resTimelinePosts = await axios.get(
					'/api/posts/user-timeline-posts',
					{ withCredentials: true }
				);
				setPostsData(resTimelinePosts.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: PostEdit
	) => {
		e.preventDefault();
		try {
			console.log(formData);
			const resTimelinePosts = await axios.post('/api/posts', formData, {
				withCredentials: true,
			});
			setPostsData(resTimelinePosts.data);
			setFormData({ text: '' });
			setShowModal(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleUpdate = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: Post
	) => {
		e.preventDefault();
		try {
			const resTimelinePosts = await axios.put(
				`/api/posts/${formData._id}`,
				formData,
				{
					withCredentials: true,
				}
			);
			setPostsData(resTimelinePosts.data);
			setFormData({ text: '' });
			setShowModal(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	const openModal = (e: React.MouseEvent<HTMLSpanElement>, post?: Post) => {
		e.stopPropagation();
		if (post) {
			setFormData(post);
		}
		setShowModal(true);
	};

	const closeModal = (
		e: React.MouseEvent<HTMLDivElement>,
		postFormData: {
			_id?: string;
			text: string;
			likes?: string[];
			createdAt?: string;
			updatedAt?: string;
		}
	) => {
		e.stopPropagation();
		if (postFormData._id) {
			setFormData({ text: '' });
		} else {
			setFormData((prevState) => ({
				...prevState,
				text: postFormData.text,
			}));
		}
		setShowModal(false);
	};

	const postsDisplay = postsData?.map((post) => {
		return (
			<PostWrapper
				key={post._id}
				setPostsData={setPostsData}
				post={post}
				openEditModal={openModal}
			/>
		);
	});

	return (
		<div className={styles.timeline}>
			<div className={styles.create_new_post}>
				<div className='profile-pic-style'>
					<Link to={`/profile/${user._id}`}>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</Link>
				</div>
				<span
					className={formData.text ? styles.not_empty : ''}
					onClick={(e) => openModal(e)}
				>
					<h4>
						{formData.text
							? formData.text
							: `What's on your mind, ${user.first_name}?`}
					</h4>
				</span>
			</div>
			{showModal ? (
				<PostFormModal
					closeModal={closeModal}
					handleSubmit={handleSubmit}
					handleUpdate={handleUpdate}
					editData={formData}
				/>
			) : null}
			{postsDisplay ? postsDisplay : null}
		</div>
	);
};

export default Timeline;
