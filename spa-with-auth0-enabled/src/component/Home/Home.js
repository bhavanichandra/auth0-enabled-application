import React, { Fragment } from 'react';
import classes from './Home.module.css';
import Spinner from '../Spinner/Spinner';

import Error from '../Error/Error';

const Home = (props) => {
	let content = <p>Please Login to proceed</p>;
	if (props.isAuth) {
		content = (
			<Fragment>
				<p>User logged in successfully</p>
				<img src={props.user.picture} alt='User Profile' />
				<ul>
					<li>
						<strong>Name</strong>: {props.user.nickname}
					</li>
					<li>
						<strong>Email</strong>: {props.user.email}
					</li>
					<li>
						<strong>User Id</strong>: {props.user.sub}
					</li>
				</ul>
			</Fragment>
		);
	}
	return (
		<div className={classes.Home}>
			<h1>Welcome to {props.title}</h1>
			{props.error ? <Error error={props.error} /> : props.isLoading ? <Spinner /> : content}
		</div>
	);
};

export default Home;
