import { Event } from '../../struct/Event';
import { ExtendedClient } from '../../struct/ExtendedClient';
import config from '../../config';

export default class Ready extends Event {
	constructor(client: ExtendedClient) {
		super(client, 'ready');
	}

	async run() {
		console.info(`Listo como: ${this.client.user.tag}`);

		const fix = {
			si: true,
			type: 'global' as 'global' | 'servidor'
		};

		if (fix.si) {
			const global = async () => {
				const fetched = await this.client.application.commands.fetch();
				fetched.forEach(cmd => {
					cmd.delete();
				});
			};

			const guild = async () => {
				const fetched = await this.client.guilds.cache.get(config.ajustes.servidor).commands.fetch();
				fetched.forEach(cmd => {
					cmd.delete();
				});
			};

			if (fix.type == 'global') global();
			else guild();
		}
	}
}
