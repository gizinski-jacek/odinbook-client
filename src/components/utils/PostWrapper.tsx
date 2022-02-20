import { useState } from 'react';

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
	const [newCommentFormData, setNewCommentFormData] = useState({ text: '' });

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNewCommentFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className='timeline-post'>
			<div>
				<div>profile picture</div>
				<div>
					<div>
						{post.author.first_name} {post.author.last_name}
					</div>
					<div>{post.createdAt}</div>
				</div>
			</div>
			<div>{post.text}</div>
			<div>
				<div>like comment</div>
				<div>comment</div>
			</div>
			<div>
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
			</div>
		</div>
	);
};

export default PostWrapper;
