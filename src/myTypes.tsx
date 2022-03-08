type PostFull = {
	_id: string;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	text: string;
	comments: CommentFull[];
	likes: any;
	createdAt: string;
	updatedAt: string;
};

type PostNew = {
	_id?: string;
	author?: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	text: string;
	comments?: string[];
	likes?: string[];
	createdAt?: string;
	updatedAt?: string;
};

type CommentFull = {
	_id: string;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	post_ref: string;
	text: string;
	likes: any;
	createdAt: string;
	updatedAt: string;
};

type CommentNew = {
	_id?: string;
	author?: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	post_ref?: string;
	text: string;
	likes?: any;
	createdAt?: string;
	updatedAt?: string;
};

type User = {
	_id: string;
	first_name: string;
	last_name: string;
	full_name: string;
	friend_list: string[];
	blocked_user_list: string[];
	blocked_by_other_list: string[];
	incoming_friend_requests: string[];
	outgoing_friend_requests: string[];
};

export type { User, PostFull, PostNew, CommentFull, CommentNew };
