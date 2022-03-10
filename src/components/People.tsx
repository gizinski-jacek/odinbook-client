import { useEffect, useState } from 'react';
import type { User } from '../myTypes';
import { axiosGet } from './utils/axiosFunctions';
import PersonWrapper from './utils/PersonWrapper';
import styles from '../styles/People.module.scss';

const People = () => {
	const [peopleData, setPeopleData] = useState<User[]>([]);
	const [searchInput, setSearchInput] = useState('');
	const [searchData, setSearchData] = useState<User[]>([]);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setPeopleData(await axiosGet('/api/users/people'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleSearch = async (
		e: React.FormEvent<HTMLFormElement>,
		query: string
	) => {
		e.preventDefault();
		try {
			setSearchData(await axiosGet(`/api/search/users?q=${query}`));
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

	const peopleDisplay = peopleData?.map((person) => {
		return <PersonWrapper key={person._id} person={person} />;
	});

	const searchDisplay = searchData?.map((person) => {
		return <PersonWrapper key={person._id} person={person} />;
	});

	return (
		<div className={styles.people_list}>
			<div className={styles.top}>
				<h3>People you may want to know</h3>
				<form
					className={styles.search_people}
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
							id='search_people'
							name='search_people'
							minLength={1}
							maxLength={64}
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder='Search People'
						/>
						<div
							style={{
								visibility: searchInput || showResults ? 'visible' : 'hidden',
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
				{showResults ? (
					searchDisplay.length > 0 ? (
						<div className={styles.search_results_container}>
							<h3>Search Results</h3>
							<ul>{searchDisplay}</ul>
						</div>
					) : (
						<div className={styles.empty_people}>
							<h3>No people found</h3>
						</div>
					)
				) : peopleDisplay.length > 0 ? (
					<ul>{peopleDisplay}</ul>
				) : (
					<div className={styles.empty_people}>
						<h3>No people to show</h3>
					</div>
				)}
			</div>
		</div>
	);
};

export default People;
