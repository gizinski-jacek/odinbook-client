import { useContext, useRef, useState } from 'react';
import { UserContext } from './hooks/UserContext';
import type { FormError, User } from '../myTypes';
import { axiosPut } from './utils/axiosFunctions';
import FormErrorWrapper from './utils/FormErrorWrapper';
import styles from '../styles/EditProfileModal.module.scss';

type Props = {
	closeModal: (
		e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>
	) => void;
	setData: (data: User) => void;
	data: User;
};

const EditProfileModal: React.FC<Props> = ({ closeModal, setData, data }) => {
	const { setUser } = useContext(UserContext);

	const pictureRef = useRef<HTMLInputElement>(null);

	const [errors, setErrors] = useState<FormError[]>([]);
	const [bioForm, setBioForm] = useState(false);
	const [bioInput, setBioInput] = useState(data.bio ? data.bio : '');
	const [pictureData, setPictureData] = useState<{
		preview: string;
		data: {};
	} | null>(null);

	const toggleBioForm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setBioForm((prevState) => !prevState);
	};

	const clickSelectFile = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		pictureRef.current?.click();
	};

	const handleFileChange = (e: any) => {
		e.stopPropagation();
		setErrors([]);
		const file = e.target.files[0];
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
		userId: string,
		bio: string,
		profile_picture: any
	) => {
		e.preventDefault();
		try {
			const newData = new FormData();
			newData.append('bio', bio);
			newData.append('profile_picture', profile_picture);
			const resData = await axiosPut(`/api/users`, newData);
			setData(resData);
			setUser(resData);
			closeModal(e);
		} catch (error: any) {
			if (
				error.response.data.name &&
				error.response.data.name.includes('MulterError')
			) {
				setErrors([{ msg: error.response.data.message }]);
				return;
			}
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
		<div className={styles.modal_container}>
			<span className={styles.grayout_bg} onClick={(e) => closeModal(e)}></span>
			<div className={styles.edit_profile_container}>
				<div className={styles.top}>
					<div className={styles.title}>
						<h3>Edit profile</h3>
					</div>
					<button
						type='button'
						className={styles.close_btn}
						onClick={closeModal}
					>
						<span></span>
					</button>
				</div>
				<hr />
				<div className={styles.body}>
					<form
						encType='multipart/form-data'
						onSubmit={(e) =>
							handleSubmit(e, data._id, bioInput, pictureData?.data)
						}
					>
						<div className={styles.edit_profile_picture}>
							<div className={styles.section_name}>
								<h3>Profile picture</h3>
								<div className={styles.controls}>
									{pictureData && (
										<button
											type='button'
											className={`btn-default btn-danger ${styles.remove_btn}`}
											onClick={handleRemoveFile}
										>
											Remove
										</button>
									)}
									<button
										type='button'
										className={`btn-default btn-active ${styles.add_btn}`}
										onClick={clickSelectFile}
									>
										Edit
									</button>
									<input
										style={{ display: 'none' }}
										ref={pictureRef}
										type='file'
										id='profile_picture'
										name='profile_picture'
										onChange={handleFileChange}
									/>
								</div>
							</div>
							<div className='profile-pic-style' onClick={clickSelectFile}>
								<img
									src={
										pictureData?.preview
											? pictureData.preview
											: data.profile_picture
											? `http://localhost:4000/photos/${data.profile_picture}`
											: '/placeholder_profile_pic.png'
									}
									alt='User profile pic'
								/>
							</div>
						</div>
						<div className={styles.edit_bio}>
							<div className={styles.section_name}>
								<h3>Bio</h3>
								<div className={styles.controls}>
									<button
										type='button'
										className={`btn-default btn-active ${styles.edit_btn}`}
										onClick={toggleBioForm}
									>
										{bioForm ? 'Save' : 'Edit'}
									</button>
								</div>
							</div>
							{bioForm ? (
								<label>
									<textarea
										id='bio'
										name='bio'
										maxLength={512}
										rows={5}
										onChange={(e) => setBioInput(e.target.value)}
										value={bioInput}
										placeholder='Describe yourself...'
										autoFocus
									/>
								</label>
							) : (
								<p>{bioInput}</p>
							)}
						</div>
						{errorsDisplay && <ul className='error-list'>{errorsDisplay}</ul>}
						<button
							type='submit'
							className='btn-default btn-form-submit'
							disabled={errors?.length > 0 ? true : false}
						>
							Save Your Profile Info
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfileModal;
