import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../../styling/Post.module.scss';
import CommentWrapper from './CommentWrapper';

type Props = {
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
	};
};

const PostWrapper: React.FC<Props> = ({ post }) => {
	const [commentsData, setCommentsData] =
		useState<Array<{ _id: string; text: string }>>();
	const [newCommentFormData, setNewCommentFormData] = useState({ text: '' });

	useEffect(() => {
		(async () => {
			try {
				const resCommentsData = await axios.get(
					`/api/posts/${post._id}/comments`,
					{ withCredentials: true }
				);
				setCommentsData(resCommentsData.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNewCommentFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resCommentsData = await axios.post(
				`/api/posts/${post._id}/comments`,
				newCommentFormData,
				{ withCredentials: true }
			);
			setCommentsData(resCommentsData.data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const commentsDisplay = commentsData?.map((comment) => {
		return <CommentWrapper key={comment._id} comment={comment} />;
	});

	return (
		<div className={styles.post}>
			<div>
				<div>profile picture</div>
				<div>
					<div>
						{post.author.first_name} {post.author.last_name}
					</div>
					<div>{new Date(post.createdAt).toLocaleString('en-gb')}</div>
				</div>
			</div>
			<div>{post.text}</div>
			<div>
				<div>like post</div>
				<div>add comment</div>
			</div>
			<form className={styles.new_comment} onSubmit={(e) => handleSubmit(e)}>
				<div>profile picture</div>
				<textarea
					id='text'
					name='text'
					minLength={8}
					maxLength={512}
					onChange={(e) => handleChange(e)}
					value={newCommentFormData.text}
					required
					placeholder='Write a comment'
				/>
				<button type='submit'>Submit</button>
			</form>
			{commentsDisplay ? commentsDisplay : null}
		</div>
	);
};

export default PostWrapper;
