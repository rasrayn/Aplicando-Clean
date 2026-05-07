import { Order } from '../../../domain/OrderDomain';
import { OrderId } from '../../../domain/ValueObjets/OrderId';
import { OrderRepository } from '../../../application/ports/OrderRepository';

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Map<string, Order>;

    constructor() {
        this.orders = new Map();
    }

    async findById(orderId: OrderId): Promise<Order | null> {
        const order = this.orders.get(orderId.value);
        return order ?? null;
    }

    async save(order: Order): Promise<void> {
        this.orders.set(order.id.value, order);
    }

    /**
     * Método auxiliar para limpiar el repositorio (útil para tests)
     */
    clear(): void {
        this.orders.clear();
    }

    /**
     * Método auxiliar para obtener todas las órdenes (útil para debugging/testing)
     */
    getAll(): Order[] {
        const orders: Order[] = [];
        this.orders.forEach((order) => {
            orders.push(order);
        });
        return orders;
    }
}
