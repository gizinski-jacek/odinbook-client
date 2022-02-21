import axios from 'axios';
import { useState } from 'react';

type Props = {
	setShowLogIn: Function;
	setLoggedUser: Function;
};

const LogIn: React.FC<Props> = ({ setShowLogIn, setLoggedUser }) => {
	const [errors, setErrors] = useState<Array<{ msg: string }>>();
	const [logInFormData, setLogInFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLogInFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res: any = await axios.post('/api/log-in', logInFormData);
			setLoggedUser(res.data);
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
		<div className='log-in'>
			<h3>Log In</h3>
			<form className='log-in-form' onSubmit={handleSubmit}>
				<label htmlFor='email'>Email</label>
				<input
					type='email'
					id='email'
					name='email'
					minLength={4}
					maxLength={32}
					value={logInFormData.email}
					onChange={(e) => {
						handleChange(e);
					}}
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
					value={logInFormData.password}
					onChange={(e) => {
						handleChange(e);
					}}
					required
					placeholder='Password'
				/>
				{errorsDisplay ? <ul className='error-list'>{errorsDisplay}</ul> : null}
				<button type='submit'>Log In</button>
			</form>
			<h4>Don't have an account?</h4>
			<button onClick={() => setShowLogIn(false)}>Create one now!</button>
		</div>
	);
};

export default LogIn;
