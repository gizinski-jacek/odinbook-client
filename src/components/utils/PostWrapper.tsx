import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { CommentNew, PostFull } from '../../myTypes';
import { axiosGet, axiosPost, axiosPut } from './axiosFunctions';
import CommentWrapper from './CommentWrapper';
import PostFormModal from './PostFormModal';
import DeleteModal from './DeleteModal';
import timeSinceDate from './_timeSinceDate';
import styles from '../../styles/Post.module.scss';

type Props = {
	post: PostFull;
};

const PostWrapper: React.FC<Props> = ({ post }) => {
	const { user } = useContext(UserContext);

	const commentInputRef = useRef<HTMLTextAreaElement>(null);

	const params = useParams();

	const [postData, setPostData] = useState<PostFull | null>(post);
	const [formData, setFormData] = useState({ text: '' });
	const [showComments, setShowComments] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		(async () => {
			if (!post) {
				try {
					setPostData(await axiosGet(`/api/posts/${params.postId}/comments`));
				} catch (error: any) {
					console.error(error);
				}
			}
		})();
	}, [post, params]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const openModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowEditModal(true);
	};

	const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowEditModal(false);
	};

	const handleLike = async (postId: string) => {
		try {
			setPostData(await axiosPut(`/api/posts/${postId}/like`, { postId }));
		} catch (error: any) {
			console.error(error);
		}
	};

	const toggleOptions = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowOptions((prevState) => !prevState);
		window.addEventListener('click', windowListener);
	};

	const closeOptions = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowOptions(false);
	};

	const windowListener = (e: any) => {
		e.stopPropagation();
		if (!e.target.className.includes('options_menu')) {
			window.removeEventListener('click', windowListener);
			setShowOptions(false);
		}
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowDeleteModal(true);
	};

	const closeDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowDeleteModal(false);
	};

	const handleCommentSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		postId: string,
		formData: CommentNew
	) => {
		e.preventDefault();
		try {
			setPostData(await axiosPost(`/api/posts/${postId}/comments`, formData));
			setShowComments(true);
			setFormData({ text: '' });
		} catch (error: any) {
			console.error(error);
		}
	};

	const commentsDisplay = postData?.comments.map((comment) => {
		return <CommentWrapper key={comment._id} comment={comment} />;
	});

	return postData ? (
		<div className={styles.post}>
			<div className={styles.top}>
				<div className={styles.left}>
					<div className='profile-pic-style'>
						<Link to={`/profile/${postData.author._id}`}>
							<img src='/placeholder_profile_pic.png' alt='User profile pic' />
						</Link>
					</div>
					<div className={styles.metadata}>
						<Link to={`/profile/${postData.author._id}`}>
							<h4>{postData.author.full_name}</h4>
						</Link>
						<Link to={`/posts/${postData._id}`}>
							<h5>{timeSinceDate(postData.createdAt)}</h5>
						</Link>
					</div>
				</div>
				<div className={styles.right}>
					{user._id === postData.author._id ? (
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
							{showOptions ? (
								<div className={styles.options_menu}>
									<div
										className={styles.edit_btn}
										onClick={(e) => {
											openModal(e);
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
						</>
					) : null}
				</div>
			</div>
			<div className={styles.post_text}>
				<p>{postData.text}</p>
			</div>
			<div className={styles.bottom}>
				{postData.comments.length > 0 ? (
					<div className={styles.likes_and_count}>
						{postData.likes.includes(user._id) ? (
							<div
								className={styles.liked}
								onClick={(e) => handleLike(postData._id)}
							>
								<span></span>
							</div>
						) : null}
						<div
							className={styles.comment_count}
							onClick={() => {
								setShowComments((prevState) => !prevState);
								commentInputRef.current?.focus();
							}}
						>
							<h5>{postData?.comments.length} comments</h5>
						</div>
					</div>
				) : null}
				<span className={styles.controls}>
					<div
						className={`${styles.like_btn} ${
							postData.likes.includes(user._id) ? styles.liked : ''
						}`}
						onClick={() => handleLike(postData._id)}
					>
						<div className={styles.icon}>
							<span></span>
						</div>
						Like
					</div>
					<div
						className={styles.comment_btn}
						onClick={() => {
							setShowComments(true);
							commentInputRef.current?.focus();
						}}
					>
						<div className={styles.icon}>
							<span></span>
						</div>
						Comment
					</div>
				</span>
			</div>
			{showComments && commentsDisplay && commentsDisplay.length > 0 ? (
				<div className={styles.comments_container}>{commentsDisplay}</div>
			) : null}
			<div className={styles.new_comment}>
				<div className='profile-pic-style'>
					<Link to={`/profile/${postData.author._id}`}>
						<img src='/placeholder_profile_pic.png' alt='User profile pic' />
					</Link>
				</div>
				<form onSubmit={(e) => handleCommentSubmit(e, postData._id, formData)}>
					<textarea
						id='text'
						name='text'
						ref={commentInputRef}
						minLength={1}
						maxLength={512}
						rows={2}
						onChange={(e) => handleChange(e)}
						value={formData.text}
						required
						placeholder='Write a comment...'
					/>
					<button className='btn-default btn-form-submit' type='submit'>
						Comment
					</button>
				</form>
			</div>
			{showEditModal ? (
				<PostFormModal
					closeModal={closeModal}
					setData={setPostData}
					post={postData}
				/>
			) : null}
			{showDeleteModal ? (
				<DeleteModal
					closeModal={closeDeleteModal}
					setData={setPostData}
					post={postData}
				/>
			) : null}
		</div>
	) : null;
};

export default PostWrapper;
