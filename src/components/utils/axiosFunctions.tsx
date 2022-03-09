import axios from 'axios';

const options: {} = { withCredentials: true };

const axiosGet = async (url: string, opt = options) => {
	if (!url) return;
	try {
		const res = await axios.get(url, opt);
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosPost = async (url: string, data: {}, opt = options) => {
	if (!url || !data) return;
	try {
		const res = await axios.post(url, data, opt);
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosPut = async (url: string, data: {}, opt = options) => {
	if (!url || !data) return;
	try {
		const res = await axios.put(url, data, opt);
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosDelete = async (url: string, opt = options) => {
	if (!url) return;
	try {
		const res = await axios.delete(url, opt);
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
