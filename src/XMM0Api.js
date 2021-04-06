import axios from 'axios';

const SERVER = "http://scnbox.com:8080";

const XMM0Create = () => {
	return axios.post(`${SERVER}/create`, {
		//
	});
};

const XMM0Join = (id, name) => {
	return axios.post(`${SERVER}/room/${id}/join`, {
		name: name
	});
};

const XMM0Leave = (id, uid) => {
	return axios.post(`${SERVER}/room/${id}/leave`, {
		id: uid
	});
};

const XMM0Send = (id, uid, content) => {
	return axios.post(`${SERVER}/room/${id}/send`, {
		id: uid,
		content: content
	});
};

const XMM0Read = (id, uid) => {
	return axios.post(`${SERVER}/room/${id}/read`, {
		id: uid
	});
}

export {
	XMM0Create,
	XMM0Join,
	XMM0Leave,
	XMM0Send,
	XMM0Read
}