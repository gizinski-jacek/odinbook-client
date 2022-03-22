export type PostFull = {
	_id: string;
	author: User;
	text: string;
	comments: CommentFull[];
	likes: string[];
	createdAt: string;
	updatedAt: string;
};

export type PostNew = {
	_id?: string;
	author?: User;
	text: string;
	comments?: CommentFull[];
	likes?: string[];
	createdAt?: string;
	updatedAt?: string;
};

export type CommentFull = {
	_id: string;
	author: User;
	post_ref: string;
	text: string;
	likes: string[];
	createdAt: string;
	updatedAt: string;
};

export type CommentNew = {
	_id?: string;
	author?: User;
	post_ref?: string;
	text: string;
	likes?: string[];
	createdAt?: string;
	updatedAt?: string;
};

export type User = {
	_id: string;
	first_name: string;
	last_name: string;
	profile_picture: string;
	friend_list: string[];
	blocked_user_list: string[];
	blocked_by_other_list: string[];
	incoming_friend_requests: string[];
	outgoing_friend_requests: string[];
	bio?: string;
	hobbies?: string[];
};

export type LogInForm = {
	email: string;
	password: string;
};

export type SignUpForm = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

export type Chatroom = {
	_id: string;
	participants: string[];
	message_list: Message[];
	createdAt: string;
	updatedAt: string;
};

export type Message = {
	_id: string;
	chat_ref: string;
	author: User;
	text: string;
	createdAt: string;
	updatedAt: string;
};

export type MessageNew = {
	_id?: string;
	chat_ref?: string;
	author?: User;
	text: string;
	createdAt?: string;
	updatedAt?: string;
};
