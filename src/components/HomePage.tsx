import SideMenu from './SideMenu';
import Timeline from './Timeline';
import FriendList from './FriendList';

const HomePage = () => {
	return (
		<div className='home-container'>
			<SideMenu />
			<Timeline />
			<FriendList />
		</div>
	);
};

export default HomePage;
