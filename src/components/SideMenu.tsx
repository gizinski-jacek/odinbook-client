import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import styles from '../styles/SideMenu.module.scss';

const SideMenu = () => {
	const { user } = useContext(UserContext);

	return (
		<div className={styles.side_menu}>
			<ul>
				<li>
					<div className={`profile-pic-style ${styles.icon}`}>
						<Link to={`/profile/${user._id}`}>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
						</Link>
					</div>
					<h4>{user.full_name}</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to={`/friends`}>
							<img src='single_icons/friends_icon.png' alt='Find friends' />
						</Link>
					</div>
					<h4>Find Friends</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/groups_icon.png' alt='Groups' />
						</Link>
					</div>
					<h4>Groups</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/facebook_icon.png' alt='Welcome' />
						</Link>
					</div>
					<h4>Welcome</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/pages_icon.png' alt='Pages' />
						</Link>
					</div>
					<h4>Pages</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/events_icon.png' alt='Events' />
						</Link>
					</div>
					<h4>Events</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/marketplace_icon.png' alt='Marketplace' />
						</Link>
					</div>
					<h4>Marketplace</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/watch_icon.png' alt='Watch' />
						</Link>
					</div>
					<h4>Watch</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/memories_icon.png' alt='Memories' />
						</Link>
					</div>
					<h4>Memories</h4>
				</li>
				<li>
					<div className={styles.icon}>
						<Link to='/'>
							<img src='single_icons/most_recent_icon.png' alt='Most Recent' />
						</Link>
					</div>
					<h4>Most Recent</h4>
				</li>
			</ul>
		</div>
	);
};

export default SideMenu;
