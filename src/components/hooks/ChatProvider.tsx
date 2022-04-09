import { createContext, useCallback, useState } from 'react';
import { Chatroom } from '../utils/myTypes';

type ContextProps = {
	chatList: Chatroom[];
	addChat: (data: Chatroom) => void;
	updateChat: (data: Chatroom) => void;
	removeChat: (id: string) => void;
	activeChat: Chatroom | null;
	changeActiveChat: (data: Chatroom | null) => void;
	clearData: () => void;
};

const ChatContext = createContext<ContextProps>({
	chatList: [],
	addChat: (data) => null,
	updateChat: (data) => null,
	removeChat: (id) => null,
	activeChat: null,
	changeActiveChat: (data) => null,
	clearData: () => null,
});

const ChatProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [chatList, setChatList] = useState<Chatroom[]>([]);
	const [activeChat, setActiveChat] = useState<Chatroom | null>(null);

	const addChat = (newChat: Chatroom) => {
		if (chatList.find((chat) => chat._id === newChat._id)) {
			return;
		}
		changeActiveChat(newChat);
		const state = [...chatList, newChat];
		setChatList(state);
	};

	const updateChat = useCallback(
		(updatedChat: Chatroom) => {
			const state = [...chatList];
			const oldIndex = state.findIndex((chat) => chat._id === updatedChat._id);
			if (oldIndex === -1) {
				return;
			}
			state.splice(oldIndex, 1, updatedChat);
			changeActiveChat(updatedChat);
			setChatList(state);
		},
		[chatList]
	);

	const removeChat = (chatId: string) => {
		const index = chatList.findIndex((chat) => chat._id === chatId);
		const state = [...chatList.filter((chat) => chat._id !== chatId)];
		if (state.length > 0) {
			if (activeChat?._id === chatId) {
				if (index === 0) {
					changeActiveChat(state[index]);
				} else {
					changeActiveChat(state[index - 1]);
				}
			}
		} else {
			changeActiveChat(null);
		}
		setChatList(state);
	};

	const clearData = useCallback(() => {
		setChatList([]);
	}, []);

	const changeActiveChat = (chat: Chatroom | null) => {
		setActiveChat(chat);
	};

	const contextValue = {
		chatList,
		addChat,
		updateChat,
		removeChat,
		activeChat,
		changeActiveChat,
		clearData,
	};

	return (
		<ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
	);
};

export { ChatContext, ChatProvider };
