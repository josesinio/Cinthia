import { Socket } from "dgram";
import { Request, Response, NextFunction } from "express";

  const { Server } = require('socket.io');
  const http = require('http');
  const express = require('express');

  const app = express();
  const server = http.createServer(app);
  const io =  new Server(server);
  const port = 3000;


  app.use((req: Request, res : Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  app.get('/', (req : Request, res: Response) => {
    res.send('Hola que tal!');
  
  });

  function MandarMensaje() {
    const mensajeInput = document.getElementById('message-input') as HTMLInputElement;
    const mensaje = mensajeInput.value.trim();

    if(mensaje)
    {
      server.emit('chat message',mensaje)

      mensajeInput.value = '';
    }
  }

  server.on('char massage', (mensaje : string)=> {
    const mensajeChat = document.getElementById('chat-messages');
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.textContent = mensaje;
    if (mensajeChat !== null) {
    mensajeChat.appendChild(nuevoMensaje);
    }
  })

  io.on('connection', (socket  = io('http://localhost:3000'))  => {

    console.log("El usuario se ha  conectado.");

    socket.on('mensaje', (data: string)=> {
      console.log("Mensaje del usuario:", data);
    });
    socket.on('disconnect', () => {
      console.log("El usuarios se desconecto.");
    });
  });

  server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });