import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import type { User } from '../myTypes';
import styles from '../styles/ProfileMain.module.scss';
import { UserContext } from './hooks/UserContext';

const Profile = () => {
	const { user } = useContext(UserContext);

	const params = useParams();

	const [userData, setUserData] = useState<User>();

	useEffect(() => {
		(async () => {
			try {
				const resUser = await axios.get(`/api/users/${params.userid}`);
				setUserData(resUser.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [params.userid]);

	return (
		<div className={styles.profile_page}>
			<div className={styles.profile_page_main}>
				<div className={styles.cover_photo}>
					<div className='profile-pic-style'>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</div>
				</div>
				<h2>{userData?.full_name}</h2>
				<hr />

				<div className={styles.controls}>
					<ul className={styles.left}>
						<li>
							<NavLink
								to='./'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Posts
							</NavLink>
						</li>
						<li>
							<NavLink
								to='about'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								About
							</NavLink>
						</li>
						<li>
							<NavLink
								to='friends'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Friends
							</NavLink>
						</li>
						<li>
							<NavLink
								to='photos'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Photos
							</NavLink>
						</li>
						<li>
							<NavLink
								to='videos'
								className={({ isActive }) => (isActive ? styles.isActive : '')}
							>
								Videos
							</NavLink>
						</li>
					</ul>
					<div className={styles.right}>
						<div className='btn-default btn-confirm'>Add Friend</div>
						<div className='btn-default btn-remove'>Message</div>
						<div className='btn-default btn-remove'>
							<svg viewBox='0 0 24 24' width='16' height='16'>
								<circle cx='12' cy='12' r='2.5'></circle>
								<circle cx='19.5' cy='12' r='2.5'></circle>
								<circle cx='4.5' cy='12' r='2.5'></circle>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
