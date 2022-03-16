import { createContext } from 'react';
import { User } from '../../myTypes';

const defaultUser: User | null = {
	_id: '',
	first_name: '',
	last_name: '',
	friend_list: [],
	blocked_user_list: [],
	blocked_by_other_list: [],
	incoming_friend_requests: [],
	outgoing_friend_requests: [],
};

export const UserContext = createContext({
	user: defaultUser,
	setUser: (user: User | null) => {},
});
