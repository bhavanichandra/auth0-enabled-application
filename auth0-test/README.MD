## MuleSoft API
- Create Anypoint Platform account and login [here](https://anypoint.mulesoft.com)
- Go to design center and create a RAML using the `auth-test` API provided in this repository or you can implement your own.
- Create new API in API Manager. Once created, make a note of API Id which need to be used in your API or can be used to replace the API Id in the provided project
- Apply JWT Validation Policy and configure it to verify with Auth0. For more information visit [Mulsoft Docs](https://docs.mulesoft.com/api-manager/2.x/policy-mule4-jwt-validation)
- Make sure to deploy the app to cloudhub and use it with the SPA.