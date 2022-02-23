import axios from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from '../hooks/UserContext';

type Props = {
	toggleModal: Function;
	setTimelinePosts: Function;
	post: {
		_id: string;
		text: string;
		likes: string[];
		createdAt: string;
		updatedAt: string;
	} | null;
};

const PostFormModal: React.FC<Props> = ({
	toggleModal,
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
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resPosts = await axios.put(`/api/posts/${post?._id}`, postFormData);
			setTimelinePosts(resPosts.data);
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
		<div className='post-form-modal' onClick={(e) => toggleModal(e)}>
			<div className='new-post-container'>
				<div className='top'>
					<h3>Create post</h3>
					<span>
						<img src='' alt='profile-pic' />
						<h4>
							{user.first_name} {user.last_name}
						</h4>
					</span>
				</div>
				<form onSubmit={post ? (e) => handleUpdate(e) : (e) => handleSubmit(e)}>
					<textarea
						id='text'
						name='text'
						minLength={8}
						maxLength={512}
						onChange={(e) => handleChange(e)}
						value={postFormData.text}
						required
						placeholder={`What's on your mind, ${user.first_name}?`}
					/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		</div>
	);
};

export default PostFormModal;
