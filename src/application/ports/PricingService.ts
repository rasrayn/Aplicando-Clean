import { Currency } from '../../domain/ValueObjets/Currency';
import { Money } from '../../domain/ValueObjets/Money';
import { ProductId } from '../../domain/ValueObjets/ProductId';

export interface PricingService {
    getUnitPrice(productId: ProductId, currency: Currency): Promise<Money>;
}
