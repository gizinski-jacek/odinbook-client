import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import { PostFull, PostNew } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import PostFormModal from './utils/PostFormModal';
import PostWrapper from './utils/PostWrapper';
import styles from '../styles/Timeline.module.scss';

const Timeline = () => {
	const { user } = useContext(UserContext);

	const [postsData, setPostsData] = useState<PostFull[]>();
	const [formData, setFormData] = useState<PostNew>({ text: '' });
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setPostsData(await axiosGet('/api/posts/timeline'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeModal = (e: React.MouseEvent<HTMLDivElement>, data: PostNew) => {
		e.stopPropagation();
		if (data._id) {
			setFormData({ text: '' });
		} else {
			setFormData(data);
		}
		setShowModal(false);
	};

	const postsDisplay = postsData?.map((post) => {
		return <PostWrapper key={post._id} post={post} />;
	});

	return (
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
					className={formData.text ? styles.not_empty : ''}
					onClick={openModal}
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
					setData={setPostsData}
					post={formData}
				/>
			) : null}
			{postsDisplay ? postsDisplay : null}
		</div>
	);
};

export default Timeline;
