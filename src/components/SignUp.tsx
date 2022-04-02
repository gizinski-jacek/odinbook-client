import { useState } from 'react';
import type { FormError, SignUpForm } from '../myTypes';
import { axiosPost } from './utils/axiosFunctions';
import FormErrorWrapper from './utils/FormErrorWrapper';
import styles from '../styles/SignUp.module.scss';

type Props = {
	toggleForm: (
		e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
	) => void;
};

type FormData = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

const SignUp: React.FC<Props> = ({ toggleForm }) => {
	const [errors, setErrors] = useState<FormError[]>([]);
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
			toggleForm(e);
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
		<div className={styles.sign_up_container}>
			<div className={styles.body}>
				<h2>Sign Up</h2>
				<form onSubmit={(e) => handleSubmit(e, formData)}>
					<fieldset>
						<label htmlFor='first_name'>First Name</label>
						<input
							type='text'
							name='first_name'
							minLength={2}
							maxLength={32}
							value={formData.first_name}
							onChange={handleChange}
							required
							placeholder='First Name'
						/>
						<label htmlFor='last_name'>Last Name</label>
						<input
							type='text'
							name='last_name'
							minLength={2}
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
			<div className={styles.controls}>
				<h4>Already have an account?</h4>
				<button
					type='button'
					className='btn-default btn-confirm'
					onClick={(e) => toggleForm(e)}
				>
					Log in now!
				</button>
			</div>
		</div>
	);
};

export default SignUp;
