import type { AddItemToOrderDTO } from '../dto/AddItemToOrderDTO';
import type { OrderRepository } from '../ports/OrderRepository';
import type { PricingService } from '../ports/PricingService';
import type { EventBus } from '../ports/EventBus';
import { Result, ok, fail } from '../../shared/Result';
import { InvariantError } from '../../domain/OrderDomain';
import {
    Currency,
    OrderId,
    ProductId,
    ProductName,
    Quantity,
    OrderItem,
    Money,
} from '../../domain/ValueObjets';
import  {
    ApplicationError,
    ConflictError,
    InfraError,
    NotFoundError,
    ValidationError,
} from '../errors';

export interface AddItemToOrderResult {
    orderId: string;
    totalsByCurrency: Record<string, { amount: number; currency: string }>;
}

export class AddItemToOrder {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly pricingService: PricingService,
        private readonly eventBus: EventBus
    ) {}

    async execute(
        dto: AddItemToOrderDTO
    ): Promise<Result<AddItemToOrderResult, ApplicationError>> {
        try {
            const orderId = new OrderId(dto.orderId);
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                return fail(
                    new NotFoundError(`Pedido ${dto.orderId} no encontrado`)
                );
            }

            const productId = new ProductId(dto.productId);
            const productName = new ProductName(dto.productName);
            const quantity = new Quantity(dto.quantity);
            const currency = new Currency(dto.currencyCode);
            const unitPrice = await this.pricingService.getUnitPrice(
                productId,
                currency
            );

            const item = new OrderItem(
                productId,
                productName,
                unitPrice,
                quantity
            );

            order.addItem(item);
            await this.orderRepository.save(order);
            await this.eventBus.publish(order.getUncommittedEvents());
            order.clearEvents();

            const totalsByCurrency = this.mapTotals(order.totalByCurrency());
            return ok({ orderId: order.id.value, totalsByCurrency });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return fail(error);
            }

            if (error instanceof InvariantError) {
                const message = error.message;
                if (message.includes('completado') || message.includes('No se pueden añadir')) {
                    return fail(new ConflictError(message));
                }
                return fail(new ValidationError(message));
            }

            if (
                error instanceof ValidationError ||
                error instanceof ConflictError ||
                error instanceof InfraError
            ) {
                return fail(error);
            }

            return fail(new InfraError(error instanceof Error ? error.message : 'Error inesperado'));
        }
    }

    private mapTotals(
        totals: Record<string, Money>
    ): Record<string, { amount: number; currency: string }> {
        const result: Record<string, { amount: number; currency: string }> = {};
        const currencies = Object.keys(totals);
        for (const currencyCode of currencies) {
            const value = totals[currencyCode];
            if (!value) {
                continue;
            }
            result[currencyCode] = {
                amount: value.amount,
                currency: value.currency.code,
            };
        }
        return result;
    }
}
