export class ProductId {
    constructor(public readonly value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('ProductId debe ser una cadena no vacía');
        }
    }
}
