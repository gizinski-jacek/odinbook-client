import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../myTypes';
import styles from '../../styles/Friend.module.scss';

type Props = {
	handleRemove: Function;
	openChat: Function;
	friend: User;
};

const FriendWrapper: React.FC<Props> = ({ handleRemove, openChat, friend }) => {
	const optionsRef = useRef(null);

	const [showOptions, setShowOptions] = useState(false);

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

	return (
		<li className={styles.friend} onClick={() => openChat()}>
			<Link to={`/profile/${friend._id}`}>
				<div className='profile-pic-style'>
					<img
						src={
							friend.profile_picture
								? `http://localhost:4000/${friend.profile_picture}`
								: '/placeholder_profile_pic.png'
						}
						alt='User profile pic'
					/>
				</div>
			</Link>
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
				{showOptions ? (
					<span ref={optionsRef} className={styles.options_menu}>
						<div
							className={styles.remove_btn}
							onClick={(e) => handleRemove(e, friend._id)}
						>
							Remove friend
						</div>
					</span>
				) : null}
			</div>
		</li>
	);
};

export default FriendWrapper;
