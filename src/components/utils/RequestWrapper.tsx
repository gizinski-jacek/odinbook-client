type Props = {
	request: {
		_id: string;
		first_name: string;
		last_name: string;
	};
	acceptRequest: Function;
	declineRequest: Function;
};

const RequestWrapper: React.FC<Props> = ({
	request,
	acceptRequest,
	declineRequest,
}) => {
	return (
		<div className='request'>
			<div>
				<div>profile picture</div>
				<div>
					<div>
						{request.first_name} {request.last_name}
					</div>
				</div>
			</div>
			<div>
				<button onClick={() => acceptRequest(request)}>accept</button>
				<button onClick={() => declineRequest(request)}>decline</button>
			</div>
		</div>
	);
};

export default RequestWrapper;
