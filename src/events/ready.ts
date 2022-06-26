import type { ExtendedClient } from '../struct/Cliente';
import { Event } from '../struct/Event';

export default class Ready extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'ready');
  }

  run() {}
}
