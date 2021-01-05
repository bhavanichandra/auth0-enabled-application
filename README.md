# Auth0 Solution as Service Provider

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This solution is aimed to use Auth0 as a Service Provider and any other provider as Identity Provider example Salesforce, Shibboleth, Okta etc. It has two things required, one is an frontend and another is API Backend. For this solution, Front end is react SPA and MuleSoft API as backend. Basically here, MuleSoft APIs are secured by JWT token provied by Auth0 via React SPA.

# Prerequisites

- Auth0 Account. Click the [link](https://auth0.com/signup) to register
- Anypoint Platform Account for MuleSoft API
- node v15.0.1 or higher
- Using create-react-app with react scripts v4.0.1

# Getting Started with App

## React SPA

- Run `npm install` to install the dependencies.
- **IMPORTANT!!!** Create a `config.json` file in src folder. This json contains, auth0 credentials such as domain, clientId, and audience. 
- Once above steps done, run `npm start` to start the server.

## MuleSoft API
- Create Anypoint Platform account and login [here](https://anypoint.mulesoft.com)
- Go to design center and create a RAML using the `auth-test` API provided in this repository or you can implement your own.
- Create new API in API Manager. Once created, make a note of API Id which need to be used in your API or can be used to replace the API Id in the provided project
- Apply JWT Validation Policy and configure it to verify with Auth0. For more information visit [Mulsoft Docs](https://docs.mulesoft.com/api-manager/2.x/policy-mule4-jwt-validation)
- Make sure to deploy the app to cloudhub and use it with the SPA.


## Run issues
- You might encounter CORS issue when using the api from Cloudhub, the solution is to add CORS Policy to the Deployed app in API Manager. For more information visit [MuleSoft Docs](https://docs.mulesoft.com/api-manager/2.x/cors-policy)



# Using the Source Code

The source code is available to everyone based on MIT Licence. But please fork the repository of you want to use this and Don't for to start this repo. Thanks!

