import { GuildMember, Interaction } from 'discord.js';
import { Event } from '../../struct/Event';
import { ExtendedClient } from '../../struct/ExtendedClient';

export default class CommandInteraction extends Event {
	constructor(client: ExtendedClient) {
		super(client, 'interactionCreate');
	}

	async run(int: Interaction & { member: GuildMember }) {
		if (!int.isCommand() && !int.isContextMenu()) return;

		const nombre = int.commandName;
		const command = this.client.commands.get(nombre) as any;

		if (!command)
			return int.reply({
				content: 'El comando no existe :o',
				ephemeral: true
			});

		command.run({ client: this.client, int });
	}
}
