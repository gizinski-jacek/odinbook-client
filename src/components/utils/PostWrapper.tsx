// @ts-nocheck

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Post.module.scss';
import CommentWrapper from './CommentWrapper';
import PostFormModal from './PostFormModal';
import dateFormatter from './_dateFormatter';

type Props = {
	post: {
		_id: string;
		author: {
			_id: string;
			first_name: string;
			last_name: string;
		};
		text: string;
		comments: string[];
		likes: string[];
		createdAt: string;
		updatedAt: string;
	};
	setTimelinePosts: Function;
	setShowPostFormModal: Function;
};

type CommentsData = [
	comment: {
		_id: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	}
];

const PostWrapper: React.FC<Props> = ({ post, setTimelinePosts }) => {
	const commentInputRef = useRef(null);

	const [commentsData, setCommentsData] = useState<CommentsData>([]);
	const [commentFormData, setCommentFormData] = useState({ text: '' });
	const [showComments, setShowComments] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showEditPostFormModal, setShowEditPostFormModal] = useState(false);
	const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const resCommentsData = await axios.get(
					`/api/posts/${post._id}/comments`,
					{ withCredentials: true }
				);
				setCommentsData(resCommentsData.data);
			} catch (error: any) {
				console.error(error);
			}
		})();
	}, [post._id]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setCommentFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		postId: string
	) => {
		e.preventDefault();
		try {
			const resCommentsData = await axios.post(
				`/api/posts/${postId}/comments`,
				commentFormData,
				{ withCredentials: true }
			);
			setCommentsData(resCommentsData.data);
			setCommentFormData({ text: '' });
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleDelete = async (postId: string) => {
		try {
			const resPostsData = await axios.delete(`/api/posts/${postId}`);
			setTimelinePosts(resPostsData.data);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleOptions = (e: any) => {
		e.stopPropagation();
		if (!showOptions) {
			setShowOptions(true);
			document.addEventListener('click', closeOptions);
		} else if (showOptions) {
			closeOptions(e);
		}
	};

	const closeOptions = (e: any) => {
		e.stopPropagation();
		if (
			e.target.className &&
			!e.target.className.includes('Post_options_menu')
		) {
			setShowOptions(false);
			document.removeEventListener('click', closeOptions);
		}
	};

	const toggleDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target !== e.currentTarget) {
			setShowConfirmDeleteModal(true);
			document.addEventListener('click', closeOptions);
		} else {
			setShowConfirmDeleteModal(false);
		}
	};

	const togglePostFormModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setShowEditPostFormModal(true);
		}
	};

	const commentsDisplay = commentsData?.map((comment) => {
		return (
			<CommentWrapper
				key={comment._id}
				comment={comment}
				setCommentsData={setCommentsData}
			/>
		);
	});

	return (
		<div className={styles.post}>
			<div className={styles.top}>
				<div className={styles.left}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${post.author._id}`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='user-profile-pic'
							/>
						</Link>
					</div>
					<div className={styles.metadata}>
						<Link to={`/profile/${post.author._id}`}>
							<h4>
								{post.author.first_name} {post.author.last_name}
							</h4>
						</Link>
						<Link to={`/posts/${post._id}`}>
							<h5>{dateFormatter(post.createdAt)}</h5>
						</Link>
					</div>
				</div>
				<div className={styles.right}>
					<span
						className={styles.options_toggle}
						onClick={(e) => toggleOptions(e)}
					>
						<svg viewBox='0 0 20 20' width='20' height='20'>
							<g transform='translate(-446 -350)'>
								<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
							</g>
						</svg>
						{showOptions ? (
							<div className={styles.options_menu}>
								<div
									className={styles.edit_btn}
									onClick={(e) => togglePostFormModal(e)}
								>
									Edit post
								</div>
								<div
									className={styles.delete_btn}
									onClick={() => setShowConfirmDeleteModal(true)}
								>
									Delete post
								</div>
							</div>
						) : null}
					</span>
				</div>
			</div>
			<div className={styles.post_text}>
				<p>{post.text}</p>
			</div>
			<div className={styles.bottom}>
				<div
					className={styles.comment_count}
					onClick={() => setShowComments((prevState) => !prevState)}
				>
					{commentsData ? (
						commentsData?.length > 0 ? (
							<h4>{commentsData?.length} comments</h4>
						) : null
					) : null}
				</div>
				<span className={styles.controls}>
					<div className={styles.like_btn}>Like</div>
					<div
						className={styles.comment_btn}
						onClick={() => {
							setShowComments(true);
							commentInputRef.current.focus();
						}}
					>
						Comment
					</div>
				</span>
			</div>
			<div className={styles.comments_container}>
				{showComments ? (commentsDisplay ? commentsDisplay : null) : null}
			</div>
			<div className={styles.new_comment}>
				<div className='profile-pic-style'>
					<Link to={`/profile/${post.author._id}`}>
						<img
							src='icons/placeholder_profile_pic.png'
							alt='user-profile-pic'
						/>
					</Link>
				</div>
				<form onSubmit={(e) => handleSubmit(e, post._id)}>
					<textarea
						id='text'
						name='text'
						ref={commentInputRef}
						minLength={1}
						maxLength={512}
						onChange={(e) => handleChange(e)}
						value={commentFormData.text}
						required
						placeholder='Write a comment...'
					/>
					<button className='btn-default btn-form-submit' type='submit'>
						Comment
					</button>
				</form>
			</div>
			{showEditPostFormModal ? (
				<PostFormModal
					togglePostFormModal={togglePostFormModal}
					setTimelinePosts={setTimelinePosts}
					post={post}
				/>
			) : null}
			{showConfirmDeleteModal ? (
				<div
					className={styles.confirm_delete_modal}
					onClick={(e) => toggleDeleteModal(e)}
				>
					<div className={styles.confirm_delete}>
						<h3>Delete this post?</h3>
						<span>
							Are you sure you want to delete this post? This action is
							irreversible!
						</span>
						<div className={styles.delete_controls}>
							<button
								type='button'
								className='btn-default btn-cancel'
								onClick={(e) => toggleDeleteModal(e)}
							>
								Cancel
							</button>
							<button
								type='button'
								className='btn-default btn-confirm'
								onClick={() => handleDelete(post._id)}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default PostWrapper;
