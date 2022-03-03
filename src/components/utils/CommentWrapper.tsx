// @ts-nocheck

import axios from 'axios';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Comment.module.scss';
import { UserContext } from '../hooks/UserContext';
import DeleteModal from './DeleteModal';
import EditCommentForm from './EditCommentForm';
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
	const [editingComment, setEditingComment] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleLike = async (commentId: string) => {
		try {
			const resCommentList = await axios.put(
				`/api/posts/${comment.post_ref}/comments/${commentId}/like`
			);
			setCommentsData(resCommentList);
		} catch (error) {
			console.error(error);
		}
	};

	const handleReply = async (commentId: string) => {
		try {
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = async (
		e: React.FormEvent<HTMLFormElement>,
		commentPostRef: string,
		commentId: string
	) => {
		e.preventDefault();
		try {
			const resCommentList = await axios.put(
				`/api/posts/${commentPostRef}/comments/${commentId}`,
				commentFormData,
				{ withCredentials: true }
			);
			setCommentsData(resCommentList.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (commentPostRef: string, commentId: string) => {
		try {
			const resCommentList = await axios.delete(
				`/api/posts/${commentPostRef}/comments/${commentId}`,
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

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(true);
	};

	const closeDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(false);
	};

	return (
		<>
			{editingComment ? (
				<EditCommentForm
					handleUpdate={handleUpdate}
					setEditingComment={setEditingComment}
					comment={comment}
				/>
			) : (
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
						<div className={styles.upper}>
							<div className={styles.contents}>
								<Link to={`/profile/${comment.author._id}`}>
									{comment.author.first_name} {comment.author.last_name}
								</Link>
								<p>{comment.text}</p>
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
												onClick={(e) => openDeleteModal(e)}
											>
												Delete comment
											</div>
										</div>
									) : null}
								</span>
							) : null}
						</div>
						<span className={styles.controls}>
							<div
								className={styles.like_btn}
								onClick={() => handleLike(comment._id)}
							>
								Like
							</div>
							<div
								className={styles.reply_btn}
								onClick={() => handleReply(comment._id)}
							>
								Reply
							</div>
							<Link to={`/posts/:postid`}>
								{dateFormatter(comment.createdAt)}
							</Link>
						</span>
					</div>

					{showModal ? (
						<DeleteModal
							closeModal={closeDeleteModal}
							handleDelete={handleDelete}
							text={'comment'}
						/>
					) : null}
				</div>
			)}
		</>
	);
};

export default CommentWrapper;
