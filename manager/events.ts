import { ExtendedClient } from '../struct/cliente';

export default (client: ExtendedClient) => {
  client.music
    .on('nodeConnect', () => console.log('conectado a lavalink'))
    .on('nodeDisconnect', () => console.log('desconectado de lavalink'))
    .on('nodeError', err => console.log(`error de lavalink: ${err}`));
};
