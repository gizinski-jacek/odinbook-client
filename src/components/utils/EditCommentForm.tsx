import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CommentFull } from '../../myTypes';
import styles from '../../styles/EditCommentForm.module.scss';

type Props = {
	handleUpdate: Function;
	setEditComment: Function;
	comment: CommentFull;
};

const EditCommentForm: React.FC<Props> = ({
	handleUpdate,
	setEditComment,
	comment,
}) => {
	const [formData, setFormData] = useState(comment);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className={styles.edit_comment}>
			<div className='profile-pic-style'>
				<Link to={`/profile/${comment.author._id}`}>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</Link>
			</div>
			<form onSubmit={(e) => handleUpdate(e, formData)}>
				<textarea
					id='text'
					name='text'
					minLength={1}
					maxLength={512}
					onChange={(e) => handleChange(e)}
					value={formData.text}
					required
					placeholder='Write a comment...'
				/>
				<div className={styles.edit_controls}>
					<button
						type='button'
						className='btn-default btn-cancel'
						onClick={() => setEditComment(false)}
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
