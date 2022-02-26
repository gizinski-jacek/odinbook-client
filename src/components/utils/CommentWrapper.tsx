import axios from 'axios';
import styles from '../../styles/Comment.module.scss';

type Props = {
	comment: {
		_id: string;
		post_ref: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	};
	setCommentsData: Function;
};

const CommentWrapper: React.FC<Props> = ({ comment, setCommentsData }) => {
	const handleLike = async () => {
		try {
			const resCommentList = await axios.put(
				`/api/post/${comment.post_ref}/comments/${comment._id}/like`
			);
			setCommentsData(resCommentList);
		} catch (error) {
			console.error(error);
		}
	};

	const handleReply = async () => {
		try {
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.comment}>
			<div className='profile-picture'>
				<img src='placeholder_profile_pic.png' alt='user-profile-pic' />
			</div>
			<div className={styles.body}>
				<div className={styles.metadata}>
					<h5>full name</h5>
					<p>{comment.text}</p>
				</div>
				<span className={styles.controls}>
					<div className={styles.like_btn} onClick={() => handleLike()}>
						Like
					</div>
					<div className={styles.reply_btn} onClick={() => handleReply()}>
						Reply
					</div>
					<h5 className={styles.controls}>
						{new Date(comment.createdAt).toLocaleString('en-bg')}
					</h5>
				</span>
			</div>
		</div>
	);
};

export default CommentWrapper;
