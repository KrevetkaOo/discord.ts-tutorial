import { model, Schema } from 'mongoose';

export const Twitch = model<TwitchInterface>(
  'Twitch',
  new Schema({
    _id: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    streamers: [{ type: String }],
    channel: { type: String },
    template: {
      type: String,
      default: '{channel} está en {game} con {viewers} vistas! {url}'
    },
    streamersData: [{ user: String, streamId: String }]
  })
);

interface TwitchInterface {
  _id: string;
  enabled: boolean;
  streamers: string[];
  channel: string;
  template: string;
  streamersData: { user: string; streamId: string }[];
}
