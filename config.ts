import { ClientOptions } from 'discord.js';

export default {
	client: {
		intents: [],
		allowedMentions: { repliedUser: false },
		failIfNotExists: false,
		presence: {
			status: 'idle',
			activities: [
				{
					name: '/help',
					type: 'PLAYING'
				}
			]
		}
	} as ClientOptions,

	ajustes: {
		servidor: '912152924422037574',
		estado: 'servidor' as 'publico' | 'servidor'
	}
};
