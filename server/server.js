require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

const io = require('socket.io')(server,{
    cors:{
        origin: process.env.CLIENT_URL,
        methods: [ "GET", "POST" ]
    }
})


io.on('connection',(socket)=>{
    socket.emit('me',socket.id)

    socket.on('disconnect',()=>{
        socket.broadcast.emit('callEnded')
    })

    socket.on('callUser',data=>{
        io.to(data.userToCall).emit('callUser',{signal:data.signalData,from:data.from,name:data.name})
    })

    socket.on('answerCall',data=>{
        io.to(data.to).emit('callAccepted',{signal:data.signal,receiverName:data.receiverName})
    })

    socket.on('endCall',(callerId)=>{
        console.log(callerId);
        // io.to(callerId).emit('callEnded')
        socket.broadcast.emit('callEnded')
    })
})

server.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})