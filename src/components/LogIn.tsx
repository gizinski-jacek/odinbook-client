import { useContext, useState } from 'react';
import { UserContext } from './hooks/UserProvider';
import type { FormError, LogInForm } from './utils/myTypes';
import { axiosGet, axiosPost } from './utils/axiosFunctions';
import FormErrorWrapper from './utils/wrappers/FormErrorWrapper';
import LoadingIcon from './utils/LoadingIcon';
import styles from '../styles/LogIn.module.scss';

type Props = {
	toggleForm: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type FormData = {
	email: string;
	password: string;
};

const LogIn: React.FC<Props> = ({ toggleForm }) => {
	const { updateUser } = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<FormError[]>([]);
	const [formData, setFormData] = useState<FormData>({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		data: LogInForm
	) => {
		e.preventDefault();
		try {
			updateUser(await axiosPost('/api/log-in/email', data));
		} catch (error: any) {
			if (!Array.isArray(error.response.data)) {
				if (typeof error.response.data === 'object') {
					setErrors([error.response.data]);
					return;
				}
				if (typeof error.response.data === 'string') {
					setErrors([{ msg: error.response.data }]);
					return;
				}
			} else {
				setErrors(error.response.data);
			}
		}
	};

	const getTestAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			updateUser(await axiosGet('/api/test-user'));
		} catch (error: any) {
			setIsLoading(false);
			console.error(error);
		}
	};

	const errorsDisplay = errors.map((error, index) => {
		return <FormErrorWrapper key={index} error={error} />;
	});

	return (
		<div className={styles.log_in_container}>
			{isLoading ? (
				<LoadingIcon />
			) : (
				<>
					<div className={styles.body}>
						<h2>Log In</h2>
						<form onSubmit={(e) => handleSubmit(e, formData)}>
							<fieldset>
								<label htmlFor='email'>Email</label>
								<input
									type='email'
									name='email'
									minLength={4}
									maxLength={32}
									value={formData.email}
									onChange={handleChange}
									required
									placeholder='Email'
								/>
							</fieldset>
							<fieldset>
								<label htmlFor='password'>Password</label>
								<input
									type='password'
									name='password'
									minLength={8}
									maxLength={64}
									value={formData.password}
									onChange={handleChange}
									required
									placeholder='Password'
								/>
							</fieldset>
							{errorsDisplay.length > 0 && (
								<ul className='error_list'>{errorsDisplay}</ul>
							)}
							<button type='submit' className='btn_default btn_confirm'>
								Log In
							</button>
						</form>
					</div>
					<div className={styles.controls}>
						<h4>Or If You Prefer</h4>
						<a
							href={`${process.env.REACT_APP_API_URI}/api/log-in/facebook`}
							className='btn_default btn_confirm'
						>
							Log In With Facebook
						</a>
						<h4>Want To Only Test Site?</h4>
						<button
							type='button'
							className='btn_default btn_confirm'
							onClick={(e) => getTestAccount(e)}
						>
							Log In With Test User
						</button>
						<hr />
						<h4>Don't Have An Account?</h4>
						<button
							type='button'
							onClick={(e) => toggleForm(e)}
							className='btn_default btn_register'
						>
							Create One Now!
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default LogIn;
