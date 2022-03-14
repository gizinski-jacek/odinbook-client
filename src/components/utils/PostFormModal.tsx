import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { PostFull, PostNew } from '../../myTypes';
import { axiosPost, axiosPut } from './axiosFunctions';
import styles from '../../styles/PostFormModal.module.scss';

type Props = {
	closeModal: Function;
	setData: Function;
	post: PostFull | PostNew;
};

const PostFormModal: React.FC<Props> = ({ closeModal, setData, post }) => {
	const { user } = useContext(UserContext);

	const [formData, setFormData] = useState<PostFull | PostNew>(post);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		data: PostFull | PostNew
	) => {
		e.preventDefault();
		try {
			if (post._id) {
				setData(await axiosPut(`/api/posts/${data._id}`, data));
			} else {
				setData(await axiosPost('/api/posts', data));
			}
			closeModal(e, { text: '' });
		} catch (error: any) {
			console.error(error);
		}
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
						<h3>{post._id ? 'Update post' : 'Create post'}</h3>
					</div>
					<div
						className={styles.close_btn}
						onClick={(e) => closeModal(e, formData)}
					>
						<span></span>
					</div>
				</div>
				<span className={styles.metadata}>
					<Link to={`/profile/${user._id}`}>
						<div className='profile-pic-style'>
							<img src='placeholder_profile_pic.png' alt='User profile pic' />
						</div>
					</Link>
					<h4>
						{user.first_name} {user.last_name}
					</h4>
				</span>
				<div className={styles.post_form}>
					<form onSubmit={(e) => handleSubmit(e, formData)}>
						<textarea
							id='text'
							name='text'
							minLength={1}
							maxLength={512}
							rows={12}
							onChange={handleChange}
							value={formData.text}
							required
							placeholder={`What's on your mind, ${user.first_name}?`}
						/>
						<button
							type='submit'
							className='btn-default btn-form-submit'
							disabled={formData.text ? false : true}
						>
							{post._id ? 'Save' : 'Post'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PostFormModal;
