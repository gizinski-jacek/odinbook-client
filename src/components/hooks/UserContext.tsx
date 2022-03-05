import { createContext } from 'react';

type User = {
	_id: string | null;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	full_name: string | null;
} | null;

const defaultUser: User = {
	_id: null,
	email: null,
	first_name: null,
	last_name: null,
	full_name: null,
};

export const UserContext = createContext({
	user: defaultUser,
	setUser: (user: User) => {},
});
