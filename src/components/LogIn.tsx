import { useContext, useState } from 'react';
import { UserContext } from './hooks/UserProvider';
import type { FormError, LogInForm } from '../myTypes';
import { axiosPost } from './utils/axiosFunctions';
import FormErrorWrapper from './utils/FormErrorWrapper';
import styles from '../styles/LogIn.module.scss';

type Props = {
	toggleForm: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type FormData = {
	email: string;
	password: string;
};

const LogIn: React.FC<Props> = ({ toggleForm }) => {
	const { setUser } = useContext(UserContext);

	const [errors, setErrors] = useState<FormError[]>([]);
	const [formData, setFormData] = useState<FormData>({
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
		data: LogInForm
	) => {
		e.preventDefault();
		try {
			setUser(await axiosPost('/api/log-in/email', data));
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
		<div className={styles.log_in_container}>
			<div className={styles.body}>
				<h2>Log In</h2>
				<form onSubmit={(e) => handleSubmit(e, formData)}>
					<fieldset>
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
					</fieldset>
					<fieldset>
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
					</fieldset>
					{errorsDisplay.length > 0 && (
						<ul className='error-list'>{errorsDisplay}</ul>
					)}
					<button type='submit' className='btn-default btn-confirm'>
						Log In
					</button>
				</form>
			</div>
			<div className={styles.controls}>
				<h4>Or if you prefer</h4>
				<a
					href={
						process.env.NODE_ENV === 'development'
							? 'http://localhost:4000/api/log-in/facebook'
							: `${process.env.REACT_APP_API_URI}/api/log-in/facebook`
					}
					className='btn-default btn-confirm'
				>
					Log In with Facebook
				</a>
				<hr />
				<h4>Don't have an account?</h4>
				<button
					type='button'
					onClick={(e) => toggleForm(e)}
					className='btn-default btn-register'
				>
					Create one now!
				</button>
			</div>
		</div>
	);
};

export default LogIn;
