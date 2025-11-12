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
import { FileRepository, FileService } from '@modules/file';
import { UserRepository, UserService } from '@modules/user';

/**
 * Создаем экземпляр приложения Evo.
 */
const evo = new Evo('/');

const mongoDb = new MongoDatabase();

await mongoDb.connect();

await UserRepository.init(mongoDb);
UserService.init(UserRepository.getInstance());

await FileRepository.init(mongoDb);
FileService.init(FileRepository.getInstance());

// Монтируем роутеры
evo.use(new ApiRouter());

// Старт
evo.listen({ port: SERVER_CONFIG.PORT });
