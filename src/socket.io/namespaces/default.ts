import * as SocketIO from 'socket.io';

export default (io: SocketIO.Server) =>
  io.sockets.on('connection', socket => {
    const { id, nsp } = socket;
    console.log(`[ID=${id}, NAMESPACE=${nsp.name}] connected.`);
    socket.on('message::fromClient', message => {
      console.log('/ -> ' + message);
      socket.broadcast.emit('message::fromServer', message);
    });

    socket.on('disconnect', reason => {
      console.log(
        `[ID=${id}, NAMESPACE=${nsp.name}] disconnected. (${reason})`,
      );
    });
  });
