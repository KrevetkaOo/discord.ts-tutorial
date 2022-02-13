import { ExtendedClient } from '../struct/cliente';
import { Event } from '../struct/Event';

export default class Ready extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'ready');
  }

  run() {
    console.log('bot listo');
    this.client.music.init(this.client.user.id);
  }
}
