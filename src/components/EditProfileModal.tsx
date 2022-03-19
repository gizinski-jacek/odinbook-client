import { useContext, useRef, useState } from 'react';
import { UserContext } from './hooks/UserContext';
import { User } from '../myTypes';
import { axiosPut } from './utils/axiosFunctions';
import styles from '../styles/EditProfileModal.module.scss';

type Props = {
	closeModal: Function;
	setData: Function;
	data: User;
};

const EditProfileModal: React.FC<Props> = ({ closeModal, setData, data }) => {
	const { user } = useContext(UserContext);

	const pictureRef = useRef<HTMLInputElement>(null);

	const [errors, setErrors] = useState<{ msg: string }[]>();
	const [bioForm, setBioForm] = useState(false);
	const [bioInput, setBioInput] = useState(data.bio ? data.bio : '');
	const [pictureData, setPictureData] = useState<{
		preview: string;
		data: {};
	} | null>(null);

	const clickSelectFile = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		pictureRef.current?.click();
	};

	const toggleBioForm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setBioForm((prevState) => !prevState);
	};

	const handleAddFile = (e: any) => {
		e.stopPropagation();
		const file = e.target.files[0];
		if (file.size > 2000000) {
			setErrors([{ msg: 'File too big. Max. size 2mb' }]);
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
		bio: string,
		profile_picture: any
	) => {
		e.preventDefault();
		try {
			const newData = new FormData();
			newData.append('bio', bio);
			newData.append('profile_picture', profile_picture);
			setData(await axiosPut(`/api/users/${user._id}`, newData));
			closeModal(e);
		} catch (error: any) {
			if (!Array.isArray(error.response.data)) {
				if (typeof error.response.data === 'object') {
					setErrors([error.response.data]);
				}
				if (typeof error.response.data === 'string') {
					setErrors([{ msg: error.response.data }]);
				}
			} else {
				setErrors(error.response.data);
			}
		}
	};

	const errorsDisplay = errors?.map((error, index) => {
		return (
			<li key={index} className='error-msg'>
				{error.msg}
			</li>
		);
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
						onClick={(e) => closeModal(e)}
					>
						<span></span>
					</button>
				</div>
				<hr />
				{errorsDisplay ? <ul className='error-list'>{errorsDisplay}</ul> : null}
				<div className={styles.body}>
					<form
						encType='multipart/form-data'
						onSubmit={(e) => handleSubmit(e, bioInput, pictureData?.data)}
					>
						<div className={styles.edit_profile_picture}>
							<div className={styles.section_name}>
								<h3>Profile picture</h3>
								<div className={styles.controls}>
									{pictureData ? (
										<button
											type='button'
											className={`btn-default btn-danger ${styles.remove_btn}`}
											onClick={handleRemoveFile}
										>
											Remove
										</button>
									) : null}
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
										onChange={handleAddFile}
									/>
								</div>
							</div>
							<div className='profile-pic-style' onClick={clickSelectFile}>
								<img
									src={
										pictureData?.preview
											? pictureData.preview
											: user.profile_picture
											? `http://localhost:4000/${user.profile_picture}`
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
						<button type='submit' className='btn-default btn-form-submit'>
							Save Your Profile Info
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfileModal;
