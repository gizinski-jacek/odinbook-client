type Props = {
	friend: {
		_id: string;
		author: {
			_id: string;
			first_name: string;
			last_name: string;
		};
		text: string;
		comments: string[];
		likes: string[];
		createdAt: string;
		updatedAt: string;
	};
};

const FriendWrapper: React.FC<Props> = ({ friend }) => {
	return (
		<div className='friend'>
			<div>
				<div>profile picture</div>
				<div>
					<div>
						{friend.author.first_name} {friend.author.last_name}
					</div>
					<div>{friend.createdAt}</div>
				</div>
			</div>
			<div>{friend.text}</div>
			<div>
				<div>like comment</div>
				<div>comment</div>
			</div>
		</div>
	);
};

export default FriendWrapper;
