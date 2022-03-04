import { useState } from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';

const FrontPage = () => {
	const [showLogIn, setShowLogIn] = useState(true);

	return (
		<div className='welcome-page-container'>
			<div className='left'>
				<h1>Odinbook</h1>
				<h2>Helps you connect and share with the people in your life</h2>
			</div>
			<div className='right'>
				{showLogIn ? (
					<LogIn setShowLogIn={setShowLogIn} />
				) : (
					<SignUp setShowLogIn={setShowLogIn} />
				)}
			</div>
		</div>
	);
};

export default FrontPage;
