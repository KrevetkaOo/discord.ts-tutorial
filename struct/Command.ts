import { ApplicationCommandOption, ApplicationCommandType, CommandInteraction, GuildMember } from 'discord.js';
import { ExtendedClient } from './ExtendedClient';

export class Command {
	constructor(opciones: {
		data: {
			name: string;
			description: string;
			options: ApplicationCommandOption[];
			type: ApplicationCommandType;
		};

		run: ({ client, int }: { client: ExtendedClient; int: CommandInteraction & { member: GuildMember } }) => any;
	}) {
		this.data = opciones.data;
		this.run = opciones.run;
	}

	data: {
		name: string;
		description: string;
		options: ApplicationCommandOption[];
		type: ApplicationCommandType;
	};

	run: ({ client, int }: { client: ExtendedClient; int: CommandInteraction & { member: GuildMember } }) => any;
}
