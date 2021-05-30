/**
 * Scroll.io example. Run a simple http server
 * @author César Casas - https://ar.linkedin.com/in/cesarcasas
 */

const scrollio = require("../index");
const http = require("http");
const socket = require('socket.io');
const fs = require("fs");
const redis = require("socket.io-redis");


const server  = http.createServer((req, res)=>{
    res.end(fs.readFileSync("./public/index.html"));
});


const io = socket.listen(server, {path: '/socket.io'});

io.adapter(redis({ host: 'localhost', port: 6379 }));

new scrollio(server, io);
server.listen(3058, console.info('listen *:3058'));

