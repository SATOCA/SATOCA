## Backend
[![Backend Node.js CI](https://github.com/SATOCA/SATOCA/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/SATOCA/SATOCA/actions/workflows/backend-ci.yml)

### Quick Start
First install [node.js](https://nodejs.org) and then continue as shown below.
```
npm install -g ts-node

git clone https://github.com/SATOCA/SATOCA
cd SATOCA
cd Backend
npm install
```

Generate a .env File with following parameters:

```
NODE_ENV = 'dev'
APP_PORT = 5000
DATABASE_HOST = 127.0.0.1
DATABASE_PORT = 5432
DATABASE_USERNAME = postgres
DATABASE_PASSWORD = password
DATABASE_NAME = satoca
```

To start the backend locally run:

```
npm run dev
```

After configuring and building the project it is possible to run all tests with `npm test`.
