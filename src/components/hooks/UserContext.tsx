import { createContext, useState } from 'react';
import { ContextProps, User } from '../../myTypes';

const UserContext = createContext<ContextProps>({
	user: null,
	setUser: () => null,
});

const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
