const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://multiplayer-rps.netlify.app",
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    socket.on("join_room", data => {
        if (io.sockets.adapter.rooms.get(data.id + "/#/" + data.room) && io.sockets.adapter.rooms.get(data.id + "/#/" + data.room).size >= 2) {
            socket.emit("room_full", "The room you want to enter is full")
            return
        }
        socket.join(data.id + "/#/" + data.room)
        socket.username = data.username
        setTimeout(() => {
            io.to(data.id + "/#/" + data.room).emit("room_details", {
                ...data,
                users: io.sockets.adapter.rooms.get(data.id + "/#/" + data.room).size
            })
        }, 500)
    })

    socket.on("request_opponent_details", data => {
        let opponent = { username: "" }

        io.in(data).fetchSockets()
            .then(sockets => {
                sockets.forEach(client => {
                    if (client.id != socket.id) {
                        opponent.username = client.username
                    }
                });
                socket.emit("receive_opponents_details", opponent)
            })
    })

    socket.on("get_rooms", async () => {
        let arr = []

        const sockets = await io.fetchSockets();
        sockets.forEach(s => {
            const rooms = Array.from(s.rooms).filter(room => room.includes("/#/"))
            rooms.forEach(room => {
                if (!arr.includes(room) && io.sockets.adapter.rooms.get(room).size < 2) {
                    arr.push(room)
                }
            })
        })

        socket.emit("receive_rooms", arr)
    })

    socket.on("make_choice", data => {
        socket.to(data.room).emit("opponent_choice", data.choice)
    })

    socket.on("game_finished", data => {
        socket.leave(data)
    })

    socket.on("disconnecting", () => {
        const rooms = Array.from(socket.rooms).filter(room => room.includes("/#/"))
        rooms.forEach(room => {
            socket.to(room).emit("opponent_left")
        })
    })
})

server.listen(3001, () => {
    console.log("Server is running")
})