import { DomainEvent } from './DomainEvent';
import { OrderId } from '../ValueObjets/OrderId';
import { OrderItem } from '../ValueObjets/OrderItem';

export class OrderItemAddedEvent implements DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly orderId: OrderId,
        public readonly item: OrderItem,
        occurredAt?: Date
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
