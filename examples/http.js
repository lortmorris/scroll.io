/**
 * Scroll.io example. Run a simple http server
 * @author César Casas - https://ar.linkedin.com/in/cesarcasas
 */

const scrollio = require("../index");
const http = require("http");
const fs = require("fs");

//Create http server instance
const server  = http.createServer((req, res)=>{
    res.end(fs.readFileSync("./public/index.html"));
});

//new scroll instance
new scrollio(server);

//listen on port 3000
server.listen(3058, console.info('listen on *:3058'));
