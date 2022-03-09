import { useEffect, useState } from 'react';
import { User } from '../myTypes';
import PersonWrapper from './utils/PersonWrapper';
import styles from '../styles/ProfileFriends.module.scss';
import { axiosGet } from './utils/axiosFunctions';
import { useParams } from 'react-router-dom';

const ProfileFriends = () => {
	const params = useParams();

	const [friendsData, setFriendsData] = useState<User[]>();
	const [searchData, setSearchData] = useState<User[] | null>();
	const [searchInput, setSearchInput] = useState('');

	useEffect(() => {
		(async () => {
			try {
				setFriendsData(await axiosGet(`/api/users/${params.userid}/friends`));
			} catch (error) {
				console.error(error);
			}
		})();
	}, [params]);

	const handleSearch = async (
		e: React.FormEvent<HTMLFormElement>,
		query: string
	) => {
		e.preventDefault();
		try {
			setSearchData(
				await axiosGet(`/api/users/${params.userid}/search?q=${query}`)
			);
		} catch (error: any) {
			console.error(error);
		}
	};

	const clearSearch = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setSearchInput('');
		setSearchData(null);
	};

	const friendsDisplay = friendsData?.map((friend) => {
		return <PersonWrapper key={friend._id} person={friend} />;
	});

	const searchDisplay = searchData?.map((friend) => {
		return <PersonWrapper key={friend._id} person={friend} />;
	});

	return (
		<div className={styles.profile_friends}>
			<div className={styles.top}>
				<h3>Friends</h3>
				<form
					className={styles.search_box}
					onSubmit={(e) => handleSearch(e, searchInput)}
				>
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
							id='search_friends'
							name='search_friends'
							minLength={1}
							maxLength={64}
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder='Search Friend List'
						/>
						<div
							style={{
								visibility: searchInput || searchData ? 'visible' : 'hidden',
							}}
							className={styles.clear_btn}
							onClick={(e) => clearSearch(e)}
						>
							<span></span>
						</div>
					</label>
				</form>
			</div>
			<div className={styles.body}>
				{searchDisplay && searchDisplay?.length > 0 ? (
					<ul>{searchDisplay}</ul>
				) : friendsDisplay && friendsDisplay?.length > 0 ? (
					<ul>{friendsDisplay}</ul>
				) : (
					<h3 className={styles.no_friends}>No friends to show</h3>
				)}
			</div>
		</div>
	);
};

export default ProfileFriends;