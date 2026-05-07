import {healthCheck} from './src/shared/health';
import { startServer } from './src/infrastructure/http/server';

// test de funcionamiento
const health = healthCheck();
console.log(`Application health: ${health ? 'Healthy' : 'Unhealthy'}`);

// Iniciar el servidor
const port = Number(process.env.PORT) || 3000;
startServer().then(app => { app.listen({port})});

