export class OrderId {
    constructor(public readonly value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('OrderId debe ser una cadena no vacía');
        }
    }
}
