import styles from '../styling/SideMenu.module.scss';

const SideMenu = () => {
	return (
		<div className={styles.menu}>
			<ul>
				<li>User's full name</li>
				<li>Find Friends</li>
				<li>Welcome</li>
				<li>Groups</li>
				<li>Marketplace</li>
				<li>Watch</li>
				<li>Memories</li>
				<li>Saved</li>
				<li>Pages</li>
				<li>Events</li>
				<li>Most Recent</li>
			</ul>
		</div>
	);
};

export default SideMenu;
