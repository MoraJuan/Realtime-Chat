import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
})

// Almacenar usuarios conectados
const connectedUsers = new Map()

io.on("connection", (socket) => {
    console.log("User connected", socket.id)

    // Usuario se conecta
    socket.on("userConnected", (userData) => {
        connectedUsers.set(socket.id, userData)
        socket.userData = userData
        
        // Unir al usuario a su sala personal para recibir eventos directos
        if (userData?.userId) {
            socket.join(userData.userId)
        }
        
        // Notificar a todos los usuarios sobre la lista actualizada
        const onlineUsers = Array.from(connectedUsers.values()).map(user => user.userId)
        io.emit("usersOnline", onlineUsers)
        
        console.log(`User ${userData.username} connected`)
    })

    // Unirse a una sala de conversación
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId)
        console.log(`User ${socket.userData?.username} joined room ${roomId}`)
    })

    // Salir de una sala de conversación
    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId)
        console.log(`User ${socket.userData?.username} left room ${roomId}`)
    })

    // Enviar mensaje
    socket.on("sendMessage", (data) => {
        const { message, receiverId, senderId } = data
        
        console.log('Mensaje recibido en socket:', data)
        
        // Crear ID de sala para la conversación (si ambos están en la misma vista)
        const roomId = [senderId, receiverId].sort().join('-')
        
        // 1) Emitir a la sala de conversación (ambos si están unidos a la sala)
        io.to(roomId).emit("newMessage", data)
        
        // 2) Emitir directamente a la sala personal del receptor
        if (receiverId) {
            io.to(receiverId).emit("newMessage", data)
        }
        
        // 3) Confirmación opcional al remitente por su sala personal
        if (senderId) {
            io.to(senderId).emit("messageSent", message)
        }
        
        console.log(`Message broadcasted to room ${roomId} and user ${receiverId}`)
    })

    // Indicador de escritura
    socket.on("typing", (data) => {
        const { receiverId, isTyping } = data
        
        console.log('Typing event received:', data, 'from user:', socket.userData?.userId)
        
        // Crear ID de sala para la conversación
        const roomId = [socket.userData?.userId, receiverId].sort().join('-')
        
        if (isTyping) {
            socket.to(roomId).emit("userTyping", {
                userId: socket.userData?.userId,
                isTyping: true
            })
            console.log(`User ${socket.userData?.userId} is typing in room ${roomId}`)
        } else {
            socket.to(roomId).emit("userStoppedTyping", socket.userData?.userId)
            console.log(`User ${socket.userData?.userId} stopped typing in room ${roomId}`)
        }
    })

    // Usuario se desconecta
    socket.on("disconnect", () => {
        if (socket.userData) {
            connectedUsers.delete(socket.id)
            
            // Notificar a todos los usuarios sobre la lista actualizada
            const onlineUsers = Array.from(connectedUsers.values()).map(user => user.userId)
            io.emit("usersOnline", onlineUsers)
            
            console.log(`User ${socket.userData.username} disconnected`)
        }
    })
})

export { app, server, io }