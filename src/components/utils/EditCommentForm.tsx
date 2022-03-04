import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/EditCommentForm.module.scss';

type Props = {
	setCommentsData: Function;
	handleUpdate: Function;
	handleChange: Function;
	setEditingComment: Function;
	comment: {
		_id: string;
		author: {
			_id: string;
			first_name: string;
			last_name: string;
		};
		post_ref: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	};
};
const EditCommentForm: React.FC<Props> = ({
	handleUpdate,
	setEditingComment,
	comment,
}) => {
	const [commentFormData, setCommentFormData] = useState({ text: '' });

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setCommentFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className={styles.edit_comment}>
			<div className='profile-pic-style'>
				<Link to={`/profile/${comment.author._id}`}>
					<img src='icons/placeholder_profile_pic.png' alt='user-profile-pic' />
				</Link>
			</div>
			<form onSubmit={(e) => handleUpdate(e, comment.post_ref, comment._id)}>
				<textarea
					id='text'
					name='text'
					minLength={1}
					maxLength={512}
					onChange={(e) => handleChange(e)}
					value={commentFormData.text ? commentFormData.text : comment.text}
					required
					placeholder='Write a comment...'
				/>
				<div className={styles.edit_controls}>
					<button
						type='button'
						className='btn-default btn-cancel'
						onClick={() => {
							setCommentFormData({ text: '' });
							setEditingComment(false);
						}}
					>
						Cancel
					</button>
					<button type='submit' className='btn-default btn-form-submit'>
						Update
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditCommentForm;