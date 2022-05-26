import { Command } from '../../struct/Command';

export default class ping extends Command {
  constructor() {
    super({
      data: {
        name: 'economy',
        description: 'economia uwu',
        options: [
          {
            name: 'work',
            description: 'trabaja cada 5 minutos',
            type: 'SUB_COMMAND'
          },
          {
            name: 'balance',
            description: 'muestra tu dinero',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'user',
                description: 'muestra el dinero de un usuario',
                type: 'USER'
              }
            ]
          },
          {
            name: 'crime',
            description: 'comete un crimen',
            type: 'SUB_COMMAND'
          }
        ],
        type: 'CHAT_INPUT'
      },
      async run({ client, int }) {
        const subcommand = int.options.getSubcommand(false);
        if (subcommand) {
          const cmd = require(`./subcmds/${subcommand}`).default;
          await cmd({ client, int });
        }
      }
    });
  }
}
