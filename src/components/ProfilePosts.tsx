import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ProfilePosts.module.scss';
import type { Post } from '../myTypes';
import PostWrapper from './utils/PostWrapper';

const ProfilePosts = () => {
	const params = useParams();

	const [postsData, setPostsData] = useState<Post[]>();

	useEffect(() => {
		(async () => {
			try {
				const resPosts = await axios.get(`/api/users/${params.userid}/posts`);
				setPostsData(resPosts.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params.userid]);

	const postsDisplay = postsData?.map((post) => {
		return (
			<PostWrapper
				key={post._id}
				setPostsData={setPostsData}
				post={post}
				openEditModal={setPostsData}
			/>
		);
	});

	return (
		<div className={styles.profile_page_posts}>
			<div className={styles.profile_info}>
				<div>
					<h3>Intro</h3>
				</div>
				<div>
					<h3>Photos</h3>
				</div>
				<div>
					<h3>Friends</h3>
				</div>
			</div>
			<div className={styles.profile_posts}>
				{postsDisplay && postsDisplay.length > 0 ? (
					postsDisplay
				) : (
					<h3 className={styles.empty}>No posts available</h3>
				)}
			</div>
		</div>
	);
};

export default ProfilePosts;
