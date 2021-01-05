import classes from './App.module.css';
import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';

import Home from '../component/Home/Home';
import Explorer from '../component/Explorer/Explorer';

class App extends Component {
	eventHandler = (event, fn) => {
		event.preventDefault();
		fn();
	};

	render() {
		const isAuth = this.props.auth0.isAuthenticated;
		return (
			<div className={classes.App}>
				<header>
					<nav>
						<ul>
							<li>
								<NavLink to='/' exact activeClassName={classes.active}>
									Home
								</NavLink>
							</li>
							{!isAuth ? (
								<li>
									<NavLink
										to='/login'
										className={classes.Button}
										onClick={(event) =>
											this.eventHandler(
												event,
												this.props.auth0.loginWithRedirect
											)
										}>
										Login
									</NavLink>
								</li>
							) : (
								<React.Fragment>
									<li>
										<NavLink
											to='/api-explorer'
											activeClassName={classes.active}>
											API Explorer
										</NavLink>
									</li>
									<li>
										<NavLink
											to='/logout'
											className={classes.Button}
											onClick={(event) =>
												this.eventHandler(event, this.props.auth0.logout)
											}>
											Logout
										</NavLink>
									</li>
								</React.Fragment>
							)}
						</ul>
					</nav>
				</header>
				<Route
					path='/'
					exact
					render={() => (
						<Home
							title='Auth0 Enabled SPA!'
							error={this.props.auth0.error}
							user={this.props.auth0.user}
							isAuth={isAuth}
							isLoading={this.props.auth0.isLoading}
						/>
					)}
				/>
				{isAuth ? (
					<Route
						path='/api-explorer'
						exact
						render={() => (
							<Explorer
								token={this.props.auth0.getAccessTokenSilently}
								audience={this.props.audience}
							/>
						)}
					/>
				) : null}
			</div>
		);
	}
}

export default withAuth0(App);
