import React, { Fragment, useState } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { send, validateURL } from '../../utility/axios';

import Spinner from '../Spinner/Spinner';
import classes from './Explorer.module.css';
import ReactJson from 'react-json-view';

const Explorer = (props) => {
	const [selectValue, setSelectValue] = useState('GET');

	const [state, setState] = useState({ data: null });

	const [isLoading, setIsLoading] = useState(false);

	const selectValueChangeHandler = (event) => {
		setSelectValue(event.target.value);
	};

	let requestBody = null;
	if (
		selectValue === 'POST' ||
		selectValue === 'PATCH' ||
		selectValue === 'PUT'
	) {
		requestBody = (
			<Fragment>
				<label htmlFor='body'>Request Body</label>
				<input id='body' name='body' type='textarea' />
			</Fragment>
		);
	}

	const formSubmitHandler = async (event) => {
		setIsLoading(true);
		event.preventDefault();
		console.log(event.target);
		const formData = new FormData(event.target);
		let data = {};
		for (let [datakey, value] of formData.entries()) {
			data[datakey] = value;
		}
		const accessToken = await props.token({
			audience: props.audience
		});
		const isValid = validateURL(data.url);
		let response;
		if (isValid) {
			try {
				response = await send(
					data.url,
					data.method,
					{ Authorization: `Bearer ${accessToken}` },
					data.body
				);
			} catch (error) {
				response = {
					data: {
						errorMessage: error.message,
						serverMessage: error.response.data
					}
				};
			}
		} else {
			response = {
				data: {
					message: 'URL is Invalid. Please try with valid url'
				}
			};
		}

		setState({ data: response.data });
		setIsLoading(false);
		event.target.clear();
	};

	return (
		<div className={classes.Explorer}>
			<h4>Explorer for Auth0 Enabled APIs</h4>
			<form onSubmit={formSubmitHandler}>
				<label htmlFor='url'>URL</label>
				<input id='url' name='url' type='text' placeholder='Enter URL' />

				<label htmlFor='method'>Http Method</label>
				<select
					id='method'
					name='method'
					value={selectValue}
					onChange={selectValueChangeHandler}>
					<option value='GET'>GET</option>
					<option value='POST'>POST</option>
					<option value='PUT'>PUT</option>
					<option value='PATCH'>PATCH</option>
					<option value='DELETE'>DELETE</option>
				</select>

				{requestBody}
				<button type='submit'>Send Request</button>
			</form>
			{isLoading ? (
				<Spinner />
			) : (
				<div className={classes.Response}>
					{state.data === null ? (
						'Click Send Request to see Response here'
					) : (
						<ReactJson
							src={state.data}
							theme='rjv-default'
							indentWidth='10'
							style={{ padding: '10px', textAlign: 'left' }}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default withAuthenticationRequired(Explorer, {
	onRedirecting: () => <Spinner />
});
