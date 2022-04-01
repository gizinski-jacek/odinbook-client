import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../hooks/UserProvider';
import { CommentNew, PostFull } from '../../myTypes';
import { axiosGet, axiosPost, axiosPut } from './axiosFunctions';
import CommentWrapper from './CommentWrapper';
import PostFormModal from './PostFormModal';
import DeleteModal from './DeleteModal';
import timeSinceDate from './timeSinceDate';
import stylesPost from '../../styles/Post.module.scss';
import stylesCommentForm from '../../styles/CommentForm.module.scss';

type Props = {
	post: PostFull;
};

const PostWrapper: React.FC<Props> = ({ post }) => {
	const { user } = useContext(UserContext);

	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	const params = useParams();

	const [postData, setPostData] = useState<PostFull | null>(post);
	const [formData, setFormData] = useState<CommentNew>({ text: '' });
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
		document.addEventListener('click', windowOptionsListener);
	};

	const windowOptionsListener = (e: any) => {
		e.stopPropagation();
		if (optionsRef.current !== e.target) {
			document.removeEventListener('click', windowOptionsListener);
			setShowOptions(false);
		}
	};

	const openEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		setShowEditModal(true);
		setShowOptions(false);
	};

	const closeEditModal = (
		e:
			| React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
			| React.FormEvent<HTMLFormElement>
	) => {
		e.stopPropagation();
		setShowEditModal(false);
	};

	const openDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setShowDeleteModal(true);
		setShowOptions(false);
	};

	const closeDeleteModal = (
		e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
	) => {
		e.stopPropagation();
		setShowDeleteModal(false);
	};

	const handleLike = async (
		e: React.MouseEvent<HTMLDivElement>,
		postId: string
	) => {
		e.stopPropagation();
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

	const handleSubmit = async (
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

	const updatePost = (e: React.FormEvent<HTMLFormElement>, data: PostFull) => {
		e.stopPropagation();
		setPostData(data);
	};

	const commentsDisplay = postData?.comments.map((comment) => {
		return <CommentWrapper key={comment._id} comment={comment} />;
	});

	return user && postData ? (
		<div className={stylesPost.post}>
			<div className={stylesPost.top}>
				<div className={stylesPost.left}>
					<Link to={`/profile/${postData.author._id}`}>
						<div className='profile-pic-style'>
							<img
								src={
									postData.author.profile_picture
										? `http://localhost:4000/photos/users/${postData.author.profile_picture}`
										: '/placeholder_profile_pic.png'
								}
								alt='User profile pic'
							/>
						</div>
					</Link>
					<div>
						<div className={stylesPost.metadata}>
							<Link to={`/profile/${postData.author._id}`}>
								<h4>
									{postData.author.first_name} {postData.author.last_name}
								</h4>
							</Link>
							<h5>{timeSinceDate(postData.createdAt)}</h5>
						</div>
					</div>
				</div>
				<div className={stylesPost.right}>
					{user._id === postData.author._id && (
						<>
							<span
								className={stylesPost.options_toggle}
								onClick={(e) => toggleOptions(e)}
							>
								<svg viewBox='0 0 20 20' width='20' height='20'>
									<g transform='translate(-446 -350)'>
										<path d='M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0'></path>
									</g>
								</svg>
							</span>
							{showOptions && (
								<span ref={optionsRef} className={stylesPost.options_menu}>
									<div
										className={stylesPost.edit_btn}
										onClick={(e) => openEditModal(e)}
									>
										Edit post
									</div>
									<div
										className={stylesPost.delete_btn}
										onClick={(e) => openDeleteModal(e)}
									>
										Delete post
									</div>
								</span>
							)}
						</>
					)}
				</div>
			</div>
			<div className={stylesPost.contents}>
				{postData.picture && (
					<div className={stylesPost.post_picture}>
						<img
							src={`http://localhost:4000/photos/posts/${postData.picture}`}
							alt='Post pic'
						/>
					</div>
				)}
				<p>{postData.text}</p>
			</div>
			<div className={stylesPost.bottom}>
				<div className={stylesPost.likes_and_count}>
					{postData.likes.length > 0 && (
						<div
							className={stylesPost.liked}
							onClick={(e) => handleLike(e, postData._id)}
						>
							<span></span>
							{postData.likes.length > 0 && postData.likes.length === 1 ? (
								<h5>{`${postData.likes.length} person likes this post`}</h5>
							) : (
								<h5>{`${postData.likes.length} people like this post`}</h5>
							)}
						</div>
					)}
					{postData.comments.length > 0 && (
						<div
							className={stylesPost.comment_count}
							onClick={(e) => toggleComments(e)}
						>
							<h5>{postData?.comments.length} comments</h5>
						</div>
					)}
				</div>
				<span className={stylesPost.controls}>
					<div
						className={`${stylesPost.like_btn} ${
							postData.likes.includes(user._id) ? stylesPost.liked : ''
						}`}
						onClick={(e) => handleLike(e, postData._id)}
					>
						<div className={stylesPost.icon}>
							<span></span>
						</div>
						Like
					</div>
					<div
						className={`${stylesPost.comment_btn} ${
							showCommentsList ? stylesPost.shown : ''
						}`}
						onClick={(e) => toggleComments(e)}
					>
						<div className={stylesPost.icon}>
							<span></span>
						</div>
						Comment
					</div>
				</span>
			</div>
			{showCommentsList && commentsDisplay && commentsDisplay.length > 0 && (
				<div className={stylesPost.comments_container}>
					<ul>{commentsDisplay}</ul>
				</div>
			)}
			<div className={stylesCommentForm.comment_form_container}>
				<Link to={`/profile/${postData.author._id}`}>
					<div className='profile-pic-style'>
						<img
							src={
								postData.author.profile_picture
									? `http://localhost:4000/photos/users/${postData.author.profile_picture}`
									: '/placeholder_profile_pic.png'
							}
							alt='User profile pic'
						/>
					</div>
				</Link>
				<form onSubmit={(e) => handleSubmit(e, postData._id, formData)}>
					<textarea
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
					updatePost={updatePost}
					postData={postData}
					postPictureData={postData.picture}
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
