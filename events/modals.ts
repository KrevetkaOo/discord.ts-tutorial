import { ModalSubmitInteraction } from 'discord.js';
import { ExtendedClient } from '../struct/cliente';
import { Event } from '../struct/Event';

export default class Int extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'interactionCreate');
  }

  async run(int: ModalSubmitInteraction<'cached'>) {
    if (!int.isModalSubmit()) return;

    const datos = {
      nombre: int.fields.getTextInputValue('input-name'),
      descripcion: int.fields.getTextInputValue('input-description')
    };

    int.reply({
      embeds: [
        {
          fields: [
            {
              name: 'Nombre',
              value: datos.nombre
            },
            {
              name: 'Descripcion',
              value: datos.descripcion
            }
          ]
        }
      ]
    });
  }
}
