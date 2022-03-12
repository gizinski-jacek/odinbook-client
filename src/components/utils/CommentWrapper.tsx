import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import type { CommentFull } from '../../myTypes';
import { axiosPut } from './axiosFunctions';
import EditCommentForm from './EditCommentForm';
import DeleteModal from './DeleteModal';
import timeSinceDate from './_timeSinceDate';
import styles from '../../styles/Comment.module.scss';

type Props = {
	comment: CommentFull;
};

const CommentWrapper: React.FC<Props> = ({ comment }) => {
	const { user } = useContext(UserContext);

	const optionsRef = useRef(null);

	const [commentData, setCommentData] = useState<CommentFull>(comment);
	const [editComment, setEditComment] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', windowListener);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const openEditForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setEditComment(true);
		setShowOptions(false);
	};

	const closeEditForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setEditComment(false);
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(true);
		setShowOptions(false);
	};

	const closeDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(false);
	};

	const handleLike = async (commentPostRef: string, commentId: string) => {
		try {
			setCommentData(
				await axiosPut(
					`/api/posts/${commentPostRef}/comments/${commentId}/like`,
					{ commentPostRef, commentId }
				)
			);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleReply = async (commentId: string) => {
		try {
			//
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleUpdate = async (
		e: React.FormEvent<HTMLFormElement>,
		data: CommentFull
	) => {
		e.preventDefault();
		try {
			setCommentData(
				await axiosPut(`/api/posts/${data.post_ref}/comments/${data._id}`, data)
			);
			setEditComment(false);
		} catch (error: any) {
			console.error(error);
		}
	};

	return commentData ? (
		editComment ? (
			<EditCommentForm
				handleUpdate={handleUpdate}
				closeModal={closeEditForm}
				comment={commentData}
			/>
		) : (
			<li className={styles.comment}>
				<Link to={`/profile/${commentData.author._id}`}>
					<div className='profile-pic-style'>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</div>
				</Link>
				<div className={styles.body}>
					<div className={styles.upper}>
						<div className={styles.contents}>
							<Link to={`/profile/${commentData.author._id}`}>
								{commentData.author.full_name}
							</Link>
							<span className={styles.comment_text}>
								<p>{commentData.text}</p>
							</span>
							{commentData.likes.includes(user._id) ? (
								<div
									className={styles.liked}
									onClick={() =>
										handleLike(commentData.post_ref, commentData._id)
									}
								>
									<span></span>
								</div>
							) : null}
						</div>
						<div className={styles.right}>
							{user._id === commentData.author._id ? (
								<>
									<span
										className={styles.options_toggle}
										onClick={toggleOptions}
									>
										<svg viewBox='0 0 20 20' width='20' height='20'>
											<g transform='translate(-446 -350)'>
												<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
											</g>
										</svg>
									</span>
									{showOptions ? (
										<div ref={optionsRef} className={styles.options_menu}>
											<div className={styles.edit_btn} onClick={openEditForm}>
												Edit comment
											</div>
											<div
												className={styles.delete_btn}
												onClick={openDeleteModal}
											>
												Delete comment
											</div>
										</div>
									) : null}
								</>
							) : null}
						</div>
					</div>
					<span className={styles.controls}>
						<div
							className={`${styles.like_btn} ${
								commentData.likes.includes(user._id) ? styles.liked : ''
							}`}
							onClick={() => handleLike(commentData.post_ref, commentData._id)}
						>
							Like
						</div>
						<div
							className={styles.reply_btn}
							onClick={() => handleReply(commentData._id)}
						>
							Reply
						</div>
						<div className={styles.time}>
							{timeSinceDate(commentData.createdAt)}
						</div>
					</span>
				</div>
				{showModal ? (
					<DeleteModal
						closeModal={closeDeleteModal}
						setData={setCommentData}
						comment={commentData}
					/>
				) : null}
			</li>
		)
	) : null;
};

export default CommentWrapper;
