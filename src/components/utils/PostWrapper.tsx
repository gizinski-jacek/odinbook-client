// @ts-nocheck

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Post.module.scss';
import CommentWrapper from './CommentWrapper';
import DeleteModal from './DeleteModal';
import dateFormatter from './_dateFormatter';

type Props = {
	openEditModal: Function;
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
};

type CommentsData = [
	comment: {
		_id: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	}
];

const PostWrapper: React.FC<Props> = ({ openEditModal, post }) => {
	const commentInputRef = useRef(null);

	const [commentsData, setCommentsData] = useState<CommentsData>([]);
	const [commentFormData, setCommentFormData] = useState({ text: '' });
	const [showComments, setShowComments] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

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

	const handleDelete = async () => {
		try {
			const resPostsData = await axios.delete(`/api/posts/${post._id}`);
			setTimelinePosts(resPostsData.data);
			setShowModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleOptions = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', menuListener);
	};

	const closeOptions = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowOptions(false);
	};

	const menuListener = (e: any) => {
		e.stopPropagation();
		if (!e.target.className.includes('options_menu')) {
			document.removeEventListener('click', menuListener);
			setShowOptions(false);
		}
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(false);
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
					</span>
					{showOptions ? (
						<div className={styles.options_menu}>
							<div
								className={styles.edit_btn}
								onClick={(e) => {
									openEditModal(e, post);
									closeOptions(e);
								}}
							>
								Edit post
							</div>
							<div
								className={styles.delete_btn}
								onClick={(e) => {
									openDeleteModal(e);
									closeOptions(e);
								}}
							>
								Delete post
							</div>
						</div>
					) : null}
				</div>
			</div>
			<div className={styles.post_text}>
				<p>{post.text}</p>
			</div>
			<div className={styles.bottom}>
				{commentsData?.length > 0 ? (
					<div
						className={styles.comment_count}
						onClick={() => {
							setShowComments((prevState) => !prevState);
							commentInputRef.current.focus();
						}}
					>
						<h5>{commentsData?.length} comments</h5>
					</div>
				) : null}
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
			{showModal ? (
				<DeleteModal
					closeModal={closeDeleteModal}
					handleDelete={handleDelete}
					text={'post'}
				/>
			) : null}
		</div>
	);
};

export default PostWrapper;
