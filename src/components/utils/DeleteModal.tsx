import { CommentFull, PostFull } from '../../myTypes';
import { axiosDelete } from './axiosFunctions';
import styles from '../../styles/DeleteModal.module.scss';

type Props = {
	closeModal: (
		e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>
	) => void;
	setData: (value: null) => void;
	post?: PostFull | undefined;
	comment?: CommentFull | undefined;
};

const DeleteModal: React.FC<Props> = ({
	closeModal,
	setData,
	post,
	comment,
}) => {
	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		try {
			if (post) {
				await axiosDelete(`/api/posts/${post._id}`);
				setData(null);
			} else if (comment) {
				await axiosDelete(
					`/api/posts/${comment.post_ref}/comments/${comment._id}`
				);
				setData(null);
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div className={styles.modal_container}>
			<span className={styles.grayout_bg} onClick={(e) => closeModal(e)}></span>
			<div className={styles.confirm_delete}>
				<h3>Delete {post ? 'post' : 'comment'}?</h3>
				<span>
					Are you sure that you want to delete this {post ? 'post' : 'comment'}?
				</span>
				<div className={styles.delete_controls}>
					<button
						type='button'
						className='btn-default btn-cancel'
						onClick={(e) => closeModal(e)}
					>
						Cancel
					</button>
					<button
						type='button'
						className='btn-default btn-confirm'
						onClick={(e) => handleDelete(e)}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
