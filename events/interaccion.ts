import { ExtendedClient } from '../struct/cliente';
import { Event } from '../struct/Event';

export default class Int extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'interactionCreate');
  }

  run(int) {
    if (int.isCommand() || int.isContextMenu()) {
      const nombre = int.commandName;
      const comando = this.client.commands.get(nombre);

      comando.run({ client: this.client, int });
    }
  }
}
