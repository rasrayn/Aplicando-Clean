import { DomainEvent } from './DomainEvent';
import { OrderId } from '../ValueObjets/OrderId';

export class OrderCreatedEvent implements DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly orderId: OrderId,
        createdAt?: Date
    ) {
        this.occurredAt = createdAt ?? new Date();
    }
}
