import { ClientOptions } from 'discord.js';

export default {
	client: {
		intents: [
			'GUILDS',
			'GUILD_BANS',
			'GUILD_EMOJIS_AND_STICKERS',
			'GUILD_INTEGRATIONS',
			'GUILD_INVITES',
			'GUILD_MEMBERS', // privilegiado
			'GUILD_MESSAGES', // privilegiado
			'GUILD_MESSAGE_REACTIONS',
			'GUILD_VOICE_STATES',
			'GUILD_WEBHOOKS'
			// 'GUILD_PRESENCES', // privilegiado
			// 'DIRECT_MESSAGES',
			// 'DIRECT_MESSAGE_REACTIONS',
			// 'DIRECT_MESSAGE_TYPING'
		],
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
