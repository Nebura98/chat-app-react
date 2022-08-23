const {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje
} = require('../controllers/sockets')
const { verificarJWT } = require('../helpers/jwt')


class Sockets {

  constructor(io) {

    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on('connection', async (socket) => {

      // TODO: Validar el JWT 
      // Si el token no es válido, desconectar

      const [valido, uid] = verificarJWT(socket.handshake.query['x-token'])

      if (!valido) {
        console.log('Socket no identificado');
        return socket.disconnect()
      }

      // TODO: Saber que usuario está activo mediante el UID

      await usuarioConectado(uid)

      // TODO: Emitir todos los usuarios conectados
      this.io.emit('lista-usuarios', await getUsuarios())

      // TODO: Socket join, uid

      socket.join(uid)

      // TODO: Escuchar cuando el cliente manda un mensaje
      // mensaje-personal

      socket.on('mensaje-personal', async (payload) => {
        const mensaje = await grabarMensaje(payload)
        this.io.to(payload.para).emit('mensaje-personal', mensaje)
        this.io.to(payload.de).emit('mensaje-personal', mensaje)
      })

      // TODO: Disconnect
      // Marcar en la BD que el usuario se desconecto
      // TODO: Emitir todos los usuarios conectados
      socket.on('disconnect', async () => {
        await usuarioDesconectado(uid)
        this.io.emit('lista-usuarios', await getUsuarios())

      })

    });
  }


}


module.exports = Sockets;