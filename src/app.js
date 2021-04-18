const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const express = require('express')
const app = express()

const { addUser,generateTime, generateTimeDrawing, getUser } = require('./utils/details.js')

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))




const server = http.createServer(app)
const io = socketio(server)
io.on('connect', (socket)=>{
    console.log('new web socket connection')
    socket.on('join', ({ username, room }, callback) => {
        const { error, userdata } = addUser(username, room, socket.id)
        
        if(error) {
            return callback(error)
        }

        callback()

        socket.join(userdata.room)
        // io.to(userdata.room).emit('userData', getUser(socket.id))
        socket.on('sendMessagePersonal', ({ message, username }) => {
            socket.emit('sendToAll', generateTime(message, username))
        })

        socket.on('sendMessageBroadcast', ({message , username}) => {
            socket.broadcast.to(userdata.room).emit('sendToAll', generateTime(message, username))
        })

        socket.on('sendDrawing', ({ url, username }) => {
            io.to(userdata.room).emit('sendToAll-drawing', generateTimeDrawing(url, username))
        })
    
        socket.on('sendMessage', ({ message, username }) => {
            io.to(userdata.room).emit('sendToAll', generateTime(message, username))
        })
    
        socket.on('disconnect', () => {
            const user = getUser(socket.id)
            io.emit('sendToAll',generateTime(`${user[0].username} left the chat room!`, user[0].username) )
        })
    
    })

    
})





server.listen(port, () => {
    console.log(`server on port ${port}`)
})