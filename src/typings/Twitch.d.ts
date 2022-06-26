export interface TwitchChannel {
  id: `${number}`;
  login: string;
  display_name: string;
  type: 'staff' | 'admin' | 'global_mod' | '';
  broadcaster_type: 'partner' | 'affiliate' | '';
  description: string;
  profile_image_url: `https://static-cdn.jtvnw.net/jtv_user_pictures/${string}.png`;
  offline_image_url: `https://static-cdn.jtvnw.net/jtv_user_pictures/${string}.png`;
  view_count: number;
  created_at: string;
}

export interface TwitchStream {
  id: `${number}`;
  user_id: `${number}`;
  user_login: string;
  user_name: string;
  game_id: `${number}`;
  game_name: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${string}-{width}x{height}.jpg`;
  tag_ids: string[];
  is_mature: boolean;
}
