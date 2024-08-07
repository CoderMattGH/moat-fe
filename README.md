# Matt's Online Aim Trainer (MOAT) Client

MOAT is an aim trainer game where the user has to click targets on the screen and accrue
points to beat the online leaderboards.

This is the client software written in Javascript using React.

You can play MOAT here: https://aim.codermatt.com

The server back-end repository: https://github.com/CoderMattGH/moat-be/

© 2024 All rights reserved Matthew Dixon.

## Requirements

`Node.js` _Minimum version 21.6.2_

`MOAT Server` _Version 1.2.0_

## Install

1. Clone the repository by running:

```
  git clone https://github.com/CoderMattGH/moat-fe.git
```

2. Change to the `moat-fe` directory.

3. To install any dependencies run:

```
npm install
```

## Running in the development environment

- Run the command:

```
npm run dev
```

**Note:** _In development mode, the server will assume that **MOAT Server** is running at `localhost` on port `5000`. You can change this behaviour by modifying the `.env.development` file outlined below._

## Running in the production enviornment

1. Build the project by running:

```
  npm run build
```

2. The project will be built to the `dist` directory which you can deploy to your web server.

## Environment variables

Environmental variables for production are stored in the `.env.production` file.

Environmental variables for development are stored in the `.env.development` file.

Environmental variables for both development and production are stored in the `.env` file.

These files are all in the root directory.

### List of variables

The API hostname:

```
VITE_RPC_HOSTNAME
```

_For example: `VITE_RPC_HOSTNAME=localhost`_

The API port number:

```
VITE_RPC_PORT
```

_For example: `VITE_RPC_PORT=5000`_

The API protocol number:

```
VITE_RPC_PROTOCOL
```

_For example: `VITE_RPC_PROTOCOL=http`_

The application logging level:

```
VITE_LOGL
```

_Available values are `debug`, `info` and `error`._

_For example: `VITE_LOGL=debug`_

The game round time in seconds:

```
VITE_GAME_TIME
```

_For example: `VITE_GAME_TIME=45`_
