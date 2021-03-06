import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../hooks/UserProvider';
import { User } from '../utils/myTypes';
import { axiosGet, axiosPut } from '../utils/axiosFunctions';
import RequestWrapper from '../utils/wrappers/RequestWrapper';
import styles from '../../styles/menus/NotificationsMenu.module.scss';

type Props = {
	alert: boolean;
};

const NotificationsMenu: React.FC<Props> = ({ alert }) => {
	const { user, updateUser } = useContext(UserContext);

	const [requestsData, setRequestsData] = useState<User[]>([]);

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				const resData = await axiosGet('/api/users/contacts', {
					signal: controller.signal,
				});
				setRequestsData(resData.incoming_friend_requests);
			} catch (error: any) {
				console.error(error);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [alert]);

	const handleAcceptRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		if (!user) {
			return;
		}
		try {
			const resData = await axiosPut(`/api/users/friends/accept`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			updateUser(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleCancelRequest = async (
		e: React.MouseEvent<HTMLButtonElement>,
		userId: string
	) => {
		e.stopPropagation();
		if (!user) {
			return;
		}
		try {
			const resData = await axiosPut(`/api/users/friends/cancel`, {
				userId,
			});
			const data = resData.find((u: User) => u._id === user._id);
			setRequestsData(data.incoming_friend_requests);
			updateUser(data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const requestsDisplay = requestsData?.map((request) => {
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
			<div className={styles.notification_list_container}>
				{requestsDisplay.length > 0 ? (
					<ul className={styles.notification_list}>{requestsDisplay}</ul>
				) : (
					<div className={styles.empty}>
						<h4>No new notifications</h4>
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationsMenu;
