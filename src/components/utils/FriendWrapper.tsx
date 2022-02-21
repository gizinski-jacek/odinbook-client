type Props = {
	friend: {
		_id: string;
		first_name: string;
		last_name: string;
	};
	openChat: Function;
};

const FriendWrapper: React.FC<Props> = ({ friend, openChat }) => {
	return (
		<div className='friend'>
			<div onClick={() => openChat(friend)}>
				<div>profile picture</div>
				<div>
					<div>
						{friend.first_name} {friend.last_name}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FriendWrapper;
