import { useContext, useEffect, useRef, useState } from 'react';
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

	const allRef = useRef(null);
	const unreadRef = useRef(null);

	const [showAll, setShowAll] = useState(true);
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

	const changeNotificationList = (e: any) => {
		e.stopPropagation();
		if (e.target === allRef.current) {
			// fetch all notifications
			setShowAll(true);
		}
		if (e.target === unreadRef.current) {
			// fetch unread notifications
			setShowAll(false);
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
				<span className={styles.options_toggle}>
					<svg viewBox='0 0 20 20' width='20' height='20'>
						<g transform='translate(-446 -350)'>
							<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
						</g>
					</svg>
				</span>
			</div>
			<div className={styles.controls}>
				<div
					ref={allRef}
					className={`btn-default ${showAll ? 'btn-active' : ''}`}
					onClick={changeNotificationList}
				>
					All
				</div>
				<div
					ref={unreadRef}
					className={`btn-default ${showAll ? '' : 'btn-active'}`}
					onClick={changeNotificationList}
				>
					Unread
				</div>
			</div>
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
		</div>
	);
};

export default NotificationsMenu;
