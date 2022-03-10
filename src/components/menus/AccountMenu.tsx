import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { axiosGet } from '../utils/axiosFunctions';
import styles from '../../styles/menus/AccountMenu.module.scss';

const AccountMenu = () => {
	const { user, setUser } = useContext(UserContext);

	const navigate = useNavigate();

	const handleLogOut = async () => {
		try {
			await axiosGet('/api/log-out');
			setUser(null);
			navigate('/');
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div className={styles.menu_account}>
			<Link to={`/profile/${user._id}`} className={styles.me_link}>
				<div className='profile-pic-style'>
					<img src='/placeholder_profile_pic.png' alt='User profile pic' />
				</div>
				<span>
					<h3>{user.full_name}</h3>
					<h5>See your profile</h5>
				</span>
			</Link>
			<hr />
			<Link to='/' className={styles.feedback_link}>
				<div className={styles.icon}>
					<span></span>
				</div>
				<h4>Give feedback</h4>
			</Link>
			<hr />
			<Link to='/' className={styles.settings_privacy_link}>
				<div className={styles.icon}>
					<span></span>
				</div>
				<h4>{'Settings & privacy'}</h4>
				<span className={styles.arrows}></span>
			</Link>
			<Link to='/' className={styles.help_support_link}>
				<div className={styles.icon}>
					<span></span>
				</div>
				<h4>{'Help & support'}</h4>
				<span className={styles.arrows}></span>
			</Link>
			<Link to='/' className={styles.display_accesibility_link}>
				<div className={styles.icon}>
					<span></span>
				</div>
				<h4>{'Display & accessibility'}</h4>
				<span className={styles.arrows}></span>
			</Link>
			<div onClick={() => handleLogOut()} className={styles.log_out_btn}>
				<div className={styles.icon}>
					<span></span>
				</div>
				<h4>Log Out</h4>
			</div>
		</div>
	);
};

export default AccountMenu;