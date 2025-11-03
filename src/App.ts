/**
 * @file App.ts
 * @module src/App.ts
 */

/**
 * ! my imports
 */
import { SERVER_CONFIG } from '@config';
import { Evo } from '@core/app';

/**
 * Создаем экземпляр приложения Evo.
 */
const evo = new Evo();

// (Необязательно) вывести таблицу роутов
evo.printRoutes();

// Старт
evo.listen({ port: SERVER_CONFIG.PORT });
