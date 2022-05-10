import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import { FormError, PostFull, PostNew } from '../utils/myTypes';
import { axiosPost, axiosPut } from '../utils/axiosFunctions';
import FormErrorWrapper from '../utils/wrappers/FormErrorWrapper';
import styles from '../../styles/PostFormModal.module.scss';

type Props = {
	closeModal: (
		e:
			| React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
			| React.FormEvent<HTMLFormElement>,
		data: PostNew | PostFull,
		pictureData: {
			preview: string;
			data: File;
		} | null
	) => void;
	updateTimeline?: (
		e: React.FormEvent<HTMLFormElement>,
		data: PostFull[]
	) => void;
	updatePost?: (e: React.FormEvent<HTMLFormElement>, data: PostFull) => void;
	postData: PostNew | PostFull;
	postPictureData: {
		preview: string;
		data: File;
	} | null;
};

const PostFormModal: React.FC<Props> = ({
	closeModal,
	updateTimeline,
	updatePost,
	postData,
	postPictureData,
}) => {
	const { user } = useContext(UserContext);

	const pictureRef = useRef<HTMLInputElement>(null);

	const [errors, setErrors] = useState<FormError[]>([]);
	const [formData, setFormData] = useState<PostFull | PostNew>(postData);
	const [pictureData, setPictureData] = useState<{
		preview: string;
		data: File;
	} | null>(postPictureData || null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const clickSelectFile = (
		e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
	) => {
		e.stopPropagation();
		pictureRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent) => {
		e.stopPropagation();
		setErrors([]);
		const target = e.target as HTMLInputElement;
		const file = (target.files as FileList)[0];
		if (file.size > 2000000) {
			setErrors([{ msg: 'File too large' }]);
			return;
		}
		if (
			file.type !== 'image/png' &&
			file.type !== 'image/jpg' &&
			file.type !== 'image/jpeg'
		) {
			setErrors([{ msg: 'Only images (png, jpg, jpeg) are allowed' }]);
			return;
		}
		setPictureData({
			preview: URL.createObjectURL(file),
			data: file,
		});
	};

	const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setPictureData(null);
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		data: PostFull | PostNew,
		pictureData?: File
	) => {
		e.preventDefault();
		try {
			const postData: any = new FormData();
			for (const [key, value] of Object.entries(data)) {
				postData.append(key, value);
			}
			if (pictureData) {
				postData.append('post_picture', pictureData);
			}
			if (data._id && updatePost) {
				updatePost(e, await axiosPut(`/api/posts/${data._id}`, postData));
			} else if (updateTimeline) {
				updateTimeline(e, await axiosPost('/api/posts', postData));
			}
			closeModal(e, { text: '' }, null);
		} catch (error: any) {
			if (!Array.isArray(error.response.data)) {
				if (typeof error.response.data === 'object') {
					setErrors([error.response.data]);
					return;
				}
				if (typeof error.response.data === 'string') {
					setErrors([{ msg: error.response.data }]);
					return;
				}
			} else {
				setErrors(error.response.data);
			}
		}
	};

	const errorsDisplay = errors.map((error, index) => {
		return <FormErrorWrapper key={index} error={error} />;
	});

	return (
		user && (
			<div className={styles.modal_container}>
				<span
					className={styles.grayout_bg}
					onClick={(e) => closeModal(e, formData, pictureData)}
				></span>
				<div className={styles.new_post_container}>
					<div className={styles.top}>
						<div className={styles.title}>
							<h3>{postData._id ? 'Update post' : 'Create post'}</h3>
						</div>
						<button
							type='button'
							className={styles.close_btn}
							onClick={(e) => closeModal(e, formData, pictureData)}
						>
							<span></span>
						</button>
					</div>
					<span className={styles.metadata}>
						<Link to={`/profile/${user._id}`}>
							<div className='profile_pic_style'>
								<img
									src={
										user.profile_picture_url || '/placeholder_profile_pic.png'
									}
									alt='User profile pic'
								/>
							</div>
						</Link>
						<h4>
							{user.first_name} {user.last_name}
						</h4>
					</span>
					<div className={styles.body}>
						<form
							encType='multipart/form-data'
							onSubmit={(e) => handleSubmit(e, formData, pictureData?.data)}
						>
							<textarea
								name='text'
								minLength={1}
								maxLength={512}
								rows={10}
								onChange={handleChange}
								value={formData.text}
								required
								autoFocus
								placeholder={`What's on your mind, ${user.first_name}?`}
							/>
							{(pictureData || formData.picture_url) && (
								<div
									className={styles.post_picture}
									onClick={(e) => clickSelectFile(e)}
								>
									<img
										src={pictureData?.preview || formData.picture_url}
										alt='Post pic'
									/>
								</div>
							)}
							<input
								style={{ display: 'none' }}
								ref={pictureRef}
								type='file'
								name='post_picture'
								onChange={handleFileChange}
							/>
							{errorsDisplay && <ul className='error_list'>{errorsDisplay}</ul>}
							{pictureData ? (
								<button
									type='button'
									className='btn_default btn_danger'
									onClick={(e) => handleRemoveFile(e)}
								>
									Remove Selected Picture
								</button>
							) : (
								<button
									type='button'
									className='btn_default btn_active'
									onClick={(e) => clickSelectFile(e)}
								>
									Add Picture
								</button>
							)}
							<button
								type='submit'
								className='btn_default btn_form_submit'
								disabled={formData.text ? false : true}
							>
								{postData._id ? 'Save' : 'Post'}
							</button>
						</form>
					</div>
				</div>
			</div>
		)
	);
};

export default PostFormModal;
