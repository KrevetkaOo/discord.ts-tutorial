import { TrackUtils } from '@drgatoxd/erelajs';
import { Command } from '../../struct/Command';

export default class ping extends Command {
  constructor() {
    super({
      data: {
        name: 'play',
        description: 'reproduce musica',
        options: [
          {
            name: 'query',
            description: 'realiza tu busqueda',
            type: 'STRING',
            required: true
          }
        ],
        type: 'CHAT_INPUT'
      },
      async run({ client, int }) {
        if (!int.member.voice.channel)
          return int.reply({
            content: 'conectate a un canal de voz',
            ephemeral: true
          });

        if (int.guild.me.voice.channel && int.guild.me.voice.channelId != int.member.voice.channelId)
          return int.reply({
            content: `conectate a mi canal de voz: ${int.guild.me.voice.channel}`,
            ephemeral: true
          });

        if (!int.member.voice.channel.permissionsFor(int.guild.me).has(['CONNECT', 'SPEAK']))
          return int.reply({
            content: 'no tengo permiso para conectarme y/o hablar en tu canal de voz',
            ephemeral: true
          });

        const node = client.music.nodes.get('main');

        if (!node || !node.connected) {
          node.connect();
          return int.reply({
            content: 'no estoy conectado a lavalink aun :(',
            ephemeral: true
          });
        }

        const player = client.music.create({
          guild: int.guildId,
          textChannel: int.channelId,
          selfDeafen: true,
          voiceChannel: int.member.voice.channelId
        });

        if (player.state != 'CONNECTED') player.connect();

        try {
          const query = int.options.getString('query');

          if (client.lavasfy.isValidURL(query)) {
            const spotifynode = client.lavasfy.nodes.get('main');
            const search = await spotifynode.load(query);

            switch (search.loadType) {
              case 'LOAD_FAILED':
              case 'NO_MATCHES': {
                int.reply({
                  content: 'No encontre esa cancion en youtube'
                });
                break;
              }

              case 'TRACK_LOADED': {
                const track = search.tracks[0];
                const builded = TrackUtils.build(track as any, int.user);

                player.queue.add(builded);

                if (!player.paused && !player.playing && !player.queue.size) await player.play();

                int.reply(`Se agregó ${track.info.title}, de ${track.info.author}`);
                break;
              }

              case 'PLAYLIST_LOADED': {
                const songs = [];

                for (const song of search.tracks) {
                  songs.push(TrackUtils.build(song as any, int.user));
                }

                player.queue.add(songs);

                if (!player.paused && !player.playing && player.queue.totalSize == search.tracks.length)
                  await player.play();

                int.reply(`Se agregaron ${search.tracks.length} canciones de ${search.playlistInfo.name}`);
                break;
              }
            }
          } else {
            const search = await player.search(query, int.user);

            switch (search.loadType) {
              case 'LOAD_FAILED':
              case 'NO_MATCHES': {
                int.reply({
                  content: 'no hay resultados para tu busqueda',
                  ephemeral: true
                });
                break;
              }

              case 'PLAYLIST_LOADED': {
                player.queue.add(search.tracks);

                if (!player.playing && !player.paused && player.queue.totalSize == search.tracks.length)
                  await player.play();

                int.reply(`Se agregaron ${search.tracks.length} canciones de ${search.playlist.name}`);
                break;
              }

              default: {
                player.queue.add(search.tracks[0]);

                if (!player.playing && !player.paused && !player.queue.size) await player.play();

                int.reply(`Se agregó ${search.tracks[0].title}, de ${search.tracks[0].author}`);
                break;
              }
            }
          }
        } catch (err) {
          console.log(err);
          int.reply({
            content: `Ha ocurrido un error: \`${err}\``,
            ephemeral: true
          });
        }
      }
    });
  }
}
