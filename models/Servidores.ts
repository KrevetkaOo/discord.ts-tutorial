import { model, Schema } from 'mongoose';

export default model(
  'servidores',
  new Schema<servidores>({
    _id: String,

    canales: {
      sugerencias: { type: String, default: null }
    },

    welcomer: {
      channel: { type: String, default: null },
      message: { type: String, default: 'Bienvenido {{user}} a {{server.name}}' },
      embed: {
        enabled: { type: Boolean, default: false },
        color: { type: String, default: '#eb4034' },
        thumbnail: { type: Boolean, default: false }
      },
      image: {
        enabled: { type: Boolean, default: false },
        bg: { type: String, default: 'https://static.canalapps.com/uploads/2020/08/fondos-de-pantalla-canalapps.jpg' }
      }
    }
  })
);

interface servidores {
  _id: string;

  canales: {
    sugerencias: string;
  };

  welcomer?: {
    channel: string;
    message: string;
    embed: {
      enabled: boolean;
      color: `#${string}`;
      thumbnail: boolean;
    };
    image: {
      enabled: boolean;
      bg: string;
    };
  };
}
