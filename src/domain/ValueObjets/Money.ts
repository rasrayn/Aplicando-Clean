import { Currency } from './Currency';
import { Quantity } from './Quantity';

export class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: Currency
    ) {
        if (Number.isNaN(amount) || amount < 0) {
            throw new Error('Money.amount debe ser un número mayor o igual a 0');
        }
    }

    static zero(currency: Currency): Money {
        return new Money(0, currency);
    }

    add(other: Money): Money {
        if (this.currency.code !== other.currency.code) {
            throw new Error('No se puede sumar Money con diferentes monedas');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    multiply(quantity: Quantity): Money {
        return new Money(this.amount * quantity.value, this.currency);
    }
}
