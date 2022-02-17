import React, { useState } from 'react';

const SignUp = ({ setShowLogIn }: { setShowLogIn: any }) => {
	const [formData, setFormData] = useState({
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<div className='sign-up'>
			<h3>Sign Up</h3>
			<form className='sign-up-form' onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor='first_name'>
						First Name
						<input
							type='text'
							id='first_name'
							name='first_name'
							minLength={4}
							maxLength={32}
							value={formData.first_name}
							onChange={(e) => {
								handleChange(e);
							}}
							required
							placeholder='First Name'
						/>
					</label>
					<label htmlFor='last_name'>
						Last Name
						<input
							type='text'
							id='last_name'
							name='last_name'
							minLength={4}
							maxLength={32}
							value={formData.last_name}
							onChange={(e) => {
								handleChange(e);
							}}
							required
							placeholder='Last Name'
						/>
					</label>
				</fieldset>
				<fieldset>
					<label htmlFor='email'>
						Email
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
					</label>
					<label htmlFor='password'>
						Password
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
					</label>
				</fieldset>
				<button type='submit'>Register</button>
			</form>
			<h4>Already have an account?</h4>
			<button onClick={() => setShowLogIn(true)}>Log in now!</button>
		</div>
	);
};

export default SignUp;
