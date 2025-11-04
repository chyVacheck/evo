/**
 * @file index.ts
 * @module src/index.ts
 */

/**
 * ! my imports
 */
import { SERVER_CONFIG } from '@config';
import { Evo } from '@core/app';
import { ApiRouter } from '@modules/api';

/**
 * Создаем экземпляр приложения Evo.
 */
const evo = new Evo('/');

// Старт
evo.listen({ port: SERVER_CONFIG.PORT });
