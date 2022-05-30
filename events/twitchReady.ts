import { ExtendedClient } from '../struct/cliente';
import { Event } from '../struct/Event';
import { Twitch } from '../models/Twitch';

export default class Ready extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'ready');
  }

  async run() {
    setInterval(async () => {
      const twitch = await Twitch.find();

      twitch.forEach(async data => {
        const guild = this.client.guilds.cache.get(data._id);
        if (!guild || !data.enabled || !data.streamers?.length || !data.channel) return;

        const channel = guild.channels.cache.get(data.channel);
        if (!channel || !channel.isText()) return;

        data.streamers.forEach(async username => {
          const currentStream = await this.client.twitch.getStream(username).catch(() => null);
          if (!currentStream) return;

          if (data.streamersData.find(streamer => streamer.user == username)?.streamId == currentStream.id) return;

          const streamer = await this.client.twitch.getChannel(username).catch(() => null);
          if (!streamer) return;

          data.streamersData = data.streamersData.filter(streamer => streamer.user != username);
          data.streamersData.push({
            user: username,
            streamId: currentStream.id
          });

          await data.save();

          await channel.send({
            embeds: [
              {
                author: {
                  name: streamer.display_name + ' está en vivo',
                  url: 'https://twitch.tv/' + streamer.login,
                  icon_url: streamer.profile_image_url
                },
                title: currentStream.title,
                url: 'https://twitch.tv/' + streamer.login,
                fields: [
                  {
                    name: 'Juego',
                    value: currentStream.game_name
                  },
                  {
                    name: 'Espectadores',
                    value: currentStream.viewer_count.toLocaleString('en-US')
                  }
                ],
                image: {
                  url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${username}-1920x1080.jpg`
                },
                thumbnail: {
                  url: `https://static-cdn.jtvnw.net/ttv-boxart/${currentStream.game_id}-285x380.jpg`
                },
                color: 0x6441a5,
                timestamp: new Date(currentStream.started_at)
              }
            ],
            allowedMentions: {
              parse: ['users', 'roles', 'everyone']
            },
            content: this.client.twitch.replacePlaceholders(data.template, {
              channel: streamer.display_name,
              game: currentStream.game_name,
              viewers: currentStream.viewer_count,
              title: currentStream.title,
              url: 'https://twitch.tv/' + streamer.login
            })
          });
        });
      });
    }, 30 * 1000);
  }
}
