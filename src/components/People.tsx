import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/People.module.scss';
import PersonWrapper from './utils/PersonWrapper';
import type { User } from '../myTypesTS';

const People = () => {
	const [peopleData, setPeopleData] = useState<User[]>();

	useEffect(() => {
		(async () => {
			try {
				const resPeople = await axios.get('/api/users', {
					withCredentials: true,
				});
				setPeopleData(resPeople.data);
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error);
				}
			}
		})();
	}, []);

	const handleSendRequest = async (userId: string) => {
		try {
			const resPeople = await axios.put(
				`/api/users/friends/request`,
				{ userId },
				{ withCredentials: true }
			);
			// setPeopleList(resPeople.data);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(error);
			}
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
