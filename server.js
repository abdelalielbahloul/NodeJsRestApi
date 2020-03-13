require('dotenv').config();
const http = require('http');
const app = require('./app');
const port = process.env.PORT;
const environment = process.env.NODE_ENV;
const server = http.createServer(app);

server.listen(port, console.log(
    `\t-The server is running on ${environment} environment
    \t-In localhost:${port}`
))