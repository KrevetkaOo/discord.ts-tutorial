import Discord from 'discord.js';
import { ExtendedClient } from './cliente';

export class Command {
  constructor(opciones: {
    data: {
      name: string;
      description: string;
      type: Discord.ApplicationCommandType;
      options: Discord.ApplicationCommandOptionData[];
    };
    run: ({ client, int }: { client: ExtendedClient; int: Discord.CommandInteraction<'cached'> }) => any;
  }) {
    this.data = opciones.data;
    this.run = opciones.run;
  }

  data: {
    name: string;
    description: string;
    type: Discord.ApplicationCommandType;
    options: Discord.ApplicationCommandOptionData[];
  };
  run: ({ client, int }: { client: ExtendedClient; int: Discord.CommandInteraction<'cached'> }) => any;
}
