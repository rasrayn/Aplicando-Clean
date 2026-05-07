import Fastify from 'fastify';
import { OrdersController } from './controllers/OrdersController';
import { InMemoryOrderRepository } from '../persistance/in-memory/InMemoryOrderRepository';
import { StaticPricingService } from './StaticPricingService';
import { InMemoryEventBus } from '../messaging/NoopEvenBus';
import { CreateOrder } from '../../application/usesCases/CreateOrder';
import { AddItemToOrder } from '../../application/usesCases/AddItemToOrder';
import { Clock } from '../../application/ports/Clock';

class SystemClock implements Clock {
    now(): Date {
        return new Date();
    }
}

export const startServer = async () => {
    const fastify = Fastify({ logger: true });

    const orderRepository = new InMemoryOrderRepository();
    const pricingService = new StaticPricingService();
    const eventBus = new InMemoryEventBus();
    const clock = new SystemClock();

    const createOrderUseCase = new CreateOrder(orderRepository, clock);
    const addItemToOrderUseCase = new AddItemToOrder(
        orderRepository,
        pricingService,
        eventBus
    );

    const ordersController = new OrdersController(
        createOrderUseCase,
        addItemToOrderUseCase
    );

    ordersController.register(fastify);

    return fastify;
};
