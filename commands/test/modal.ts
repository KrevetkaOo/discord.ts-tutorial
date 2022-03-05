import { Command } from '../../struct/Command';
import { Modal, MessageActionRow, TextInputComponent } from 'discord.js';

export default class ping extends Command {
  constructor() {
    super({
      data: {
        name: 'modal',
        description: 'muestra un discord modal',
        options: [],
        type: 'CHAT_INPUT'
      },
      async run({ client, int }) {
        const modal = new Modal()
          .setTitle('Modals de Discordia')
          .setCustomId('modal-xd')
          .setComponents(
            new MessageActionRow<TextInputComponent>().setComponents(
              new TextInputComponent()
                .setCustomId('input-name')
                .setLabel('Tu nombre')
                .setPlaceholder('Carlos')
                .setRequired(true)
                .setStyle('SHORT')
            ),
            new MessageActionRow<TextInputComponent>().setComponents(
              new TextInputComponent()
                .setCustomId('input-description')
                .setLabel('Describete')
                .setPlaceholder('soy un ser humano xd')
                .setRequired(true)
                .setStyle('PARAGRAPH')
            )
          );

        int.showModal(modal);
      }
    });
  }
}
