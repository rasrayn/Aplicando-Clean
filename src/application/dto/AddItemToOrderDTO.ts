export interface AddItemToOrderDTO {
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    currencyCode: string;
}
