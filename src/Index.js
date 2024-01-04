"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { Server } = require('socket.io');
const http = require('http');
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});
app.get('/', (req, res) => {
    res.send('Hola que tal!');
});
function MandarMensaje() {
    const mensajeInput = document.getElementById('message-input');
    const mensaje = mensajeInput.value.trim();
    if (mensaje) {
        server.emit('chat message', mensaje);
        mensajeInput.value = '';
    }
}
server.on('char massage', (mensaje) => {
    const mensajeChat = document.getElementById('chat-messages');
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.textContent = mensaje;
    if (mensajeChat !== null) {
        mensajeChat.appendChild(nuevoMensaje);
    }
});
io.on('connection', (socket = io('http://localhost:3000')) => {
    console.log("El usuario se ha  conectado.");
    socket.on('mensaje', (data) => {
        console.log("Mensaje del usuario:", data);
    });
    socket.on('disconnect', () => {
        console.log("El usuarios se desconecto.");
    });
});
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
