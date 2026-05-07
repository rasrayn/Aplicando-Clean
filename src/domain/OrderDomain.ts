import {
    Currency,
    Money,
    OrderId,
    OrderItem,
    ProductId,
    ProductName,
    Quantity,
} from './ValueObjets';
import type { DomainEvent } from './events/DomainEvent';
import { OrderCreatedEvent } from './events/OrderCreatedEvent';
import { OrderItemAddedEvent } from './events/OrderItemAddedEvent';
import { OrderTotalsCalculatedEvent } from './events/OrderTotalsCalculatedEvent';

export class InvariantError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvariantError';
    }
}

export type OrderStatus = 'draft' | 'completed';

export class Order {
    private readonly items: OrderItem[] = [];
    private readonly events: DomainEvent[] = [];
    private status: OrderStatus = 'draft';

    private constructor(
        public readonly id: OrderId,
        public readonly createdAt: Date
    ) {}

    static create(id: OrderId, createdAt: Date = new Date()): Order {
        const order = new Order(id, createdAt);
        order.recordEvent(new OrderCreatedEvent(order.id, order.createdAt));
        return order;
    }

    addItem(item: OrderItem): void {
        this.assertCanAddItem();

        const existing = this.items.find((current) =>
            current.isSameProductAs(item)
        );

        if (existing) {
            const mergedQuantity = new Quantity(
                existing.quantity.value + item.quantity.value
            );
            const mergedItem = new OrderItem(
                existing.productId,
                existing.productName,
                existing.unitPrice,
                mergedQuantity
            );

            this.items.splice(this.items.indexOf(existing), 1, mergedItem);
            this.recordEvent(new OrderItemAddedEvent(this.id, mergedItem));
            return;
        }

        this.items.push(item);
        this.recordEvent(new OrderItemAddedEvent(this.id, item));
    }

    complete(): void {
        if (this.status === 'completed') {
            throw new InvariantError('El pedido ya está completado');
        }
        this.status = 'completed';
    }

    totalByCurrency(): Record<string, Money> {
        const totals: Record<string, Money> = {};

        for (const item of this.items) {
            const currencyCode = item.currency.code;
            const subtotal = item.subtotal();
            totals[currencyCode] = totals[currencyCode]
                ? totals[currencyCode].add(subtotal)
                : Money.zero(item.currency).add(subtotal);
        }

        return totals;
    }

    calculateTotals(): Record<string, Money> {
        const totals = this.totalByCurrency();
        this.recordEvent(new OrderTotalsCalculatedEvent(this.id, totals));
        return totals;
    }

    getItems(): readonly OrderItem[] {
        return this.items;
    }

    getUncommittedEvents(): DomainEvent[] {
        return [...this.events];
    }

    clearEvents(): void {
        this.events.length = 0;
    }

    private assertCanAddItem(): void {
        if (this.status === 'completed') {
            throw new InvariantError('No se pueden añadir items a un pedido completado');
        }
    }

    private recordEvent(event: DomainEvent): void {
        this.events.push(event);
    }
}
