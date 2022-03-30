import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Message } from '../../myTypes';
import { axiosGet, axiosPut } from '../utils/axiosFunctions';
import MessengerMessageWrapper from '../utils/MessengerMessageWrapper';
import styles from '../../styles/menus/MessengerMenu.module.scss';

const MessengerMenu = () => {
	const [newMessagesData, setNewMessagesData] = useState<Message[]>([]);

	const [searchInput, setSearchInput] = useState('');
	const [searchData, setSearchData] = useState<Message[]>([]);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setNewMessagesData(await axiosGet('/api/chats/messages/new'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const markMessageAsRead = async (
		e: React.MouseEvent<HTMLButtonElement>,
		messageId: string
	) => {
		e.stopPropagation();
		setNewMessagesData(
			await axiosPut('/api/chats/messages/mark', { messageId })
		);
	};

	const markAllMessagesAsRead = async (
		e: React.MouseEvent<HTMLSpanElement>
	) => {
		e.stopPropagation();
		try {
			const unReadMessageListIDs = newMessagesData.map(
				(message) => message._id
			);
			await axiosPut('/api/chats/messages/mark-many', {
				messageList: unReadMessageListIDs,
			});
			setNewMessagesData([]);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleSearch = async (
		e: React.FormEvent<HTMLFormElement>,
		query: string
	) => {
		e.preventDefault();
		if (!query) {
			return;
		}
		try {
			setSearchData(await axiosGet(`/api/search/messages?q=${query}`));
			setShowResults(true);
		} catch (error: any) {
			console.error(error);
		}
	};

	const clearSearch = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setSearchInput('');
		setSearchData([]);
		setShowResults(false);
	};

	const removeFromSearchResults = (
		e: React.MouseEvent<HTMLButtonElement>,
		resultId: string
	) => {
		e.stopPropagation();
		setSearchData((prevState) =>
			prevState.filter((item) => item._id !== resultId)
		);
	};

	const messageListDisplay = newMessagesData.map((message) => {
		return (
			<MessengerMessageWrapper
				key={message._id}
				dismissMessage={markMessageAsRead}
				message={message}
			/>
		);
	});

	const searchDisplay = searchData?.map((message) => {
		return (
			<MessengerMessageWrapper
				key={message._id}
				dismissMessage={removeFromSearchResults}
				message={message}
			/>
		);
	});

	return (
		<div className={styles.menu_messenger}>
			<div className={styles.top}>
				<h3>Messenger</h3>
				<span
					className={styles.mark_all}
					onClick={(e) => markAllMessagesAsRead(e)}
				>
					<h5>Mark all as read</h5>
				</span>
			</div>
			<div className={styles.search_messenger}>
				<form onSubmit={(e) => handleSearch(e, searchInput)}>
					<label>
						<span>
							<svg viewBox='0 0 16 16' width='16' height='16'>
								<g transform='translate(-448 -544)'>
									<g>
										<path
											d='M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z'
											transform='translate(448 544)'
										></path>
										<path
											d='M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z'
											transform='translate(448 544)'
										></path>
										<path
											d='M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z'
											transform='translate(448 544)'
										></path>
										<path
											d='m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z'
											transform='translate(448 544)'
										></path>
									</g>
								</g>
							</svg>
						</span>
						<input
							type='text'
							name='search_messenger'
							minLength={1}
							maxLength={512}
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder='Search Messenger'
						/>
						<button
							type='button'
							style={{
								visibility: searchInput || showResults ? 'visible' : 'hidden',
							}}
							className={styles.clear_btn}
							onClick={(e) => clearSearch(e)}
						>
							<span></span>
						</button>
					</label>
				</form>
			</div>
			<div className={styles.message_list_container}>
				{showResults ? (
					searchDisplay.length > 0 ? (
						<div className={styles.message_list}>
							<ul>{searchDisplay}</ul>
						</div>
					) : (
						<div className={styles.empty}>
							<h4>No messages found</h4>
						</div>
					)
				) : messageListDisplay.length > 0 ? (
					<ul className={styles.message_list}>{messageListDisplay}</ul>
				) : (
					<div className={styles.empty}>
						<h4>No new messages</h4>
					</div>
				)}
			</div>
			<hr />
			<Link to='/'>See all in Messenger</Link>
		</div>
	);
};

export default MessengerMenu;
