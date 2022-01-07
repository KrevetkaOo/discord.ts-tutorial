import { Command } from '../../struct/Command';

export default class Ping extends Command {
	constructor() {
		super({
			data: {
				name: 'ping',
				description: 'pong',
				options: [],
				type: 'CHAT_INPUT'
			},

			async run({ client, int }) {
				int.reply(`${client.ws.ping} ms`);
			}
		});
	}
}
