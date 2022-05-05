import { Link } from 'react-router-dom';
import { PostFull } from '../myTypes';
import styles from '../../../styles/SearchPostResult.module.scss';

type Props = {
	post: PostFull;
};

const SearchPostResultWrapper: React.FC<Props> = ({ post }) => {
	return (
		<li>
			<Link className={styles.search_result} to={`/profile/${post.author._id}`}>
				<div className='profile_pic_style'>
					<img
						src={
							post.author.profile_picture_url || '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
				<span className={styles.contents}>{post.text}</span>
			</Link>
		</li>
	);
};

export default SearchPostResultWrapper;
