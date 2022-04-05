import axios from 'axios';

const options = { withCredentials: true };

const axiosGet = async (url: string, opt?: {}) => {
	if (!url) {
		return;
	}
	const res = await axios.get(process.env.REACT_APP_API_URI + url, {
		...options,
		...opt,
	});
	return res.data;
};

const axiosPost = async (url: string, data: {}, opt?: {}) => {
	if (!url || !data) {
		return;
	}
	const res = await axios.post(process.env.REACT_APP_API_URI + url, data, {
		...options,
		...opt,
	});
	return res.data;
};

const axiosPut = async (url: string, data: {}, opt?: {}) => {
	if (!url || !data) {
		return;
	}
	const res = await axios.put(process.env.REACT_APP_API_URI + url, data, {
		...options,
		...opt,
	});
	return res.data;
};

const axiosDelete = async (url: string, opt?: {}) => {
	if (!url) {
		return;
	}
	const res = await axios.delete(process.env.REACT_APP_API_URI + url, {
		...options,
		...opt,
	});
	return res.data;
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
