import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Timeline.module.scss';
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
	const [postText, setPostText] = useState('');

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

	const togglePostFormModal = (
		e: React.MouseEvent<HTMLDivElement>,
		text: string
	) => {
		if (e.target === e.currentTarget) {
			setShowPostFormModal(false);
			setPostText(text);
		}
	};

	const timelineDisplay = timelinePosts?.map((post) => {
		return (
			<PostWrapper
				key={post._id}
				post={post}
				setTimelinePosts={setTimelinePosts}
				setShowPostFormModal={setShowPostFormModal}
			/>
		);
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
					className={postText ? styles.not_empty : ''}
					onClick={() => setShowPostFormModal(true)}
				>
					<h4>
						{postText ? postText : `What's on your mind, ${user.first_name}?`}
					</h4>
				</span>
			</div>
			{showPostFormModal ? (
				<PostFormModal
					togglePostFormModal={togglePostFormModal}
					setTimelinePosts={setTimelinePosts}
					post={{ text: postText }}
				/>
			) : null}
			{timelineDisplay ? timelineDisplay : null}
		</div>
	);
};

export default Timeline;
