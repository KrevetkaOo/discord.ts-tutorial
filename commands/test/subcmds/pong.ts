import { CommandParams } from '../../../typings/Command';

export default function ({ int }: CommandParams) {
  int.reply('ping');
}
