import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Comment.module.scss';
import dateFormatter from './_dateFormatter';

type Props = {
	comment: {
		_id: string;
		post_ref: string;
		text: string;
		createdAt: string;
		updatedAt: string;
	};
	setCommentsData: Function;
};

const CommentWrapper: React.FC<Props> = ({ comment, setCommentsData }) => {
	const [commentFormData, setCommentFormData] = useState({ text: '' });
	const [editingComment, setEditingComment] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const handleLike = async () => {
		try {
			const resCommentList = await axios.put(
				`/api/post/${comment.post_ref}/comments/${comment._id}/like`
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
				`/api/post/${comment.post_ref}/comments/${comment._id}`
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
				`/api/post/${comment.post_ref}/comments/${comment._id}`
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
		console.log(e.target);
		console.log(e.currentTarget);
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
			setShowConfirmDelete(true);
			document.addEventListener('click', closeOptions);
		} else {
			setShowConfirmDelete(false);
		}
	};

	const togglePostFormModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setEditingComment(false);
		}
	};

	return (
		<>
			{editingComment ? (
				<div className={styles.edit_comment_form}>
					<div className='profile-picture'>
						<img src='placeholder_profile_pic.png' alt='user-profile-pic' />
					</div>
					<form
						className={styles.new_comment}
						onSubmit={(e) => handleUpdate(e)}
					>
						<textarea
							id='text'
							name='text'
							minLength={1}
							maxLength={512}
							onChange={(e) => handleChange(e)}
							value={commentFormData.text}
							required
							placeholder='Write a comment...'
						/>
						<button className='btn-form-submit' type='submit'>
							Submit
						</button>
					</form>
				</div>
			) : (
				<div className={styles.comment}>
					<div className='profile-picture'>
						<img src='placeholder_profile_pic.png' alt='user-profile-pic' />
					</div>
					<div className={styles.body}>
						<div className={styles.metadata}>
							<Link to='user-profile'>full name</Link>
							<p>{comment.text}</p>
						</div>
						<span className={styles.controls}>
							<div className={styles.like_btn} onClick={() => handleLike()}>
								Like
							</div>
							<div className={styles.reply_btn} onClick={() => handleReply()}>
								Reply
							</div>
							<h6>{dateFormatter(comment.createdAt)}</h6>
						</span>
					</div>
					<span
						className={styles.options_toggle}
						onClick={(e) => toggleOptions(e)}
					>
						<span></span>
						{showOptions ? (
							<div className={styles.options_menu}>
								<div
									className={styles.edit_btn}
									onClick={(e) => togglePostFormModal(e)}
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
						{showConfirmDelete ? (
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
											className='btn-confirm'
											type='button'
											onClick={() => handleDelete()}
										>
											Delete
										</button>
										<button className='btn-cancel' type='button'>
											Cancel
										</button>
									</div>
								</div>
							</div>
						) : null}
					</span>
				</div>
			)}
		</>
	);
};

export default CommentWrapper;
