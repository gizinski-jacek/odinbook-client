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
					<Link to={`/profile/${user._id}`}>
						<div className={`profile-pic-style ${styles.icon}`}>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
						</div>
						<h4>{user.full_name}</h4>
					</Link>
				</li>
				<li>
					<Link to={`/friends`}>
						<div className={styles.icon}>
							<img src='single_icons/friends_icon.png' alt='Find friends' />
						</div>
						<h4>Find Friends</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/groups_icon.png' alt='Groups' />
						</div>
						<h4>Groups</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/facebook_icon.png' alt='Welcome' />
						</div>
						<h4>Welcome</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/pages_icon.png' alt='Pages' />
						</div>
						<h4>Pages</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/events_icon.png' alt='Events' />
						</div>
						<h4>Events</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/marketplace_icon.png' alt='Marketplace' />
						</div>
						<h4>Marketplace</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/watch_icon.png' alt='Watch' />
						</div>
						<h4>Watch</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/memories_icon.png' alt='Memories' />
						</div>
						<h4>Memories</h4>
					</Link>
				</li>
				<li>
					<Link to='/'>
						<div className={styles.icon}>
							<img src='single_icons/most_recent_icon.png' alt='Most Recent' />
						</div>
						<h4>Most Recent</h4>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default SideMenu;
