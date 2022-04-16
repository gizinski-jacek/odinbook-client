import { createContext, useReducer } from 'react';
import { Chatroom } from '../utils/myTypes';

type ContextProps = {
	state: { activeChat: Chatroom | null; chatList: Chatroom[] | undefined };
	dispatch: (action: ChatReducerTypes) => void;
};

const initialState = {
	activeChat: null,
	chatList: [],
};

const ChatContext = createContext<ContextProps>({
	state: initialState,
	dispatch: (action) => null,
});

type ChatReducerTypes = {
	type: string;
	payload?: { chat: Chatroom } | undefined;
};

const ChatReducerActions = {
	OPEN_CHAT: 'OPEN_CHAT',
	CLOSE_CHAT: 'CLOSE_CHAT',
	SWITCH_CHAT: 'SWITCH_CHAT',
	UPDATE_CHAT: 'UPDATE_CHAT',
	CLEAR_DATA: 'CLEAR_DATA',
};

const reducer = (
	chatState: { activeChat: Chatroom | null; chatList: Chatroom[] },
	action: ChatReducerTypes
) => {
	switch (action.type) {
		case ChatReducerActions.OPEN_CHAT:
			if (!action.payload) {
				return chatState;
			}
			console.log(chatState);
			if (
				chatState.chatList.find((chat) => chat._id === action.payload?.chat._id)
			) {
				return chatState;
			}
			return {
				activeChat: action.payload.chat,
				chatList: [...chatState.chatList, action.payload.chat],
			};
		case ChatReducerActions.CLOSE_CHAT:
			if (!action.payload) {
				return chatState;
			}
			const chatIndex = chatState.chatList.findIndex(
				(chat) => chat._id === action.payload?.chat._id
			);
			if (chatIndex === -1) {
				return chatState;
			}
			const newChatList = chatState.chatList.filter(
				(chat) => chat._id !== action.payload?.chat._id
			);
			let newActiveChat;
			if (newChatList.length > 0) {
				if (chatState.activeChat?._id === action.payload.chat._id) {
					if (chatIndex === 0) {
						newActiveChat = chatState.chatList[chatIndex];
					} else {
						newActiveChat = chatState.chatList[chatIndex - 1];
					}
				} else {
					newActiveChat = chatState.activeChat;
				}
			} else {
				newActiveChat = null;
			}
			return { activeChat: newActiveChat, chatList: newChatList };
		case ChatReducerActions.SWITCH_CHAT:
			if (!action.payload) {
				return chatState;
			}
			return { activeChat: action.payload.chat, chatList: chatState.chatList };
		case ChatReducerActions.UPDATE_CHAT:
			if (!action.payload) {
				return chatState;
			}
			if (
				!chatState.chatList.find(
					(chat) => chat._id === action.payload?.chat._id
				)
			) {
				return chatState;
			}
			return {
				activeChat: action.payload.chat,
				chatList: chatState.chatList.map((chat) =>
					chat._id !== action.payload?.chat._id ? chat : action.payload?.chat
				),
			};
		case ChatReducerActions.CLEAR_DATA:
			return {};
		default:
			return chatState;
	}
};

const ChatProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const contextValue = { state, dispatch };

	return (
		<ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
	);
};

export { ChatContext, ChatProvider, ChatReducerActions };
