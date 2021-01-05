import React, { useState } from 'react';

import classes from './Error.module.css';
const Error = (props) => {
	const [visible, setVisible] = useState(true);

	const closeHandler = () => {
		setVisible(false);
	};

	return visible ? (
		<div className={classes.Error}>
			<p>Cannot Perform the action.</p>
			<p>Error Message: {props.error.message}</p>
			<button onClick={closeHandler}>Close</button>
		</div>
	) : (
		<p>Login Again</p>
	);
};

export default Error;
