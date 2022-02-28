import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/SideMenu.module.scss';
import { UserContext } from './hooks/UserContext';

const SideMenu = () => {
	const { user } = useContext(UserContext);

	return (
		<div className={styles.side_menu}>
			<ul>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/profile/${user._id}`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='user-profile-pic'
							/>
						</Link>
					</div>
					<h4>
						{user.first_name} {user.last_name}
					</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='find-friends-icon'
							/>
						</Link>
					</div>
					<h4>Find Friends</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='welcome-icon' />
						</Link>
					</div>
					<h4>Welcome</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='groups-icon' />
						</Link>
					</div>
					<h4>Groups</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='marketplace-icon'
							/>
						</Link>
					</div>
					<h4>Marketplace</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='watch-icon' />
						</Link>
					</div>
					<h4>Watch</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='memories-icon'
							/>
						</Link>
					</div>
					<h4>Memories</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='saved-icon' />
						</Link>
					</div>
					<h4>Saved</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='pages-icon' />
						</Link>
					</div>
					<h4>Pages</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img src='icons/placeholder_profile_pic.png' alt='events-icon' />
						</Link>
					</div>
					<h4>Events</h4>
				</li>
				<li>
					<div className='profile-pic-style'>
						<Link to={`/friends`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='most-recent-icon'
							/>
						</Link>
					</div>
					<h4>Most Recent</h4>
				</li>
			</ul>
		</div>
	);
};

export default SideMenu;
