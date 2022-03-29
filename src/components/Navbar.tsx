import NavbarLeft from './NavbarLeft';
import NavbarCenter from './NavbarCenter';
import NavbarRight from './NavbarRight';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
	return (
		<nav className={styles.navbar}>
			<NavbarLeft />
			<NavbarCenter />
			<NavbarRight />
		</nav>
	);
};

export default Navbar;
