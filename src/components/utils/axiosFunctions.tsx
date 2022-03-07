import axios from 'axios';

const axiosGet = async (url: string) => {
	try {
		const res = await axios.get(url, {
			withCredentials: true,
		});
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosPost = async (url: string, data: {} | string) => {
	if (!url || !data) {
		return;
	}
	try {
		const res = await axios.post(url, data, {
			withCredentials: true,
		});
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosPut = async (url: string, update: {} | string) => {
	try {
		const res = await axios.put(url, update, {
			withCredentials: true,
		});
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

const axiosDelete = async (url: string) => {
	try {
		const res = await axios.delete(url, {
			withCredentials: true,
		});
		return res.data;
	} catch (error: any) {
		console.error(error);
	}
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
