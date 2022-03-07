import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import axios from 'axios';
import styles from '../styles/LogIn.module.scss';

type Props = {
	setShowLogIn: Function;
};

type FormData = {
	email: string;
	password: string;
};

const LogIn: React.FC<Props> = ({ setShowLogIn }) => {
	const { setUser } = useContext(UserContext);

	const navigate = useNavigate();

	const [errors, setErrors] = useState<{ msg: string }[]>();
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resUser = await axios.post('/api/log-in', formData);
			setUser(resUser.data);
			navigate('/');
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
		<div className={styles.log_in}>
			<div className={styles.body}>
				<h2>Log In</h2>
				<form onSubmit={handleSubmit}>
					<fieldset>
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
					</fieldset>
					<fieldset>
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
					</fieldset>
					{errorsDisplay ? (
						<ul className='error-list'>{errorsDisplay}</ul>
					) : null}
					<button type='submit' className='btn-default btn-confirm'>
						Log In
					</button>
				</form>
			</div>
			<div className={styles.bottom}>
				<h4>Or if you prefer</h4>
				<button type='button' className='btn-default btn-confirm'>
					Log In with Facebook
				</button>
				<hr />
				<h4>Don't have an account?</h4>
				<button
					type='button'
					onClick={() => setShowLogIn(false)}
					className='btn-default btn-register'
				>
					Create one now!
				</button>
			</div>
		</div>
	);
};

export default LogIn;
