import Fastify from 'fastify';
import { buildContainer } from './composition/container';

const port = Number(process.env.PORT) || 3000;

async function main(): Promise<void> {
    const container = buildContainer();
    const fastify = Fastify({ logger: true });

    container.ordersController.register(fastify);

    try {
        await fastify.listen({ port });
        console.log(`Server listening on port ${port}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

main();
