import { Command } from '../../struct/Command';

export default class ping extends Command {
	constructor() {
		super({
			data: {
				name: 'ping',
				description: 'pong',
				options: [],
				type: 'CHAT_INPUT'
			},
			run({ client, int }) {
				int.reply('pong');
			}
		});
	}
}
