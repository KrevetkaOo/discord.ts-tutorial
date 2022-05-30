import axios from 'axios';

export class Twitch {
  constructor(public clientId: string, public clientSecret: string) {}

  private authKey = '';

  public async getAuthKey() {
    const res = await axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials'
    });

    this.authKey = res.data.access_token;
  }

  public async getChannel(channel: string) {
    const res = await axios
      .get(`https://api.twitch.tv/helix/users?login=${channel}`, {
        headers: {
          Authorization: `Bearer ${this.authKey}`,
          'Client-Id': this.clientId
        }
      })
      .catch(() => null);

    return res.data?.data[0];
  }

  public async getStream(channel: string) {
    const res = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
      headers: {
        Authorization: `Bearer ${this.authKey}`,
        'Client-Id': this.clientId
      }
    });

    return res.data?.data[0];
  }

  public replacePlaceholders(
    text: string,
    stream: {
      channel: string;
      title: string;
      game: string;
      url: string;
      viewers: number;
    }
  ) {
    return text
      .replaceAll('{channel}', stream.channel)
      .replaceAll('{title}', stream.title)
      .replaceAll('{game}', stream.game)
      .replaceAll('{url}', '<' + stream.url + '>')
      .replaceAll('{viewers}', stream.viewers.toString());
  }
}
