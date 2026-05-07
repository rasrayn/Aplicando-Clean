import { CreateOrderDTO } from '../dto/CreateOrderDTO';
import { OrderRepository } from '../ports/OrderRepository';
import { Clock } from '../ports/Clock';
import { Result, ok, fail } from '../../shared/Result';
import { Order, InvariantError } from '../../domain/OrderDomain';
import { OrderId } from '../../domain/ValueObjets/OrderId';
import {
    ApplicationError,
    ConflictError,
    InfraError,
    ValidationError,
} from '../errors';

export interface CreateOrderResult {
    orderId: string;
    createdAt: Date;
}

export class CreateOrder {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly clock: Clock
    ) {}

    async execute(
        dto: CreateOrderDTO
    ): Promise<Result<CreateOrderResult, ApplicationError>> {
        try {
            const orderId = new OrderId(dto.orderId);
            const existingOrder = await this.orderRepository.findById(orderId);
            if (existingOrder) {
                return fail(
                    new ConflictError(`El pedido ${dto.orderId} ya existe`)
                );
            }

            const createdAt = this.clock.now();
            const order = Order.create(orderId, createdAt);
            await this.orderRepository.save(order);

            return ok({
                orderId: order.id.value,
                createdAt: order.createdAt,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return fail(error);
            }

            if (error instanceof InvariantError) {
                return fail(new ValidationError(error.message));
            }

            if (
                error instanceof ConflictError ||
                error instanceof InfraError
            ) {
                return fail(error);
            }

            return fail(new InfraError(error instanceof Error ? error.message : 'Error inesperado'));
        }
    }
}
