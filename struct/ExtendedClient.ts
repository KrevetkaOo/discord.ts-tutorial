import { Client, Collection } from 'discord.js';
import config from '../config';
import { readdirSync } from 'fs';

export class ExtendedClient extends Client {
	constructor(settings = config) {
		super(settings.client);
	}

	commands = new Collection();

	init() {
		this.loadCommands();
		this.loadEvents();
		this.login();
	}

	loadCommands() {
		const comandos = [];

		readdirSync('./commands/').forEach(dir => {
			readdirSync(`./commands/${dir}/`)
				.filter(f => f.endsWith('.ts'))
				.forEach(async file => {
					const comando = await import(`../commands/${dir}/${file}`);
					const cmd = new comando.default();

					if (cmd.data.type == 'MESSAGE' || cmd.data.type == 'USER') {
						delete cmd.data.description;
						delete cmd.data.options;
					}

					this.commands.set(cmd.data.name, cmd);
					comandos.push(cmd.data);
				});
		});

		this.on('ready', () => {
			const guild = () => {
				this.guilds.cache.get(config.ajustes.servidor).commands.set(comandos);
			};
			const global = () => {
				this.application.commands.set(comandos);
			};

			if (config.ajustes.estado == 'servidor') guild();
			else global();
		});
	}

	loadEvents() {
		readdirSync('./events/').forEach(dir => {
			readdirSync(`./events/${dir}/`)
				.filter(f => f.endsWith('.ts'))
				.forEach(async file => {
					const evento = await import(`../events/${dir}/${file}`);
					const evn = new evento.default(this);

					if (evn.once) this.once(evn.name, (...args) => evn.run(...args));
					else this.on(evn.name, (...args) => evn.run(...args));
				});
		});
	}
}
