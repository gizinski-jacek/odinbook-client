import { useRef, useState } from 'react';
import { User } from '../myTypes';
import { axiosPut } from './utils/axiosFunctions';
import styles from '../styles/EditProfileModal.module.scss';

type Props = {
	closeModal: Function;
	setData: Function;
	data: User;
};

const EditProfileModal: React.FC<Props> = ({ closeModal, setData, data }) => {
	const [errors, setErrors] = useState<{ msg: string }[]>();
	const [formData, setFormData] = useState(data);

	const profilePicRef = useRef<HTMLInputElement>(null);
	const coverPhotoRef = useRef<HTMLInputElement>(null);

	const [bioForm, setBioForm] = useState(false);
	const [hobbiesForm, setHobbiesForm] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		data: User
	) => {
		e.preventDefault();
		try {
			setData(await axiosPut(`/api/users/${data._id}`, data));
		} catch (error: any) {
			console.error(error);
		}
	};

	const addPicture = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		profilePicRef.current?.click();
	};

	const toggleBioForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setBioForm((prevState) => !prevState);
	};

	const toggleHobbiesForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setHobbiesForm((prevState) => !prevState);
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
					<div className={styles.close_btn} onClick={(e) => closeModal(e)}>
						<span></span>
					</div>
				</div>
				<hr />
				{errorsDisplay ? <ul className='error-list'>{errorsDisplay}</ul> : null}
				<div className={styles.body}>
					<form onSubmit={(e) => handleSubmit(e, formData)}>
						<div className={styles.edit_profile_picture}>
							<div className={styles.section_name}>
								<h3>Profile picture</h3>
								<div
									className={`btn-default btn-active ${styles.add_btn}`}
									onClick={addPicture}
								>
									Edit
								</div>
								<input
									style={{ display: 'none' }}
									ref={profilePicRef}
									type='file'
									name='test1'
									id='test'
								/>
							</div>
							<div className='profile-pic-style' onClick={addPicture}>
								<img
									src='/placeholder_profile_pic.png'
									alt='User profile pic'
								/>
							</div>
						</div>
						<div className={styles.edit_bio}>
							<div className={styles.section_name}>
								<h3>Bio</h3>
								<div
									className={`btn-default btn-active ${styles.edit_btn}`}
									onClick={toggleBioForm}
								>
									{bioForm ? 'Save' : 'Edit'}
								</div>
							</div>
							{bioForm ? (
								<form>
									<label>
										<textarea
											id='bio'
											name='bio'
											maxLength={512}
											rows={3}
											onChange={handleChange}
											value={formData.bio}
											required
											placeholder='Describe yourself...'
										/>
									</label>
								</form>
							) : (
								<p>{formData.bio}</p>
							)}
						</div>
						<div className={styles.edit_hobbies}>
							<div className={styles.section_name}>
								<h3>Hobbies</h3>
								<div
									className={`btn-default btn-active ${styles.edit_btn}`}
									onClick={toggleHobbiesForm}
								>
									{bioForm ? 'Save' : 'Edit'}
								</div>
							</div>
							{hobbiesForm ? (
								<form>
									<label>
										<input type='checkbox' id='sports' name='sports' />
										Sports
									</label>
									<label>
										<input type='checkbox' id='music' name='music' />
										Music
									</label>
									<label>
										<input type='checkbox' id='movies' name='movies' />
										Movies
									</label>
									<label>
										<input type='checkbox' id='gaming' name='gaming' />
										Gaming
									</label>
								</form>
							) : null}
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
