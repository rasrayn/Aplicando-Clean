import { Order } from '../../domain/OrderDomain';
import { OrderId } from '../../domain/ValueObjets/OrderId';

export interface OrderRepository {
    findById(orderId: OrderId): Promise<Order | null>;
    save(order: Order): Promise<void>;
}
