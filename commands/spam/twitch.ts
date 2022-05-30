import { Command } from '../../struct/Command';
import { Twitch } from '../../models/Twitch';

export default class ping extends Command {
  constructor() {
    super({
      data: {
        name: 'twitch',
        description: 'spam de twitch uwu',
        options: [
          {
            name: 'add_streamer',
            description: 'agrega un streamer a la lista de streamers',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'username',
                description: 'nombre de usuario de twitch',
                type: 'STRING',
                required: true
              }
            ]
          },
          {
            name: 'remove_streamer',
            description: 'quita un streamer de la lista de streamers',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'username',
                description: 'nombre de usuario de twitch',
                type: 'STRING',
                required: true
              }
            ]
          },
          {
            name: 'channel',
            description: 'selecciona el canal de notificaciones',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'target',
                description: 'selecciona el canal',
                type: 'CHANNEL',
                required: true,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS']
              }
            ]
          },
          {
            name: 'toggle',
            description: 'activa o desactiva el spam',
            type: 'SUB_COMMAND'
          },
          {
            name: 'message',
            description: 'cambia el mensaje de notificacion',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'template',
                description: 'template de notificacion',
                type: 'STRING',
                required: true
              }
            ]
          }
        ],
        type: 'CHAT_INPUT'
      },
      async run({ client, int }) {
        const subcommand = int.options.getSubcommand(true);

        if (!int.memberPermissions.has('MANAGE_GUILD'))
          return int.reply({
            content: 'no tienes permiso',
            ephemeral: true
          });

        const data = (await Twitch.findById(int.guildId)) ?? new Twitch({ _id: int.guildId });

        const functions = {
          async add_streamer() {
            const username = int.options.getString('username');

            if (data.streamers.some(streamer => streamer === username))
              return int.reply({
                content: 'ese streamer ya esta en la lista',
                ephemeral: true
              });

            const streamer = await client.twitch.getChannel(username).catch(() => null);

            if (!streamer)
              return int.reply({
                content: 'ese streamer no existe',
                ephemeral: true
              });

            data.streamers.push(username);
            await data.save();

            return int.reply({
              content: `streamer agregado: ${streamer.display_name}`,
              ephemeral: true
            });
          },
          async remove_streamer() {
            const username = int.options.getString('username');

            if (!data.streamers.some(streamer => streamer === username))
              return int.reply({
                content: 'ese streamer no esta en la lista',
                ephemeral: true
              });

            data.streamers = data.streamers.filter(streamer => streamer !== username);
            await data.save();

            return int.reply({
              content: `streamer removido: ${username}`,
              ephemeral: true
            });
          },
          async channel() {
            const target = int.options.getChannel('target');

            if (!target.permissionsFor(client.user.id).has(['SEND_MESSAGES', 'EMBED_LINKS']))
              return int.reply({
                content: 'no tengo permiso para enviar mensajes en ese canal :c',
                ephemeral: true
              });

            data.channel = target.id;
            await data.save();

            return int.reply({
              content: `canal seleccionado: ${target.name}`,
              ephemeral: true
            });
          },
          async toggle() {
            data.enabled = !data.enabled;
            await data.save();

            return int.reply({
              content: `spam ${data.enabled ? 'activado' : 'desactivado'}`,
              ephemeral: true
            });
          },
          async message() {
            const template = int.options.getString('template');

            if (template.length > 1000)
              return int.reply({
                content: 'el mensaje es demasiado largo',
                ephemeral: true
              });

            data.template = template;
            await data.save();

            return int.reply({
              content: `mensaje cambiado: ${template}`,
              ephemeral: true,
              embeds: [
                {
                  description: client.twitch.replacePlaceholders(template, {
                    channel: 'drgato785',
                    game: 'Just Chatting',
                    viewers: 20487,
                    title: 'jugando juegos friv',
                    url: 'https://www.twitch.tv/drgato785'
                  }),
                  title: 'Vista previa'
                }
              ]
            });
          }
        };

        await functions[subcommand]();
      }
    });
  }
}
