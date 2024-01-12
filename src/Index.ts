import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import path from 'path';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const ioserver = new Server(server);
const port = 3000;

// Agrega cors como middleware
app.use(cors());

// Configura express.static para servir archivos estáticos desde 'dist' y 'public'
app.use(express.static(path.join( 'dist')));
app.use(express.static(path.join( 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hola que tal!');
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

ioserver.on('connection', (socket) => {
  console.log("El usuario se ha conectado.");

  socket.on('mensaje', (data: string) => {
    console.log("Mensaje del usuario:", data);
  });

  socket.on('disconnect', () => {
    console.log("El usuario se desconectó.");
  });
});


server.on('chat message', (mensaje: string) => {
  // En este ejemplo, asumimos que el usuario es anónimo. Puedes ajustar esto según tu autenticación.
  const usuario = 'Anónimo';
  server.emit('chat message', usuario, mensaje);
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
})