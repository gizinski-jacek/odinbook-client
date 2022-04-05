import { createContext, useCallback, useState } from 'react';
import { Chatroom } from '../../myTypes';

type ContextProps = {
	chatList: Chatroom[];
	addChat: (data: Chatroom) => void;
	updateChat: (data: Chatroom) => void;
	removeChat: (id: string) => void;
	activeChatId: string;
	changeActiveChat: (id: string) => void;
};

const ChatContext = createContext<ContextProps>({
	chatList: [],
	addChat: (data) => null,
	updateChat: (data) => null,
	removeChat: (id) => null,
	activeChatId: '',
	changeActiveChat: (id) => null,
});

const ChatProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [chatList, setChatList] = useState<Chatroom[]>([]);
	const [activeChatId, setActiveChatId] = useState<string>('');

	const addChat = (newChat: Chatroom) => {
		if (chatList.find((chat) => chat._id === newChat._id)) {
			return;
		}
		const state = [...chatList, newChat];
		setChatList(state);
	};

	const updateChat = useCallback(
		(updatedChat: Chatroom) => {
			const state = [...chatList];
			const oldIndex = state.findIndex((chat) => chat._id === updatedChat._id);
			state.splice(oldIndex, 1, updatedChat);
			setChatList(state);
		},
		[chatList]
	);

	const removeChat = (chatId: string) => {
		const index = chatList.findIndex((chat) => chat._id === chatId);
		const state = [...chatList.filter((chat) => chat._id !== chatId)];
		if (state.length > 0) {
			setActiveChatId(state[index - 1]._id);
		} else {
			setActiveChatId('');
		}
		setChatList(state);
	};

	const changeActiveChat = (chatId: string) => {
		setActiveChatId(chatId);
	};

	const contextValue = {
		chatList,
		addChat,
		updateChat,
		removeChat,
		activeChatId,
		changeActiveChat,
	};

	return (
		<ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
	);
};

export { ChatContext, ChatProvider };
