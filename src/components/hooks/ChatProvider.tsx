import { createContext, Reducer, useReducer } from 'react';
import { Chatroom } from '../utils/myTypes';

type ContextProps = {
	state: ReducerState;
	dispatch: (action: ReducerAction) => void;
};

const defaultState = {
	chatWindowOpen: true,
	activeChat: null,
	chatList: [],
};

const ChatContext = createContext<ContextProps>({
	state: defaultState,
	dispatch: (action) => null,
});

type ReducerState = {
	chatWindowOpen: boolean;
	activeChat: Chatroom | null;
	chatList: Chatroom[];
};

type ReducerAction = {
	type: string;
	payload?: { chat: Chatroom } | undefined;
};

const ChatReducerActions = {
	OPEN_CHAT_WINDOW: 'OPEN_CHAT_WINDOW',
	CLOSE_CHAT_WINDOW: 'CLOSE_CHAT_WINDOW',
	OPEN_CHAT: 'OPEN_CHAT',
	CLOSE_CHAT: 'CLOSE_CHAT',
	SWITCH_CHAT: 'SWITCH_CHAT',
	UPDATE_CHAT: 'UPDATE_CHAT',
	CLEAR_DATA: 'CLEAR_DATA',
};

const reducer = (
	chatState: ReducerState,
	action: ReducerAction
): ReducerState => {
	switch (action.type) {
		case ChatReducerActions.OPEN_CHAT_WINDOW:
			return {
				...chatState,
				chatWindowOpen: true,
			};
		case ChatReducerActions.CLOSE_CHAT_WINDOW:
			return {
				...chatState,
				chatWindowOpen: false,
			};
		case ChatReducerActions.OPEN_CHAT:
			if (!action.payload) {
				return chatState;
			}
			if (
				chatState.chatList.find((chat) => chat._id === action.payload?.chat._id)
			) {
				return chatState;
			}
			return {
				activeChat: action.payload.chat,
				chatWindowOpen: chatState.chatWindowOpen,
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
			return {
				chatWindowOpen: chatState.chatWindowOpen,
				activeChat: newActiveChat,
				chatList: newChatList,
			};
		case ChatReducerActions.SWITCH_CHAT:
			if (!action.payload) {
				return chatState;
			}
			return {
				chatWindowOpen: chatState.chatWindowOpen,
				activeChat: action.payload.chat,
				chatList: chatState.chatList,
			};
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
				chatWindowOpen: chatState.chatWindowOpen,
				activeChat: action.payload.chat,
				chatList: chatState.chatList.map((chat) =>
					chat._id !== action.payload?.chat._id ? chat : action.payload?.chat
				),
			};
		case ChatReducerActions.CLEAR_DATA:
			return defaultState;
		default:
			return chatState;
	}
};

const ChatProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [state, dispatch] = useReducer<Reducer<ReducerState, ReducerAction>>(
		reducer,
		defaultState
	);

	const contextValue = { state, dispatch };

	return (
		<ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
	);
};

export { ChatContext, ChatProvider, ChatReducerActions };
