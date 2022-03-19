import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PostFull, User } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import PostWrapper from './utils/PostWrapper';
import styles from '../styles/ProfilePosts.module.scss';

const ProfilePosts = () => {
	const params = useParams();

	const [userData, setUserData] = useState<User>();
	const [postsData, setPostsData] = useState<PostFull[]>([]);

	useEffect(() => {
		(async () => {
			try {
				setUserData(await axiosGet(`/api/users/${params.userid}`));
				setPostsData(await axiosGet(`/api/users/${params.userid}/posts`));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params.userid]);

	const postsDisplay = postsData?.map((post) => {
		return <PostWrapper key={post._id} post={post} />;
	});

	return (
		<div className={styles.profile_page_posts}>
			<div className={styles.bio}>
				<h3>Bio</h3>
				<p>{userData?.bio}</p>
			</div>
			<div className={styles.profile_posts}>
				{postsDisplay.length > 0 ? (
					postsDisplay
				) : (
					<h3 className={styles.empty}>No posts to show</h3>
				)}
			</div>
		</div>
	);
};

export default ProfilePosts;
