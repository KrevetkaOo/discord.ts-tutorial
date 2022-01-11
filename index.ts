import { ExtendedClient } from './struct/cliente';
import * as dotenv from 'dotenv';

dotenv.config();
new ExtendedClient().init();
