import { useContext, useState } from 'react';
import { UserContext } from '../hooks/UserContext';
import styles from '../../styles/PostFormModal.module.scss';
import { Link } from 'react-router-dom';
import type { PostEdit } from '../../myTypes';

type Props = {
	closeModal: Function;
	handleSubmit: Function;
	handleUpdate: Function;
	editData: PostEdit;
};

const PostFormModal: React.FC<Props> = ({
	closeModal,
	handleSubmit,
	handleUpdate,
	editData,
}) => {
	const { user } = useContext(UserContext);

	const [formData, setFormData] = useState(editData);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className={styles.modal_container}>
			<span
				className={styles.grayout_bg}
				onClick={(e) => closeModal(e, formData)}
			></span>
			<div className={styles.new_post_container}>
				<div className={styles.top}>
					<div className={styles.title}>
						<h3>Create post</h3>
					</div>
					<div
						className={styles.close_btn}
						onClick={(e) => closeModal(e, formData)}
					>
						<span></span>
					</div>
				</div>
				<span className={styles.metadata}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${user._id}`}>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
						</Link>
					</div>
					<h4>{user.full_name}</h4>
				</span>
				<div className={styles.post_form}>
					<form
						onSubmit={
							editData?._id
								? (e) => handleUpdate(e, editData._id)
								: (e) => handleSubmit(e)
						}
					>
						<textarea
							id='text'
							name='text'
							minLength={1}
							maxLength={512}
							rows={12}
							onChange={(e) => handleChange(e)}
							value={formData.text}
							required
							placeholder={`What's on your mind, ${user.first_name}?`}
						/>
						<button
							type='submit'
							className='btn-default btn-form-submit'
							disabled={formData.text ? false : true}
						>
							{editData?._id ? 'Update' : 'Post'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PostFormModal;
