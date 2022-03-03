import { useContext, useState } from 'react';
import { UserContext } from '../hooks/UserContext';
import styles from '../../styles/PostFormModal.module.scss';
import { Link } from 'react-router-dom';

type Props = {
	closeModal: Function;
	handleSubmit: Function;
	handleUpdate: Function;
	post?: {
		_id?: string;
		text: string;
		likes?: string[];
		createdAt?: string;
		updatedAt?: string;
	};
};

const PostFormModal: React.FC<Props> = ({
	closeModal,
	handleSubmit,
	handleUpdate,
	post,
}) => {
	const { user } = useContext(UserContext);

	const [postFormData, setPostFormData] = useState(post ? post : { text: '' });

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setPostFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className={styles.modal_container}>
			<span
				className={styles.grayout_bg}
				onClick={(e) => closeModal(e, postFormData)}
			></span>
			<div className={styles.new_post_container}>
				<div className={styles.top}>
					<div className={styles.title}>
						<h3>Create post</h3>
					</div>
					<div
						className={styles.close_btn}
						onClick={(e) => closeModal(e, postFormData)}
					>
						<span></span>
					</div>
				</div>
				<span className={styles.metadata}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${user._id}`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='user-profile-pic'
							/>
						</Link>
					</div>
					<h4>
						{user.first_name} {user.last_name}
					</h4>
				</span>
				<div className={styles.post_form}>
					<form
						onSubmit={
							post?._id
								? (e) => handleUpdate(e, post._id)
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
							value={postFormData.text}
							required
							placeholder={`What's on your mind, ${user.first_name}?`}
						/>
						<button
							type='submit'
							className='btn-default btn-form-submit'
							disabled={postFormData.text ? false : true}
						>
							{post?._id ? 'Update' : 'Post'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PostFormModal;
