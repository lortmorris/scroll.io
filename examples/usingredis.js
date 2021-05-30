/**
 * Scroll.io example. Run a simple http server
 * @author César Casas - https://ar.linkedin.com/in/cesarcasas
 */

const http = require('http');
const socket = require('socket.io');
const fs = require('fs');
const redis = require('socket.io-redis');
const Scrollio = require('../index');

const server = http.createServer((req, res) => res.end(fs.readFileSync('./public/index.html')));

const io = socket(server, { path: '/socket.io' });

io.adapter(redis({ host: 'localhost', port: 6379 }));
const sc = new Scrollio(server, io);

server.listen(3058, console.info('listen *:3058'));
