import { createContext, useCallback, useState } from 'react';
import { User } from '../../myTypes';

type ContextProps = {
	user: User | null;
	updateUser: (userData: User | null) => void;
};

const UserContext = createContext<ContextProps>({
	user: null,
	updateUser: (userData) => null,
});

const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	const updateUser = useCallback((userData: User | null) => {
		setUser(userData);
	}, []);

	return (
		<UserContext.Provider value={{ user, updateUser }}>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
