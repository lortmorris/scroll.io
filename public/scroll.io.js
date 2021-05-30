"use strict";

!(function (version) {



    /* polyfill for window.requestAnimationFrame and window.cancelAnimationFrame */
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

    var scrollio = window.scrollio = function (socketio) {

        var self = this;
        var ticking = false;
        this.stop = false;
        this.lastPosition = 0;
        this.socketio = socketio;


        self.addEvent(window, 'load', function () {
            self.resize();
        });


        socketio.on('move', function (y) {
            self.move(y);
        });

        socketio.on('scroll.io.init', function (y) {
            self.move(y);
        });


        self.addEvent(window, 'resize', function (e) {
            self.resize();
        });


        this.addEvent(window, 'scroll', function (e) {

            window.requestAnimationFrame(function () {
                if (false === self.stop) {
                    self.Stop();

                    self.notify();
                }
            });
        });

    }


    scrollio.prototype.addEvent = function (object, type, callback) {
        if (object == null || typeof(object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    }

    scrollio.prototype.getHeight = function () {
        var B = document.body,
            H = document.documentElement,
            height;

        if (typeof document.height !== 'undefined') {
            height = document.height;
        } else {
            height = Math.max(B.scrollHeight,
                B.offsetHeight,
                H.clientHeight,
                H.scrollHeight,
                H.offsetHeight);
        }

        return height;
    }

    scrollio.prototype.notify = function () {
        this.socketio.emit('scroll.io.scroll', window.scrollY);
    }

    scrollio.prototype.resize = function () {
        var self = this;
        this.socketio.emit('scroll.io.resize', self.getHeight());
    }

    scrollio.prototype.Stop = function () {
        var self = this;
        self.stop = true;
        setTimeout(function () {
            self.stop = false;
        }, 50)

    }
    scrollio.prototype.move = function (to) {
        var self = this;

        if (self.lastPosition != to) {
            self.Stop();
            window.scrollTo(0, to);
        }

        self.lastPosition = to;

    }

    scrollio.prototype.version = version;


})("1.0.0");