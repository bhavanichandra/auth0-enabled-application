import axios from 'axios';

export const send = async (url, method, headers, body = null) => {
	const newHeaders = {
		...headers,
		'Content-Type': 'application/json',
		accept: 'application/json'
	};

	switch (method) {
		case 'GET':
			return await axios.get(url, { headers: newHeaders });
		case 'DELETE':
			return await axios.delete(url, { headers: newHeaders });
		case 'POST':
			return await axios.post(url, body, { headers: newHeaders });
		case 'PUT':
			return await axios.put(url, body, { headers: newHeaders });
		case 'PATCH':
			return await axios.patch(url, body, { headers: newHeaders });
		default:
			return await axios.request({
				url: url,
				method: method,
				headers: newHeaders,
				body: body
			});
	}
};

export const validateURL = (url) => {
	const regexp = new RegExp(
		/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s/?.#-]+.?)+(\/[^\s]*)?$/i
	);

	return regexp.test(url);
};
