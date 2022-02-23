import styles from '../../styling/Comment.module.scss';

type Props = {
	comment: {
		_id: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	};
};

const CommentWrapper: React.FC<Props> = ({ comment }) => {
	return (
		<div className={styles.comment}>
			<img src='' alt='profile-pic' />
			<div>
				<div className='metadata'>
					<h4>full name</h4>
					<p>{comment.text}</p>
				</div>
				<span className='controls'>
					<button>Like</button>
					<button>Reply</button>
					<p>{new Date(comment.createdAt).toLocaleString('en-bg')}</p>
				</span>
			</div>
		</div>
	);
};

export default CommentWrapper;
