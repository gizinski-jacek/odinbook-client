type Props = {
	request: {
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

const RequestWrapper: React.FC<Props> = ({ request }) => {
	return (
		<div className='request'>
			<div>
				<div>profile picture</div>
				<div>
					<div>
						{request.author.first_name} {request.author.last_name}
					</div>
					<div>{request.createdAt}</div>
				</div>
			</div>
			<div>{request.text}</div>
			<div>
				<div>like comment</div>
				<div>comment</div>
			</div>
		</div>
	);
};

export default RequestWrapper;
