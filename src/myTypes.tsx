type Post = {
	_id: string;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	text: string;
	comments: string[];
	likes: string[];
	createdAt: string;
	updatedAt: string;
};

type PostEdit = {
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

type Comment = {
	_id: string;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		full_name: string;
	};
	post_ref: string;
	text: string;
	createdAt: string;
	updatedAt: string;
};

type User = {
	_id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
};

export type { Post, PostEdit, Comment, User };
