import React, { Fragment } from 'react';

import classes from './User.module.css';

const User = (props) => {
	const renderedUser = Object.entries(props.user).map(([key, value]) => (
		<Fragment key={key}>
			<div className={classes.Key}>{key}</div>
			<div className={classes.Value}>{value}</div>
		</Fragment>
	));

	return <div className={classes.User}>{renderedUser}</div>;
};

export default User;
