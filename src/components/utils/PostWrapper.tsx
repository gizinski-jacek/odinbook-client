import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { CommentNew, PostFull } from '../../myTypes';
import { axiosGet, axiosPost, axiosPut } from './axiosFunctions';
import CommentWrapper from './CommentWrapper';
import PostFormModal from './PostFormModal';
import DeleteModal from './DeleteModal';
import timeSinceDate from './timeSinceDate';
import styles from '../../styles/Post.module.scss';

type Props = {
	post: PostFull;
};

const PostWrapper: React.FC<Props> = ({ post }) => {
	const { user } = useContext(UserContext);

	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	const params = useParams();

	const [postData, setPostData] = useState<PostFull | null>(post);
	const [formData, setFormData] = useState({ text: '' });
	const [showOptions, setShowOptions] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCommentsList, setShowCommentsList] = useState(false);

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

	const openEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowEditModal(true);
		setShowOptions(false);
	};

	const closeEditModal = (
		e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>
	) => {
		e.stopPropagation();
		setShowEditModal(false);
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowDeleteModal(true);
		setShowOptions(false);
	};

	const closeDeleteModal = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setShowDeleteModal(false);
	};

	const handleLike = async (postId: string) => {
		try {
			setPostData(await axiosPut(`/api/posts/${postId}/like`, { postId }));
		} catch (error: any) {
			console.error(error);
		}
	};

	const toggleComments = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowCommentsList((prevState) => !prevState);
		commentInputRef.current?.focus();
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleCommentSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		postId: string,
		data: CommentNew
	) => {
		e.preventDefault();
		try {
			setPostData(await axiosPost(`/api/posts/${postId}/comments`, data));
			setShowCommentsList(true);
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
					<Link to={`/profile/${postData.author._id}`}>
						<div className='profile-pic-style'>
							<img
								src={
									postData.author.profile_picture
										? `http://localhost:4000/photos/${postData.author.profile_picture}`
										: '/placeholder_profile_pic.png'
								}
								alt='User profile pic'
							/>
						</div>
					</Link>
					<div>
						<div className={styles.metadata}>
							<Link to={`/profile/${postData.author._id}`}>
								<h4>
									{postData.author.first_name} {postData.author.last_name}
								</h4>
							</Link>
							<h5>{timeSinceDate(postData.createdAt)}</h5>
						</div>
					</div>
				</div>
				<div className={styles.right}>
					{user._id === postData.author._id && (
						<>
							<span className={styles.options_toggle} onClick={toggleOptions}>
								<svg viewBox='0 0 20 20' width='20' height='20'>
									<g transform='translate(-446 -350)'>
										<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
									</g>
								</svg>
							</span>
							{showOptions && (
								<span ref={optionsRef} className={styles.options_menu}>
									<div className={styles.edit_btn} onClick={openEditModal}>
										Edit post
									</div>
									<div className={styles.delete_btn} onClick={openDeleteModal}>
										Delete post
									</div>
								</span>
							)}
						</>
					)}
				</div>
			</div>
			<div className={styles.contents}>
				<p>{postData.text}</p>
			</div>
			<div className={styles.bottom}>
				<div className={styles.likes_and_count}>
					{postData.likes.includes(user._id) && (
						<div
							className={styles.liked}
							onClick={(e) => handleLike(postData._id)}
						>
							<span></span>
						</div>
					)}
					{postData.comments.length > 0 && (
						<div
							className={styles.comment_count}
							onClick={(e) => toggleComments(e)}
						>
							<h5>{postData?.comments.length} comments</h5>
						</div>
					)}
				</div>
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
						className={`${styles.comment_btn} ${
							showCommentsList ? styles.shown : ''
						}`}
						onClick={(e) => toggleComments(e)}
					>
						<div className={styles.icon}>
							<span></span>
						</div>
						Comment
					</div>
				</span>
			</div>
			{showCommentsList && commentsDisplay && commentsDisplay.length > 0 && (
				<div className={styles.comments_container}>
					<ul>{commentsDisplay}</ul>
				</div>
			)}
			<div className={styles.new_comment}>
				<Link to={`/profile/${postData.author._id}`}>
					<div className='profile-pic-style'>
						<img
							src={
								postData.author.profile_picture
									? `http://localhost:4000/photos/${postData.author.profile_picture}`
									: '/placeholder_profile_pic.png'
							}
							alt='User profile pic'
						/>
					</div>
				</Link>
				<form onSubmit={(e) => handleCommentSubmit(e, postData._id, formData)}>
					<textarea
						id={`text_${post._id}`}
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
					<button
						className='btn-default btn-form-submit'
						type='submit'
						disabled={formData.text ? false : true}
					>
						Comment
					</button>
				</form>
			</div>
			{showEditModal && (
				<PostFormModal
					closeModal={closeEditModal}
					setPost={setPostData}
					post={postData}
				/>
			)}
			{showDeleteModal && (
				<DeleteModal
					closeModal={closeDeleteModal}
					setData={setPostData}
					post={postData}
				/>
			)}
		</div>
	) : null;
};

export default PostWrapper;
