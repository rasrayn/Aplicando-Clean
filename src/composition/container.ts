import { OrderRepository } from '../application/ports/OrderRepository';
import { PricingService } from '../application/ports/PricingService';
import { EventBus } from '../application/ports/EventBus';
import { Clock } from '../application/ports/Clock';
import { CreateOrder } from '../application/usesCases/CreateOrder';
import { AddItemToOrder } from '../application/usesCases/AddItemToOrder';
import { OrdersController } from '../infrastructure/http/controllers/OrdersController';
import { InMemoryOrderRepository } from '../infrastructure/persistance/in-memory/InMemoryOrderRepository';
import { StaticPricingService } from '../infrastructure/http/StaticPricingService';
import { InMemoryEventBus } from '../infrastructure/messaging/NoopEvenBus';

class SystemClock implements Clock {
    now(): Date {
        return new Date();
    }
}

export interface AppContainer {
    orderRepository: OrderRepository;
    pricingService: PricingService;
    eventBus: EventBus;
    clock: Clock;
    createOrderUseCase: CreateOrder;
    addItemToOrderUseCase: AddItemToOrder;
    ordersController: OrdersController;
}

export const buildContainer = (): AppContainer => {
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

    return {
        orderRepository,
        pricingService,
        eventBus,
        clock,
        createOrderUseCase,
        addItemToOrderUseCase,
        ordersController,
    };
};
