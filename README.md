# Odinbook (Frontend)

A small Facebook clone Frontend client.

For the Backend API go [here](https://github.com/gizinski-jacek/odinbook-client).

## Table of contents

- [Github & Live](#github--live)
- [Getting Started](#getting-started)
- [React](#react)
- [Deploy](#deploy)
- [Features](#features)
- [Status](#status)
- [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/odinbook-client).

Live demo can be found on [Heroku](https://cv-project-react-543266.herokuapp.com).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

In the project root directory run the app in development mode with:
Install all dependancies by running:

```bash
npm install
```

In the project root directory run the app with:

```bash
npm start dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
The page will reload if you make edits.\
You will also see any lint errors in the console.

Build the app for production to the `build` folder with:

```bash
npm run build
```

It correctly bundles React in production mode and optimizes the build for the best performance.\
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deploy

You can easily deploy this app using [Heroku Platform](https://devcenter.heroku.com/articles/git).

Script for running app build after deployment to Heroku is included in package.json.\
In the project root directory run these commands:

```bash
heroku create
git push heroku main
heroku open
```

You cannot deploy both Frontend and Backend to Heroku because [Heroku is included in Suffix List](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com), which prevents an app on heroku domain from setting cookies on other heroku apps.\
You can either use [Custom Domain](https://devcenter.heroku.com/articles/custom-domains) or deploy either app to other hosting service like [Netlify](https://docs.netlify.com/cli/get-started).

To do so run these commands:

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod
```

After that just follow the instructions to deploy a built app to Netlify.

## Features

- Responsive UI
- Logging in with Facebook account
- Adding posts and comments
- Liking posts and comments
- Searching for users and posts
- Sending and cancelling friend requests
- Removing and blocking users
- Real-time notifications about incoming friend requests and chat messages
- Chatting in real-time with other users

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
jacektrg@gmail.com
```
