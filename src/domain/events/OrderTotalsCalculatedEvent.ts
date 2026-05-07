import type { DomainEvent } from './DomainEvent';
import { OrderId } from '../ValueObjets/OrderId';
import { Money } from '../ValueObjets/Money';

export class OrderTotalsCalculatedEvent implements DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly orderId: OrderId,
        public readonly totalsByCurrency: Record<string, Money>,
        occurredAt?: Date
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
