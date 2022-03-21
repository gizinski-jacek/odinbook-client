import { useContext, useRef, useState } from 'react';
import type { User } from '../../myTypes';
import styles from '../../styles/Friend.module.scss';
import Chat from '../Chat';
import { UserContext } from '../hooks/UserContext';

type Props = {
	handleRemove: Function;
	friend: User;
};

const FriendWrapper: React.FC<Props> = ({ handleRemove, friend }) => {
	const { user } = useContext(UserContext);

	const optionsRef = useRef<HTMLDivElement>(null);

	const [showOptions, setShowOptions] = useState(false);
	const [showChat, setShowChat] = useState(false);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowListener);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const openChat = (e: React.MouseEvent<HTMLLIElement>) => {
		e.stopPropagation();
		setShowChat(true);
	};

	const closeChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setShowChat(false);
	};

	return (
		<>
			<li className={styles.friend} onClick={openChat}>
				<div className='profile-pic-style'>
					<img
						src={
							friend.profile_picture
								? `http://localhost:4000/photos/${friend.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
				<div>
					<div>
						{friend.first_name} {friend.last_name}
					</div>
				</div>
				<div className={styles.right}>
					<span className={styles.options_toggle} onClick={toggleOptions}>
						<svg viewBox='0 0 20 20' width='20' height='20'>
							<g transform='translate(-446 -350)'>
								<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
							</g>
						</svg>
					</span>
					{showOptions && (
						<span ref={optionsRef} className={styles.options_menu}>
							<div
								className={styles.remove_btn}
								onClick={(e) => handleRemove(e, friend._id)}
							>
								Remove friend
							</div>
						</span>
					)}
				</div>
			</li>
			{showChat && (
				<Chat closeChat={closeChat} sender={user} recipient={friend} />
			)}
		</>
	);
};

export default FriendWrapper;
