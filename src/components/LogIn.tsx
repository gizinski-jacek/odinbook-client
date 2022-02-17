import { useState } from 'react';

const LogIn = ({ setShowLogIn }: { setShowLogIn: any }) => {
	const [formData, setFormData] = useState({
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

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
					value={formData.email}
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
					value={formData.password}
					onChange={(e) => {
						handleChange(e);
					}}
					required
					placeholder='Password'
				/>
				<button type='submit'>Log In</button>
			</form>
			<h4>Don't have an account?</h4>
			<button onClick={() => setShowLogIn(false)}>Create one now!</button>
		</div>
	);
};

export default LogIn;
