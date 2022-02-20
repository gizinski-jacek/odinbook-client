import SideMenu from './SideMenu';
import Timeline from './Timeline';
import FriendList from './FriendList';

type Props = {
	loggedUser: {
		_id: string;
		email: string;
		first_name: string;
		last_name: string;
		friendList: string[];
		friendRequiests: string[];
	};
};

const HomePage: React.FC<Props> = ({ loggedUser }) => {
	return (
		<div className='home-container'>
			<SideMenu />
			<Timeline loggedUser={loggedUser} />
			<FriendList loggedUser={loggedUser} />
		</div>
	);
};

export default HomePage;
