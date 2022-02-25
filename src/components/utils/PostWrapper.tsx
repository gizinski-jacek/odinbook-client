import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../../styles/Post.module.scss';
import CommentWrapper from './CommentWrapper';
import PostFormModal from './PostFormModal';

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

type CommentsData = Array<{
	_id: string;
	text: string;
	createdAt: string;
	updatedAt: string;
}>;

const PostWrapper: React.FC<Props> = ({ post, setTimelinePosts }) => {
	const [commentsData, setCommentsData] = useState<CommentsData>();
	const [commentFormData, setCommentFormData] = useState({ text: '' });
	const [showComments, setShowComments] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showPostFormModal, setShowPostFormModal] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const resCommentsData = await axios.post(
				`/api/posts/${post._id}/comments`,
				commentFormData,
				{ withCredentials: true }
			);
			setCommentsData(resCommentsData.data);
		} catch (error: any) {
			console.error(error);
		}
	};

	const handleDelete = async () => {
		try {
			const resPosts = await axios.delete(`/api/posts/${post._id}`);
			setTimelinePosts(resPosts.data);
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

	const toggleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (e.target === e.currentTarget) {
			setShowPostFormModal(false);
		}
	};

	const commentsDisplay = commentsData?.map((comment) => {
		return <CommentWrapper key={comment._id} comment={comment} />;
	});

	return (
		<div className={styles.post}>
			<div className={styles.top}>
				<div className={styles.left}>
					<div className='profile-picture'>
						<img src='placeholder_profile_pic.png' alt='user-profile-pic' />
					</div>
					<div className={styles.metadata}>
						<div>
							{post.author.first_name} {post.author.last_name}
						</div>
						<div>{new Date(post.createdAt).toLocaleString('en-gb')}</div>
					</div>
				</div>
				<div className={styles.right}>
					<button
						className={styles.options_toggle}
						onClick={(e) => toggleOptions(e)}
					>
						Options
					</button>
					{showOptions ? (
						<div className={styles.options_menu}>
							<button onClick={(e) => toggleModal(e)}>Edit post</button>
							<button onClick={() => setShowConfirmDelete(true)}>
								Delete post
							</button>
						</div>
					) : null}
					{showConfirmDelete ? (
						<div className={styles.confirm_delete_modal}>
							<div className={styles.confirm_delete}>
								<h3>Delete this post?</h3>
								<span>
									Are you sure you want to delete this post? This action is
									irreversible!
								</span>
								<div className={styles.controls}>
									<button
										className='btn-confirm'
										type='button'
										onClick={() => handleDelete()}
									>
										Delete
									</button>
									<button
										className='btn-cancel'
										type='button'
										onClick={() => setShowConfirmDelete(false)}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					) : null}
					{showPostFormModal ? (
						<PostFormModal
							toggleModal={toggleModal}
							setTimelinePosts={setTimelinePosts}
							post={post}
						/>
					) : null}
				</div>
			</div>
			<div className={styles.text}>{post.text}</div>
			<div>
				<div onClick={() => setShowComments((prevState) => !prevState)}>
					{commentsData ? (
						commentsData?.length > 0 ? (
							<p>{commentsData?.length} comments</p>
						) : null
					) : null}
				</div>
				<span>
					<div>Like</div>
					<div onClick={() => setShowComments((prevState) => !prevState)}>
						Comment
					</div>
				</span>
			</div>
			<div className={styles.comments_container}>
				{showComments ? (commentsDisplay ? commentsDisplay : null) : null}
			</div>
			<form className={styles.new_comment} onSubmit={(e) => handleSubmit(e)}>
				<div>profile picture</div>
				<textarea
					id='text'
					name='text'
					minLength={1}
					maxLength={512}
					onChange={(e) => handleChange(e)}
					value={commentFormData.text}
					required
					placeholder='Write a comment'
				/>
				<button className='btn-form-submit' type='submit'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default PostWrapper;
