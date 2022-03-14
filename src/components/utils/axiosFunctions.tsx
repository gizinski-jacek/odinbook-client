import axios from 'axios';

const options: {} = { withCredentials: true };

const axiosGet = async (url: string, opt = options) => {
	if (!url) return;
	const res = await axios.get(url, opt);
	return res.data;
};

const axiosPost = async (url: string, data: {}, opt = options) => {
	if (!url || !data) return;
	const res = await axios.post(url, data, opt);
	return res.data;
};

const axiosPut = async (url: string, data: {}, opt = options) => {
	if (!url || !data) return;
	const res = await axios.put(url, data, opt);
	return res.data;
};

const axiosDelete = async (url: string, opt = options) => {
	if (!url) return;
	const res = await axios.delete(url, opt);
	return res.data;
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
