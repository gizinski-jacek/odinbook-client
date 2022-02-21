type Props = {
	comment: {
		_id: string;
		text: string;
	};
};

const CommentWrapper: React.FC<Props> = ({ comment }) => {
	return (
		<div className='comment'>
			<div>{comment.text}</div>
		</div>
	);
};

export default CommentWrapper;
