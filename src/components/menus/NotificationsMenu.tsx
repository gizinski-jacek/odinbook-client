import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../hooks/UserContext';
import { User } from '../../myTypes';
import { axiosGet, axiosPut } from '../utils/axiosFunctions';
import RequestWrapper from '../utils/RequestWrapper';
import styles from '../../styles/menus/NotificationsMenu.module.scss';

type Props = {
	setNotificationAlert: Function;
};

const NotificationsMenu: React.FC<Props> = ({ setNotificationAlert }) => {
	const { user } = useContext(UserContext);

	const [requestsData, setRequestsData] = useState<User[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts');
				setRequestsData(resData.incoming_friend_requests);
				setNotificationAlert(resData.incoming_friend_requests.length);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [setNotificationAlert]);

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setNotificationAlert(data.incoming_friend_requests.length);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			setNotificationAlert(data.incoming_friend_requests.length);
		} catch (error: any) {
			console.error(error);
		}
	};

	const notificationsRequestsDisplay = requestsData?.map((request) => {
		return (
			<RequestWrapper
				key={request._id}
				handleAccept={handleAcceptRequest}
				handleCancel={handleCancelRequest}
				request={request}
			/>
		);
	});

	return (
		<div className={styles.menu_notifications}>
			<div className={styles.top}>
				<h3>Notifications</h3>
			</div>
			{notificationsRequestsDisplay ? (
				<div className={styles.notification_list}>
					{notificationsRequestsDisplay &&
					notificationsRequestsDisplay?.length > 0 ? (
						<ul>{notificationsRequestsDisplay}</ul>
					) : (
						<div className={styles.empty}>
							<h4>No notifications to show</h4>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};

export default NotificationsMenu;
