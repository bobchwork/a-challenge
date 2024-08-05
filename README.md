# A Challenge

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager][npm](https://www.npmjs.com/get-npm)
- Run `npm install` to install the node packages

## Introduction

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `npm run dev` to run in development mode. Run `npm run start` to run with prod configuration.

## Build

The service-worker only works with the production configuration. For it to work, Install the package http-server and build the app using
`npm run build` to build the application. Then go to the build folder located at 'dist/a-challenge/browser' and run `http-server -p 8081` or any free port number.
