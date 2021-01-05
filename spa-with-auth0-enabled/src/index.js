import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import './index.css';
import App from './containers/App';
import config from './config.json';

if (!config) {
	throw new Error('Please add config.json in src folder');
}

const auth0Config = {
	domain: config.domain,
	clientId: config.clientId,
	redirectUri: window.location.origin
};

ReactDOM.render(
	<BrowserRouter>
		<Auth0Provider
			domain={auth0Config.domain}
			clientId={auth0Config.clientId}
			redirectUri={auth0Config.redirectUri}>
			<App audience={config.audience} />
		</Auth0Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
