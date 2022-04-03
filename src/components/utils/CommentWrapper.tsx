import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import type { CommentFull } from '../../myTypes';
import { axiosPut } from './axiosFunctions';
import EditCommentForm from './EditCommentForm';
import DeleteModal from './DeleteModal';
import timeSinceDate from './timeSinceDate';
import styles from '../../styles/Comment.module.scss';

type Props = {
	comment: CommentFull;
};

const CommentWrapper: React.FC<Props> = ({ comment }) => {
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	const optionsRef = useRef<HTMLDivElement>(null);

	const [commentData, setCommentData] = useState<CommentFull | null>(comment);
	const [editComment, setEditComment] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		document.addEventListener('click', closeOptionsListener);
	};

	const closeOptionsListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', closeOptionsListener);
			setShowOptions(false);
		}
	};

	const openEditForm = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setEditComment(true);
		setShowOptions(false);
	};

	const closeEditForm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setEditComment(false);
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowModal(true);
		setShowOptions(false);
	};

	const closeDeleteModal = (
		e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
	) => {
		e.stopPropagation();
		setShowModal(false);
	};

	const handleLike = async (
		e: React.MouseEvent<HTMLDivElement>,
		commentPostRef: string,
		commentId: string
	) => {
		e.stopPropagation();
		try {
			setCommentData(
				await axiosPut(
					`/api/posts/${commentPostRef}/comments/${commentId}/like`,
					{ commentPostRef, commentId }
				)
			);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
			console.error(error);
		}
	};

	const handleUpdate = async (
		e: React.FormEvent<HTMLFormElement>,
		postId: string,
		commentId: string,
		data: CommentFull
	) => {
		e.preventDefault();
		try {
			setCommentData(
				await axiosPut(`/api/posts/${postId}/comments/${commentId}`, data)
			);
			setEditComment(false);
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				navigate('/');
			}
			console.error(error);
		}
	};

	return user && commentData ? (
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
						<img
							src={
								commentData.author.profile_picture_url ||
								'/placeholder_profile_pic.png'
							}
							alt='User profile pic'
						/>
					</div>
				</Link>
				<div className={styles.body}>
					<div className={styles.upper}>
						<div className={styles.contents}>
							<Link to={`/profile/${commentData.author._id}`}>
								{commentData.author.first_name} {commentData.author.last_name}
							</Link>
							<span className={styles.comment_text}>
								<p>{commentData.text}</p>
							</span>
							{commentData.likes.length > 0 && (
								<div
									className={styles.liked}
									onClick={(e) =>
										handleLike(e, commentData.post_ref, commentData._id)
									}
								>
									<span></span>
								</div>
							)}
						</div>
						<div className={styles.right}>
							{user._id === commentData.author._id && (
								<>
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
									{showOptions && (
										<div ref={optionsRef} className={styles.options_menu}>
											<div
												className={styles.edit_btn}
												onClick={(e) => openEditForm(e)}
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
									)}
								</>
							)}
						</div>
					</div>
					<span className={styles.controls}>
						<div
							className={`${styles.like_btn} ${
								commentData.likes.includes(user._id) ? styles.liked : ''
							}`}
							onClick={(e) =>
								handleLike(e, commentData.post_ref, commentData._id)
							}
						>
							Like
						</div>
						<div className={styles.time}>
							{timeSinceDate(commentData.createdAt)}
						</div>
					</span>
				</div>
				{showModal && (
					<DeleteModal
						closeModal={closeDeleteModal}
						setData={setCommentData}
						comment={commentData}
					/>
				)}
			</li>
		)
	) : null;
};

export default CommentWrapper;
