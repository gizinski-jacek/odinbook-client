import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserProvider';
import type { PostFull, PostNew } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import PostFormModal from './utils/PostFormModal';
import PostWrapper from './utils/PostWrapper';
import styles from '../styles/Timeline.module.scss';

const Timeline = () => {
	const { user } = useContext(UserContext);

	const [timelinePostsData, setTimelinePostsData] = useState<PostFull[]>([]);
	const [newPostData, setFormData] = useState<PostNew>({ text: '' });
	const [newPostPictureData, setPictureData] = useState<{
		preview: string;
		data: {};
	} | null>(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setTimelinePostsData(await axiosGet('/api/posts/timeline'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const updateTimeline = (
		e: React.FormEvent<HTMLFormElement>,
		data: PostFull[]
	) => {
		e.stopPropagation();
		setTimelinePostsData(data);
	};

	const closeModal = (
		e: React.MouseEvent<HTMLSpanElement> | React.FormEvent<HTMLFormElement>,
		data: PostFull | PostNew,
		pictureData?: any
	) => {
		e.stopPropagation();
		const element = e.target as HTMLElement;
		if (data._id && element.tagName === 'FORM') {
			setFormData({ text: '' });
			setPictureData(null);
		} else {
			setFormData(data);
			setPictureData(pictureData);
		}
		setShowModal(false);
	};

	const postsDisplay = timelinePostsData?.map((post) => {
		return <PostWrapper key={post._id} post={post} />;
	});

	return (
		user && (
			<div className={styles.timeline}>
				<div className={styles.create_new_post}>
					<Link to={`/profile/${user._id}`}>
						<div className='profile-pic-style'>
							<img
								src={
									user.profile_picture
										? `http://localhost:4000/photos/${user.profile_picture}`
										: '/placeholder_profile_pic.png'
								}
								alt='User profile pic'
							/>
						</div>
					</Link>
					<span
						className={newPostData.text ? styles.not_empty : ''}
						onClick={(e) => openModal(e)}
					>
						<h4>
							{newPostData.text
								? newPostData.text
								: `What's on your mind, ${user.first_name}?`}
						</h4>
					</span>
				</div>
				{showModal && (
					<PostFormModal
						closeModal={closeModal}
						updateTimeline={updateTimeline}
						postData={newPostData}
						postPictureData={newPostPictureData}
					/>
				)}
				{postsDisplay.length > 0 && postsDisplay}
			</div>
		)
	);
};

export default Timeline;
