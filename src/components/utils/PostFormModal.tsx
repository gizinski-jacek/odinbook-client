import axios from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from '../hooks/UserContext';
import styles from '../../styles/PostFormModal.module.scss';

type Props = {
	togglePostFormModal: Function;
	setTimelinePosts: Function;
	post?: {
		_id?: string;
		text: string;
		likes?: string[];
		createdAt?: string;
		updatedAt?: string;
	};
};

const PostFormModal: React.FC<Props> = ({
	togglePostFormModal,
	setTimelinePosts,
	post,
}) => {
	const { user } = useContext(UserContext);
	const [postFormData, setPostFormData] = useState(post ? post : { text: '' });

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resPosts = await axios.post('/api/posts', postFormData);
			setTimelinePosts(resPosts.data);
			togglePostFormModal(e, '');
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resPosts = await axios.put(`/api/posts/${post?._id}`, postFormData);
			setTimelinePosts(resPosts.data);
			togglePostFormModal(e, '');
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setPostFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div
			className={styles.post_form_modal}
			onClick={(e) => togglePostFormModal(e, postFormData.text)}
		>
			<div className={styles.new_post_container}>
				<div className={styles.top}>
					<h3>Create post</h3>
					<span
						className='close_x_btn'
						onClick={(e) => togglePostFormModal(e, postFormData.text)}
					></span>
				</div>
				<span className={styles.metadata}>
					<div className='profile-picture'>
						<img src='placeholder_profile_pic.png' alt='user-profile-pic' />
					</div>
					<h4>
						{user.first_name} {user.last_name}
					</h4>
				</span>
				<form
					onSubmit={post?._id ? (e) => handleUpdate(e) : (e) => handleSubmit(e)}
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
						className='btn-form-submit'
						type='submit'
						disabled={postFormData.text.length > 0 ? false : true}
					>
						Post
					</button>
				</form>
			</div>
		</div>
	);
};

export default PostFormModal;