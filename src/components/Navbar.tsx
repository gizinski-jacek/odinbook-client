import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styling/Navbar.module.scss';

type Props = {
	loggedUser: {
		_id: string;
		email: string;
		first_name: string;
		last_name: string;
		friendList: string[];
		friendRequiests: string[];
	};
	setLoggedUser: Function;
};

const Navbar: React.FC<Props> = ({ loggedUser, setLoggedUser }) => {
	const [showMenu, setShowMenu] = useState(false);
	const [showMessenger, setShowMessenger] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showAccount, setShowAccount] = useState(false);
	const [searchInput, setSearchInput] = useState('');

	const handleLogOut = async () => {
		try {
			await axios.get('/api/log-out');
			setLoggedUser(null);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<nav className={styles.nav}>
			<div className={styles.left}>
				<div className='logo'>logo</div>
				<div className='search'>
					<input
						type='text'
						id='searchValue'
						name='searchValue'
						minLength={1}
						maxLength={512}
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder='Search Facebook'
					/>
				</div>
			</div>
			<div className={styles.center}>
				<ul className={styles.navigation}>
					<li>Home</li>
					<li>Friends</li>
					<li>Groups</li>
				</ul>
			</div>
			<div className={styles.right}>
				<ul className={styles.user_controls}>
					<li>Find Friends</li>
					<li>My Profile</li>
					<li>
						Menu
						{showMenu ? <div className='menu'>Menu</div> : null}
					</li>
					<li>
						Messenger
						{showMessenger ? (
							<div className='messenger-menu'>Messenge</div>
						) : null}
					</li>
					<li>
						Notifications
						{showNotifications ? (
							<div className='account-menu'>
								Notifications
								<button>All</button>
								<button>Unread</button>
								<div>Notification-list</div>
							</div>
						) : null}
					</li>
					<li onClick={() => setShowAccount(true)}>
						Account
						{showAccount ? (
							<div className='account-menu'>
								<Link to='/me'>(user pic and name) See your profile</Link>
								<Link to='/feedback'>Give feedback</Link>
								<Link to='settings-privacy'>{'Settings & privacy'}</Link>
								<Link to='display-accesibility'>
									{'Display & accessibility'}
								</Link>
								<button onClick={() => handleLogOut()}>Log Out</button>
							</div>
						) : null}
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
