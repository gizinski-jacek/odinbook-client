import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CommentFull } from '../../myTypes';
import styles from '../../styles/EditCommentForm.module.scss';

type Props = {
	handleUpdate: Function;
	closeEdit: Function;
	comment: CommentFull;
};

const EditCommentForm: React.FC<Props> = ({
	handleUpdate,
	closeEdit,
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
			<Link to={`/profile/${comment.author._id}`}>
				<div className='profile-pic-style'>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
			</Link>
			<form onSubmit={(e) => handleUpdate(e, formData)}>
				<textarea
					id='text'
					name='text'
					minLength={1}
					maxLength={512}
					rows={2}
					onChange={(e) => handleChange(e)}
					value={formData.text}
					required
					placeholder='Write a comment...'
				/>
				<div className={styles.edit_controls}>
					<button
						type='button'
						className='btn-default btn-cancel'
						onClick={(e) => closeEdit(e)}
					>
						Cancel
					</button>
					<button type='submit' className='btn-default btn-form-submit'>
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditCommentForm;
