import { useEffect, useRef, useState } from 'react';
import { User } from '../../myTypes';
import { axiosGet } from '../utils/axiosFunctions';
import RequestWrapper from '../utils/RequestWrapper';
import styles from '../../styles/menus/NotificationsMenu.module.scss';

const NotificationsMenu = () => {
	const allRef = useRef(null);
	const unreadRef = useRef(null);

	const [showAllNotifications, setShowAllNotifications] = useState(true);
	const [notificationsData, setNotificationsData] = useState<User[]>();

	useEffect(() => {
		(async () => {
			try {
				setNotificationsData(await axiosGet('/api/users/requests'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const changeNotificationList = (e: any) => {
		e.stopPropagation();
		if (e.target === allRef.current) {
			// fetch all notifications
			setShowAllNotifications(true);
		}
		if (e.target === unreadRef.current) {
			// fetch unread notifications
			setShowAllNotifications(false);
		}
	};

	const notificationsRequestsDisplay = notificationsData?.map((request) => {
		return (
			<RequestWrapper
				key={request._id}
				request={request}
				setData={setNotificationsData}
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
					className={`btn-default ${showAllNotifications ? 'btn-active' : ''}`}
					onClick={(e) => changeNotificationList(e)}
				>
					All
				</div>
				<div
					ref={unreadRef}
					className={`btn-default ${showAllNotifications ? '' : 'btn-active'}`}
					onClick={(e) => changeNotificationList(e)}
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
