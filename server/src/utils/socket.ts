import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export const initSocketServer = (server: HttpServer) => {
  const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:4173', 'http://localhost:4180', 'http://localhost:4181'].filter(Boolean) as string[];
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected', socket.id);

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('candidate:update', (payload) => {
      io.to(payload.room).emit('candidate:updated', payload);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
};
