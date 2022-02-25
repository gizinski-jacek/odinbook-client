import SideMenu from './SideMenu';
import Timeline from './Timeline';
import Contacts from './Contacts';

const HomePage = () => {
	return (
		<div className='home-container'>
			<SideMenu />
			<Timeline />
			<Contacts />
		</div>
	);
};

export default HomePage;
