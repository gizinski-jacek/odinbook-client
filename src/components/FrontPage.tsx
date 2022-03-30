import { useState } from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';

const FrontPage = () => {
	const [showLogIn, setShowLogIn] = useState(true);

	const toggleForm = (
		e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
	) => {
		e.stopPropagation();
		setShowLogIn((prevState) => !prevState);
	};

	return (
		<div className='front-page-container'>
			<div className='left'>
				<h1>Odinbook</h1>
				<h3>Helps you connect and share with the people in your life</h3>
			</div>
			<div className='right'>
				{showLogIn ? (
					<LogIn toggleForm={toggleForm} />
				) : (
					<SignUp toggleForm={toggleForm} />
				)}
			</div>
		</div>
	);
};

export default FrontPage;
