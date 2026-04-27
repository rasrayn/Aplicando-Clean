import {healthCheck} from './src/shared/health';

const health = healthCheck();
console.log(`Application health: ${health ? 'Healthy' : 'Unhealthy'}`);

