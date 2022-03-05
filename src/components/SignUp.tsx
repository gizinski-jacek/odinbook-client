import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/SignUp.module.scss';

type Props = {
	setShowLogIn: Function;
};

type FormData = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

const SignUp: React.FC<Props> = ({ setShowLogIn }) => {
	const [errors, setErrors] = useState<{ msg: string }[]>();
	const [formData, setFormData] = useState<FormData>({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.post('/api/sign-up', formData);
			setShowLogIn(true);
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
		<div className={styles.sign_up}>
			<h2>Sign Up</h2>
			<hr />
			<div className={styles.body}>
				<form onSubmit={handleSubmit}>
					<fieldset>
						<label htmlFor='first_name'>First Name</label>
						<input
							type='text'
							id='first_name'
							name='first_name'
							minLength={4}
							maxLength={32}
							value={formData.first_name}
							onChange={(e) => handleChange(e)}
							required
							placeholder='First Name'
						/>
						<label htmlFor='last_name'>Last Name</label>
						<input
							type='text'
							id='last_name'
							name='last_name'
							minLength={4}
							maxLength={32}
							value={formData.last_name}
							onChange={(e) => handleChange(e)}
							required
							placeholder='Last Name'
						/>
					</fieldset>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						name='email'
						minLength={4}
						maxLength={32}
						value={formData.email}
						onChange={(e) => handleChange(e)}
						required
						placeholder='Email'
					/>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						name='password'
						minLength={8}
						maxLength={64}
						value={formData.password}
						onChange={(e) => handleChange(e)}
						required
						placeholder='Password'
					/>
					{errorsDisplay ? (
						<ul className='error-list'>{errorsDisplay}</ul>
					) : null}
					<button type='submit' className='btn-default btn-register'>
						Register
					</button>
				</form>
			</div>
			<hr />
			<div className={styles.bottom}>
				<h4>Already have an account?</h4>
				<button
					type='button'
					onClick={() => setShowLogIn(true)}
					className='btn-default btn-confirm'
				>
					Log in now!
				</button>
			</div>
		</div>
	);
};

export default SignUp;
