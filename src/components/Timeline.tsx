import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import styles from '../styling/Timeline.module.scss';
import { UserContext } from './hooks/UserContext';
import PostFormModal from './utils/PostFormModal';
import PostWrapper from './utils/PostWrapper';

type TimelinePosts = [
	post: {
		_id: string;
		author: {
			_id: string;
			first_name: string;
			last_name: string;
		};
		text: string;
		comments: string[];
		likes: string[];
		createdAt: string;
		updatedAt: string;
	}
];

const Timeline = () => {
	const { user } = useContext(UserContext);
	const [showPostFormModal, setShowPostFormModal] = useState(false);
	const [timelinePosts, setTimelinePosts] = useState<TimelinePosts>();

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

	const toggleModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setShowPostFormModal(false);
		}
	};

	const timelineDisplay = timelinePosts?.map((post) => {
		return (
			<PostWrapper
				key={post._id}
				post={post}
				setTimelinePosts={setTimelinePosts}
			/>
		);
	});

	return (
		<div className={styles.posts}>
			<div className='create-a-post'>
				<img src='' alt='user-profile-pic' />
				<button onClick={() => setShowPostFormModal(true)}>
					<h4>{`What's on your mind, ${user.first_name}?`}</h4>
				</button>
			</div>
			{showPostFormModal ? (
				<PostFormModal
					toggleModal={toggleModal}
					setTimelinePosts={setTimelinePosts}
					post={null}
				/>
			) : null}
			{timelineDisplay ? timelineDisplay : null}
		</div>
	);
};

export default Timeline;
