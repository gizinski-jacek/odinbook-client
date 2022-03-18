export type PostFull = {
	_id: string;
	author: User;
	text: string;
	comments: CommentFull[];
	likes: any;
	createdAt: string;
	updatedAt: string;
};

export type PostNew = {
	_id?: string;
	author?: User;
	text: string;
	comments?: string[];
	likes?: string[];
	createdAt?: string;
	updatedAt?: string;
};

export type CommentFull = {
	_id: string;
	author: User;
	post_ref: string;
	text: string;
	likes: any;
	createdAt: string;
	updatedAt: string;
};

export type CommentNew = {
	_id?: string;
	author?: User;
	post_ref?: string;
	text: string;
	likes?: any;
	createdAt?: string;
	updatedAt?: string;
};

export type User = {
	_id: string;
	first_name: string;
	last_name: string;
	friend_list: string[];
	blocked_user_list: string[];
	blocked_by_other_list: string[];
	incoming_friend_requests: string[];
	outgoing_friend_requests: string[];
	profile_picture?: string;
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
