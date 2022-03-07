import { useEffect, useState } from 'react';
import type { User } from '../myTypes';
import { axiosGet, axiosPut } from './utils/axiosFunctions';
import PersonWrapper from './utils/PersonWrapper';
import styles from '../styles/People.module.scss';

const People = () => {
	const [peopleData, setPeopleData] = useState<User[]>();

	useEffect(() => {
		(async () => {
			try {
				setPeopleData(await axiosGet('/api/users/people'));
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, []);

	const handleSendRequest = async (userId: string) => {
		try {
			setPeopleData(await axiosPut(`/api/users/friends/request`, { userId }));
		} catch (error: any) {
			console.error(error);
		}
	};

	const peopleDisplay = peopleData?.map((person) => {
		return (
			<PersonWrapper
				key={person._id}
				person={person}
				handleSendRequest={handleSendRequest}
			/>
		);
	});

	return (
		<div className={styles.not_friend_list}>
			<h3>People you may want to know</h3>
			{peopleDisplay ? <ul>{peopleDisplay}</ul> : null}
		</div>
	);
};

export default People;
