import { FormError } from '../myTypes';

type Props = {
	error: FormError;
};

const FormErrorWrapper: React.FC<Props> = ({ error }) => {
	return <li className='error_msg'>{error.msg}</li>;
};

export default FormErrorWrapper;
