const express = require("express");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const server = app.listen(3000, () => {
    console.log('Serving on port', 3000);
});

app.use(express.static(__dirname + "/public"));

const io = socketio(server);

let roomsarr = ["room1", "room2", "room3"];
let roomsobj = {
    "room1": {
        countdown: 10,
        start: 0,
        list: [],
        flag: 1
    },
    "room2": {
        countdown: 10,
        start: 0,
        list: [],
        flag: 1
    },
    "room3": {
        countdown: 10,
        start: 0,
        list: [],
        flag: 1
    }
}

io.on("connection", function (socket) {
    roomsarr.forEach(k => {
        const roomss = io.sockets.adapter.rooms.get(k);
        // console.log(roomss);
        let ids;
        if (roomss) ids = Array.from(roomss);
        if (!ids) roomsobj[k].countdown = 10, roomsobj[k].start = 0, roomsobj[k].flag = 1;
    })
    const room = Object.keys(roomsobj).find(k => {
        if (roomsobj[k].countdown > 0) return true;
        return false;
    })
    let clientsCount = io.engine.clientsCount;
    socket.join(room);
    // console.log("connection established")
    // let people = (io.sockets.connected);
    // console.log(people);
    // console.log(socket.id);
    // console.log(typeof ids)
    // console.log(socket.rooms);
    socket.on("disconnecting", function () {
        const rm = Array.from(socket.rooms)[1]; // user doesn't automatically detatch itself from room
        // console.log("leaving room server side");
        socket.leave(rm);
        roomsobj[rm].list = [];
        io.to(rm).emit("delete", { id: socket.id });
    })
    const roomss = io.sockets.adapter.rooms.get(room);
    let ids;
    if (roomss) ids = Array.from(roomss);
    // console.log(roomss);
    if (ids && ids.length === 1) {
        roomsobj[room].start = Date.now();
    }
    socket.on("update", function (data) {
        const rm = Array.from(socket.rooms)[1];
        let elapsed = parseInt((Date.now() - roomsobj[rm].start) / 1000);
        elapsed = Math.min(elapsed, 10);
        roomsobj[rm].countdown = 10 - elapsed;
        if (roomsobj[rm].flag && roomsobj[rm].countdown == 0) roomsobj[rm].flag = 0, io.to(rm).emit("start");
        io.to(rm).emit("update", {counts:clientsCount, user: socket.handshake.query.user, val: data.value, id: socket.id, countdown: roomsobj[rm].countdown, timer: data.timer, correctWords: data.correctWords });
    })

    socket.on("over", data => {
        const rm = Array.from(socket.rooms)[1];
        roomsobj[rm].list.push({ user: socket.handshake.query.user, ...data });
        // console.log("game over server");
        io.to(rm).emit("result", roomsobj[rm].list);
    })
})
