# DWP Test
The API for the test is written in NPM, NodeJS, and ExpressJS. Both linting and unit tests have also been added. Tests are written in Jest and the linting is done with ESLint using airbnb standards

## Getting Started
To get a local copy up and running follow the steps below:

### Installing
1. Open NodeJS Command Prompt
2. Clone the repo to a directory of your choice
```sh
git clone https://github.com/asteady85/dwp-application.git
```
3. Install NPM packages
```sh
npm install
```

### Run the application
1. Open NodeJS Command Prompt
2. cd to root directory of project
3. Run command `npm start`
4. The application should now be running on the following domain: `http://localhost:8080`

### Test links
Get list of users who live in London<br />
`http://localhost:8080/users/liveincity/London`<br /><br />
Get list of users who are currently positioned within 50 miles of London<br />
`http://localhost:8080/users/incityradius/London/50`<br /><br />
Get list of users who either live in London or currently positioned within 50 miles of London<br />
`http://localhost:8080/users/getallincityradius/London/50`

## Running tests
Unit Tests - `npm run test`<br />
Lint Tests - `npm run lint`<br />
Audit Packages Test - `npm audit`
