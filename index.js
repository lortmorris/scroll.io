const SocketIO = require('socket.io');
const fs = require('fs');
const debug = require('debug')('scrollio');

class Scrollio {
  constructor(http, socketio) {
    const self = this;
    this.http = http;
    this.version = '1.0.0';
    this.sockets = {};
    this.currentPosition = 0;

    this.jsFile = fs.readFileSync('./public/scroll.io.js').toString();

    debug('crating instance of scroll.io');

    if (typeof socketio === 'undefined') {
      this.socketio = SocketIO(http, { path: '/socket.io' });
    } else this.socketio = socketio;

    this.injectJS();
    this.socketio.on('connection', (socket) => self.ioConnect(socket));
  }

  ioConnect(socket) {
    const self = this;
    self.sockets[socket.id] = socket;
    self.sockets[socket.id].created = new Date().getTime();
    self.sockets[socket.id].totalH = 0;

    self.notify('scroll.io.init', [socket.id], self.currentPosition);

    socket.on('disconnect', () => {
      if (typeof self.sockets[socket.id] !== 'undefined') delete self.sockets[socket.io];
      debug(`disconnect: ${socket.id}`);
    });

    socket.on('scroll.io.resize', (h) => {
      debug(`resizing: ${socket.id} ${h}`);
      self.sockets[socket.id].totalH = h;
    });

    socket.on('scroll.io.scroll', (y) => {
      this.currentPosition = y;
      const to = Object.keys(self.sockets);
      const currentH = self.sockets[socket.id].totalH;

      to.splice(socket.id, 1);

      to.forEach((s) => {
        const f = Math.floor((y * self.sockets[s].totalH) / currentH);
        self.notify('move', [s], f);
      });
    });
  }

  notify(event, to, msg) {
    const self = this;
    to.forEach((k) => self.sockets[k].emit(event, msg));
  }

  getJSFile() {
    return this.jsFile;
  }

  injectJS() {
    debug('attaching bind to scroll.io required');
    const url = '/scroll.io/scroll.io.js';
    const events = this.http.listeners('request').slice(0);

    this.http.removeAllListeners('request');
    this.http.on('request', (req, res) => {
      if (req.url === url) {
        debug('serve client source');
        res.setHeader('Content-Type', 'application/javascript');
        res.writeHead(200);
        res.end(this.getJSFile());
      } else {
        for (let i = 0; i < events.length; i += 1) {
          events[i].call(this.http, req, res);
        } // end for
      } // end else
    });
  }
}

module.exports = Scrollio;
