# scroll.io

This module allows to share the same document and events scroll between all connected users.
Scroll.io use "debug" module with "scroll" namespace

## Updates
[2016/07/18] now support for ratio screen!. New examples. Fixes Doc.

## install 

```bash
$ npm install scroll.io
```

## Run examples
### Simple http server
```bash
$ cd node_modules/scrollio
$ node examples/http.js
```
open you browser and goto http://localhost:3000 

### Using own socket.io instance and redis (for balance).



## Balance
If you want use AWS Balance, this is should be able using nginx: http://socket.io/docs/using-multiple-nodes/

## example

```javascript
const scrollio = require("scrollio");
const http = require("http");
const socket = require('socket.io');
const fs = require("fs");

const server  = http.createServer((req, res)=>{
    res.end(fs.readFileSync("./public/index.html"));
});

new scrollio(server);
server.listen(3000);

```



