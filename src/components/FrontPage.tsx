// @ts-nocheck

import { useState } from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';

const FrontPage = () => {
	const [showLogIn, setShowLogIn] = useState(true);

	return (
		<div className='front-container'>
			<div className='welcome'>Odinbook</div>
			{showLogIn ? (
				<LogIn setShowLogIn={setShowLogIn} />
			) : (
				<SignUp setShowLogIn={setShowLogIn} />
			)}
		</div>
	);
};

export default FrontPage;
