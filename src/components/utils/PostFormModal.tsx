import axios from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from '../hooks/UserContext';
import styles from '../../styles/PostFormModal.module.scss';
import { Link } from 'react-router-dom';

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
					<div className={styles.title}>
						<h3>Create post</h3>
					</div>
					<div
						className={styles.close_btn}
						onClick={(e) => togglePostFormModal(e, postFormData.text)}
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
							post?._id ? (e) => handleUpdate(e) : (e) => handleSubmit(e)
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
							disabled={postFormData.text.length > 0 ? false : true}
						>
							Post
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PostFormModal;
