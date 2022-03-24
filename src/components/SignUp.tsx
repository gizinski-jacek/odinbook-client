import { useState } from 'react';
import { SignUpForm } from '../myTypes';
import { axiosPost } from './utils/axiosFunctions';
import styles from '../styles/SignUp.module.scss';

type Props = {
	setShowLogIn: (value: boolean) => void;
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

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		data: SignUpForm
	) => {
		e.preventDefault();
		try {
			await axiosPost('/api/sign-up', data);
			setShowLogIn(true);
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
				<form onSubmit={(e) => handleSubmit(e, formData)}>
					<fieldset>
						<label htmlFor='first_name'>First Name</label>
						<input
							type='text'
							id='first_name'
							name='first_name'
							minLength={4}
							maxLength={32}
							value={formData.first_name}
							onChange={handleChange}
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
							onChange={handleChange}
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
						onChange={handleChange}
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
						onChange={handleChange}
						required
						placeholder='Password'
					/>
					{errorsDisplay && <ul className='error-list'>{errorsDisplay}</ul>}
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
					className='btn-default btn-confirm'
					onClick={() => setShowLogIn(true)}
				>
					Log in now!
				</button>
			</div>
		</div>
	);
};

export default SignUp;
