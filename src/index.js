const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words')
const siofu = require("socketio-file-upload");


const app = express().use(siofu.router)
const server = http.createServer(app);
const io = socketio(server)


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log(`New WebSocket Connection`)

    
    

    socket.on('join', ( {username, room} ) => {
        socket.join(room)
        
    socket.emit('message', 'welcome')
    socket.broadcast.to(room).emit('message', `${username} has joined!`)
        
    })

    socket.on('sendMessage', (message, callback) => {
         
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
        callback()
    })
   
    socket.on('sendLocation', (location, callback) => {
        socket.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'user has left')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})