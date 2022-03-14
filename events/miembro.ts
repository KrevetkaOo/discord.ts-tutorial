import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { ExtendedClient } from '../struct/cliente';
import { Event } from '../struct/Event';
import Servidores from '../models/Servidores';
import { genMessage } from '../util/genMessage';
import { Welcomer } from 'image-djs';
import validator from 'image-url-validator';
import { loadImage } from 'canvas';

const imgValidator = validator as any;

export default class Ready extends Event {
  constructor(client: ExtendedClient) {
    super(client, 'guildMemberAdd');
  }

  async run(member: GuildMember) {
    const data = await Servidores.findById(member.guild.id);
    if (!data || !data.welcomer.channel) return;

    const channel = member.guild.channels.cache.get(data.welcomer.channel) as TextChannel;

    if (!channel || !channel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']))
      return;

    let payload = {
      content: null,
      files: [],
      embeds: []
    };

    const message = genMessage(data.welcomer.message, member);

    if (data.welcomer.embed.enabled) {
      payload.embeds.push(
        new MessageEmbed({
          color: data.welcomer.embed.color,
          description: message,
          thumbnail: {
            url: data.welcomer.embed.thumbnail ? member.displayAvatarURL({ dynamic: true }) : null
          },
          image: {
            url: `attachment://welcome-${member.user.id}.png`
          },
          author: {
            name: `👋 Bienvenido ${member.user.tag}`
          },
          timestamp: Date.now()
        })
      );
    } else payload.content = message;

    if (data.welcomer.image.enabled) {
      let bg = data.welcomer.image.bg;
      const validate = await imgValidator.default(bg);
      const canvasValidate = await loadImage(bg).catch(() => null);

      if (!validate || !canvasValidate)
        bg = 'https://carlosvassan.com/wp-content/uploads/2021/08/Wallpaper-evangelion-v.5-1024x576.jpg';

      const file = await new Welcomer()
        .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
        .setBackground(bg)
        .setSubtitle('✨ Bienvenido al servidor 🌌')
        .setUsername(member.user.username)
        .build(true, `welcome-${member.user.id}.png`);

      payload.files.push(file);
    }

    channel.send(payload);
  }
}
