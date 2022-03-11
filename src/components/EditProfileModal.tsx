import { useContext, useState } from 'react';
import { UserContext } from './hooks/UserContext';
import { LogInForm, User } from '../myTypes';
import { axiosPost } from './utils/axiosFunctions';
import styles from '../styles/EditProfileModal.module.scss';

type Props = {
	closeModal: Function;
	setData: Function;
	data: User;
};

type FormData = {
	profile_picture: string;
	cover_photo: string;
	bio: string;
	hobbies: string;
};

const EditProfileModal: React.FC<Props> = ({ closeModal, setData, data }) => {
	const { setUser } = useContext(UserContext);

	const [errors, setErrors] = useState<{ msg: string }[]>();
	const [formData, setFormData] = useState<User | FormData>(data);

	const [pictureForm, setPictureForm] = useState(false);
	const [photoForm, setPhotoForm] = useState(false);
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
		data: LogInForm
	) => {
		e.preventDefault();
		try {
			setUser(await axiosPost('/api/log-in', data));
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

	const togglePictureForm = () => {
		setPictureForm(true);
	};

	const togglePhotoForm = () => {
		setPhotoForm(true);
	};

	const toggleBioForm = () => {
		setBioForm(true);
	};

	const toggleHobbiesForm = () => {
		setHobbiesForm(true);
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
				<div className={styles.body}>
					<div className={styles.edit_picture_picture}>
						<div className={styles.top}>
							<h3>Profile picture</h3>
							<div className={styles.add_btn}>Add</div>
						</div>
						<div className='profile-pic-style'>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
							Profile picture
						</div>
					</div>
					<div className={styles.edit_cover_photo}>
						<div className={styles.top}>
							<h3>Cover photo</h3>
							<div className={styles.add_btn}>Add</div>
						</div>
						<div className={styles.cover_photo}>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
							Cover photo
						</div>
					</div>
					<div className={styles.edit_bio}>
						<div className={styles.top}>
							<h3>Bio</h3>
							<div className={styles.add_btn}>Add</div>
						</div>
						{bioForm ? (
							<form>
								<label>
									<textarea
										id='bio'
										name='bio'
										maxLength={512}
										rows={2}
										onChange={handleChange}
										value={formData.bio}
										required
										placeholder='Describe yourself...'
									/>
								</label>
								<button type='submit' className='btn-default btn-form-submit'>
									Edit Your Profile Info
								</button>
							</form>
						) : (
							<p>{formData.bio}</p>
						)}
					</div>
					<div className={styles.edit_hobbies}></div>
					<div className={styles.top}>
						<h3>Hobbies</h3>
						<div className={styles.add_btn}>Add</div>
						<option>
							<select id='sports' name='sports'>
								Sports
							</select>
							<select id='music' name='music'>
								Music
							</select>
							<select id='movies' name='movies'>
								Movies
							</select>
							<select id='gaming' name='gaming'>
								Gaming
							</select>
						</option>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProfileModal;
