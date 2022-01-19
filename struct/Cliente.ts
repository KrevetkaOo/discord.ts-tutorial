import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import config from '../config';

export class ExtendedClient extends Client {
  constructor() {
    super({
      intents: 3839,
      allowedMentions: { repliedUser: false },
      failIfNotExists: false,
      presence: {
        status: 'idle'
      }
    });
  }

  commands: Collection<string, any> = new Collection();

  init() {
    this.login();
    this.loadcomandos();
    this.loadeventos();
  }

  loadcomandos() {
    const cmds = [];

    readdirSync('./commands/').forEach(dir => {
      readdirSync(`./commands/${dir}`)
        .filter(f => f.endsWith('.ts'))
        .forEach(async file => {
          const cmd = await import(`../commands/${dir}/${file}`);
          const comando = new cmd.default();

          cmds.push(comando.data);
          this.commands.set(comando.data.name, comando);
        });
    });

    this.on('ready', () => {
      if (config.comandos.testing) this.guilds.cache.get(config.comandos.servidor).commands?.set(cmds);
      else this.application.commands.set(cmds);
    });
  }

  loadeventos() {
    readdirSync('./events/')
      .filter(f => f.endsWith('.ts'))
      .forEach(async file => {
        const clase = await import(`../events/${file}`);
        const evento = new clase.default(this);

        if (evento.once) this.once(evento.name, (...args) => evento.run(...args));
        else this.on(evento.name, (...args) => evento.run(...args));
      });
  }
}
