import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CommentFull } from '../../myTypes';
import styles from '../../styles/EditCommentForm.module.scss';

type Props = {
	closeModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleUpdate: (
		e: React.FormEvent<HTMLFormElement>,
		data: CommentFull
	) => void;
	comment: CommentFull;
};

const EditCommentForm: React.FC<Props> = ({
	closeModal,
	handleUpdate,
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
					<img
						src={
							comment.author.profile_picture
								? `http://localhost:4000/photos/${comment.author.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
			</Link>
			<form onSubmit={(e) => handleUpdate(e, formData)}>
				<textarea
					id={`text_${comment._id}`}
					name='text'
					minLength={1}
					maxLength={512}
					rows={2}
					onChange={handleChange}
					value={formData.text}
					required
					autoFocus
					placeholder='Write a comment...'
				/>
				<div className={styles.edit_controls}>
					<button
						type='button'
						className='btn-default btn-cancel'
						onClick={closeModal}
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
