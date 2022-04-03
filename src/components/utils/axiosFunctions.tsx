import axios from 'axios';

const options = { withCredentials: true };

const axiosGet = async (url: string, opt?: {}) => {
	if (!url) {
		return;
	}
	const res = await axios.get(url, { ...options, ...opt });
	return res.data;
};

const axiosPost = async (url: string, data: {}, opt?: {}) => {
	if (!url || !data) {
		return;
	}
	const res = await axios.post(url, data, { ...options, ...opt });
	return res.data;
};

const axiosPut = async (url: string, data: {}, opt?: {}) => {
	if (!url || !data) {
		return;
	}
	const res = await axios.put(url, data, { ...options, ...opt });
	return res.data;
};

const axiosDelete = async (url: string, opt?: {}) => {
	if (!url) {
		return;
	}
	const res = await axios.delete(url, { ...options, ...opt });
	return res.data;
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
