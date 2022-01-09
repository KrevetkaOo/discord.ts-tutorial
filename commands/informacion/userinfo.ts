import { MessageEmbed, MessageButton, MessageActionRow, GuildMember, Formatters, Message } from 'discord.js';
import { Command } from '../../struct/Command';

export default class UserInfo extends Command {
	constructor() {
		super({
			data: {
				name: 'userinfo',
				description: 'muestra la información de un usuario',
				type: 'CHAT_INPUT',
				options: [
					{
						name: 'target',
						description: 'menciona a un usuario',
						type: 'USER',
						required: false
					}
				]
			},

			async run({ client, int }) {
				await int.deferReply();

				const target = int.options.getUser('target') || int.user;
				const member = target.id == int.user.id ? int.member : (int.options.getMember('target') as GuildMember);

				const fetchUser = await client.users.fetch(target.id, { force: true });

				const insignias = {
					DISCORD_EMPLOYEE: '<:staff:916032486675480618>', // staff de discord
					PARTNERED_SERVER_OWNER: '<:partner:916037507160870932>', // propietario de servidor socio
					HYPESQUAD_EVENTS: '<:hypesquad:916034407528280086>', // eventos de hypesquad
					BUGHUNTER_LEVEL_1: '<:bughunter:916032486956482603>', // cazador de errores
					HOUSE_BRAVERY: '<:bravery:916033606898548858>', // bravery
					HOUSE_BRILLIANCE: '<:brilliance:916033607544500304>', //
					HOUSE_BALANCE: '<:balance:916033606898548857>', //
					EARLY_SUPPORTER: '<:earlysupporter:916035551767969823>', // partidario inicial
					TEAM_USER: '', //
					BUGHUNTER_LEVEL_2: '<:bughunter2:916032486713196566>', // cazador de errores dorado
					VERIFIED_BOT: '', // bot verificado
					EARLY_VERIFIED_BOT_DEVELOPER: '<:botdev:916034885095936031>', // desarrollador de bots verificado
					DISCORD_CERTIFIED_MODERATOR: '<:moderator:916032486847430706>', // moderador de discord certificado
					BOT_HTTP_INTERACTIONS: ''
				};

				const flags = target.flags.toArray().map(f => insignias[f]);

				if (
					fetchUser.avatar.startsWith('a_') ||
					fetchUser.banner ||
					fetchUser.flags.toArray().includes('DISCORD_EMPLOYEE') ||
					fetchUser.flags.toArray().includes('PARTNERED_SERVER_OWNER') ||
					(member && member.avatar)
				)
					flags.push('<:nitro:916036740110753812>');

				if (member && member.premiumSinceTimestamp) flags.push('<:booster:916037507014070303>');

				const userEmbed = new MessageEmbed({
					author: {
						name: target.tag,
						iconURL: target.displayAvatarURL({ dynamic: true })
					},
					title: 'Información global',
					color: fetchUser.hexAccentColor || 'BLURPLE',
					image: {
						url: fetchUser.bannerURL({ dynamic: true, size: 4096 })
					},
					description: [
						`Nombre: ${target.username}`,
						`Discriminador: #${target.discriminator}`,
						`Fecha de creación: ${Formatters.time(target.createdAt, 'R')}`,
						`Insignias: ${flags.join(' ')}`
					].join('\n')
				});

				const userbtn = new MessageButton({
					customId: 'userinfo-user',
					style: 'SECONDARY',
					label: 'Usuario'
				});

				const memberbtn = new MessageButton({
					customId: 'userinfo-member',
					style: 'SECONDARY',
					label: 'Miembro'
				});

				const row1 = new MessageActionRow({
					components: [userbtn.setDisabled(true), memberbtn.setDisabled(false)]
				});

				const msg = (await int.followUp({
					embeds: [userEmbed],
					components: [row1],
					fetchReply: true
				})) as Message<true>;

				if (!member) return;

				const memberEmbed = new MessageEmbed({
					author: {
						name: member.displayName,
						iconURL: member.displayAvatarURL({ dynamic: true })
					},
					image: {
						url: fetchUser.bannerURL({ dynamic: true, size: 4096 })
					},
					color: member.displayHexColor,
					description: [
						`Apodo: ${member.nickname || 'Ninguno'}`,
						`Fecha de entrada: ${Formatters.time(member.joinedAt, 'R')}`,
						`Roles: ${member.roles.cache.size}`,
						`Rol más alto: ${member.roles.highest}`,
						`Rol izado: ${member.roles.hoist || 'Ninguno'}`
					].join('\n')
				});

				const collector = msg.createMessageComponentCollector({ time: 60 * 1000, componentType: 'BUTTON' });

				collector.on('collect', btn => {
					if (btn.user.id != int.user.id)
						return int.reply({
							content: 'No puedes usar esto',
							ephemeral: true
						});

					btn.deferUpdate();

					const row2 = new MessageActionRow({
						components: [userbtn.setDisabled(false), memberbtn.setDisabled(true)]
					});

					switch (btn.customId) {
						case 'userinfo-user':
							msg
								.edit({
									embeds: [userEmbed],
									components: [row1]
								})
								.catch(() => null);
							break;

						default:
							msg
								.edit({
									embeds: [memberEmbed],
									components: [row2]
								})
								.catch(() => null);
							break;
					}
				});

				collector.on('end', () => {
					return void msg.edit({
						components: [
							new MessageActionRow({
								components: [
									new MessageButton({
										label: 'Desactivado',
										customId: 'userinfo-disabled',
										style: 'SECONDARY',
										disabled: true
									})
								]
							})
						]
					});
				});
			}
		});
	}
}
