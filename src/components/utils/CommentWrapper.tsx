// @ts-nocheck

import axios from 'axios';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Comment.module.scss';
import { UserContext } from '../hooks/UserContext';
import dateFormatter from './_dateFormatter';

type Props = {
	comment: {
		_id: string;
		author: {
			_id: string;
			first_name: string;
			last_name: string;
		};
		post_ref: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	};
	setCommentsData: Function;
};

const CommentWrapper: React.FC<Props> = ({ comment, setCommentsData }) => {
	const { user } = useContext(UserContext);
	const [commentFormData, setCommentFormData] = useState({ text: '' });
	const [editingComment, setEditingComment] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const handleLike = async () => {
		try {
			const resCommentList = await axios.put(
				`/api/posts/${comment.post_ref}/comments/${comment._id}/like`
			);
			setCommentsData(resCommentList);
		} catch (error) {
			console.error(error);
		}
	};

	const handleReply = async () => {
		try {
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			const resCommentList = await axios.put(
				`/api/posts/${comment.post_ref}/comments/${comment._id}`,
				commentFormData,
				{ withCredentials: true }
			);
			setCommentsData(resCommentList.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setCommentFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleDelete = async () => {
		try {
			const resCommentList = await axios.delete(
				`/api/posts/${comment.post_ref}/comments/${comment._id}`,
				{ withCredentials: true }
			);
			setCommentsData(resCommentList.data);
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

	const toggleDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target !== e.currentTarget) {
			setShowConfirmDelete(true);
			document.addEventListener('click', closeOptions);
		} else {
			setShowConfirmDelete(false);
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

	const toggleCommentForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setEditingComment(true);
		}
	};

	return (
		<>
			{!editingComment ? (
				<div className={styles.comment}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${comment.author._id}`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='user-profile-pic'
							/>
						</Link>
					</div>
					<div className={styles.body}>
						<div className={styles.metadata}>
							<Link to={`/profile/${comment.author._id}`}>
								{comment.author.first_name} {comment.author.last_name}
							</Link>
							<p>{comment.text}</p>
						</div>
						<span className={styles.controls}>
							<div className={styles.like_btn} onClick={() => handleLike()}>
								Like
							</div>
							<div className={styles.reply_btn} onClick={() => handleReply()}>
								Reply
							</div>
							<Link to={`/posts/:postid`}>
								{dateFormatter(comment.createdAt)}
							</Link>
						</span>
					</div>
					{user._id === comment.author._id ? (
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
										onClick={(e) => toggleCommentForm(e)}
									>
										Edit comment
									</div>
									<div
										className={styles.delete_btn}
										onClick={() => setShowConfirmDelete(true)}
									>
										Delete comment
									</div>
								</div>
							) : null}
						</span>
					) : null}
					{showConfirmDelete ? (
						<div
							className={styles.confirm_delete_modal}
							onClick={(e) => toggleDeleteModal(e)}
						>
							<div className={styles.confirm_delete}>
								<h3>Delete this comment?</h3>
								<span>Are you sure you want to delete this comment?</span>
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
										onClick={() => handleDelete()}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					) : null}
				</div>
			) : (
				<div className={styles.edit_comment}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${comment.author._id}`}>
							<img
								src='icons/placeholder_profile_pic.png'
								alt='user-profile-pic'
							/>
						</Link>
					</div>
					<form onSubmit={(e) => handleUpdate(e)}>
						<textarea
							id='text'
							name='text'
							minLength={1}
							maxLength={512}
							onChange={(e) => handleChange(e)}
							value={commentFormData.text ? commentFormData.text : comment.text}
							required
							placeholder='Write a comment...'
						/>
						<div className={styles.edit_controls}>
							<button
								type='button'
								className='btn-default btn-cancel'
								onClick={() => {
									setCommentFormData({ text: '' });
									setEditingComment(false);
								}}
							>
								Cancel
							</button>
							<button type='submit' className='btn-default btn-form-submit'>
								Update
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
};

export default CommentWrapper;
