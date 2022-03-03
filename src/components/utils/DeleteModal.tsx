import styles from '../../styles/DeleteModal.module.scss';

type Props = {
	closeModal: Function;
	handleDelete: Function;
	text: string;
};

const DeleteModal: React.FC<Props> = ({ closeModal, handleDelete, text }) => {
	return (
		<div className={styles.modal_container}>
			<span className={styles.grayout_bg} onClick={(e) => closeModal(e)}></span>
			<div className={styles.confirm_delete}>
				<h3>Delete this {text}?</h3>
				<span>
					Are you sure you want to delete this {text}? This action is
					irreversible!
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
