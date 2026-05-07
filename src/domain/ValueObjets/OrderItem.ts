import { ProductId } from './ProductId';
import { ProductName } from './ProductName';
import { Money } from './Money';
import { Quantity } from './Quantity';

export class OrderItem {
    constructor(
        public readonly productId: ProductId,
        public readonly productName: ProductName,
        public readonly unitPrice: Money,
        public readonly quantity: Quantity
    ) {
        if (unitPrice.amount <= 0) {
            throw new Error('OrderItem.unitPrice debe ser mayor que 0');
        }
    }

    get currency() {
        return this.unitPrice.currency;
    }

    subtotal(): Money {
        return this.unitPrice.multiply(this.quantity);
    }

    isSameProductAs(other: OrderItem): boolean {
        return (
            this.productId.value === other.productId.value &&
            this.unitPrice.currency.code === other.unitPrice.currency.code &&
            this.unitPrice.amount === other.unitPrice.amount
        );
    }
}
