/**
 * @file index.ts
 * @module src/index.ts
 */

/**
 * ! my imports
 */
import { SERVER_CONFIG } from '@config';
import { Evo } from '@core/app';
import { MongoDatabase } from '@core/database';
import { ApiRouter } from '@modules/api';
import { UserRepository } from '@modules/user/User.repository';
import { UserService } from '@modules/user/User.service';

/**
 * Создаем экземпляр приложения Evo.
 */
const evo = new Evo('/');

const mongoDb = new MongoDatabase();

await mongoDb.connect();

// Старт
evo.listen({ port: SERVER_CONFIG.PORT });
