// Ahora siganme
import { model, Schema } from 'mongoose';

export default model(
  'servidores',
  new Schema<servidores>({
    _id: String, // la id del servidor

    canales: {
      sugerencias: { type: String, default: null } // la id del canal de sugerencias
    }
  })
);

// creamos un interface para vincularlo con el schema
interface servidores {
  _id: string;

  canales: {
    sugerencias: string;
  };
} // seguimos la base del schema
