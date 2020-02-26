import mongoose from 'mongoose';
import {Server} from 'http';
import Socket from 'socket.io';


export class SocketIOService {

    userSockets = {};
    io;

    constructor(server: Server) {
        this.io = Socket.listen(server);
    }

    public createSocketEvents() {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
              let userId = this.userSockets[socket.id]
              delete this.userSockets[socket.id]
        
              if (userId) {
                this.io.sockets.emit('user-offline', userId)
              }
            })
        
            socket.on('online-ping', (userId) => {
              if (userId) {
                this.userSockets[socket.id] = userId
                socket.broadcast.emit('user-online', userId)
        
                setTimeout(function () {
                  // Send currently online users
                  socket.emit('online-users', Object.values(this.userSockets))
                }, 1000)
              }
            })
        
            socket.on('enter-conversation', (conversation) => {
              socket.join(conversation)
            })
        
            socket.on('leave-conversation', (conversation) => {
              socket.leave(conversation)
            })
        
            socket.on('send-message', function (message) {
              socket.broadcast.to(message.conversationId).emit('new-message', message)
            })
          })
        }
}
