# Club KAIST: Kaist club schedule manager
KAIST-Club is a club schedule manager for Kaistian.

## Prerequisites
---
### Node.js
18.x or later version is needed.
### Npm
9.5.1 version is recommended.
### Mysql
8.0 or later version is recommended.
### Other dependencies
JS Module dependency is managed by npm with packages.json file.
## Run a server
---
we assume the server is run by linux.

 The server for Club KAIST consists of three part: MySQL server, express, vue.
### Install prerequisites
- Node.js
- Npm
- Mysql
### Install modules for backend and frontend
- kaist-club/backend-express:

  ```$ npm install```

- kaist-club/frontend-vue:

  ```$ npm install```
### Run MySQL server and initialize
- Run MySQL server
  
  ```$ service mysql start```
- Initialize

  ```$ mysql ```

  ```mysql> $ source skeleton.sql;```

### Run express and vue server
- kaist-club/backend-express:

  ```$ npm run serve```

- kaist-club/frontend-vue:

  ```$ npm run serve```
### Port forwarding for remote connection
port forwarding for remote connection is not supporrted.
Club KAIST is run by local machine.