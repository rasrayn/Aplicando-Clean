import { PricingService } from '../../application/ports/PricingService';
import { Currency } from '../../domain/ValueObjets/Currency';
import { Money } from '../../domain/ValueObjets/Money';
import { ProductId } from '../../domain/ValueObjets/ProductId';

/**
 * Simulación de un servicio externo de precios.
 * En una aplicación real, esto consultaría una API externa.
 * Para esta simulación usamos precios estáticos predefinidos.
 */
export class StaticPricingService implements PricingService {
    private readonly pricesCatalog: Map<string, Map<string, number>>;

    constructor() {
        this.pricesCatalog = this.initializePrices();
    }

    async getUnitPrice(
        productId: ProductId,
        currency: Currency
    ): Promise<Money> {
        const productPrices = this.pricesCatalog.get(productId.value);

        if (!productPrices) {
            throw new Error(`Producto ${productId.value} no encontrado en el catálogo de precios`);
        }

        const price = productPrices.get(currency.code);

        if (price === undefined) {
            throw new Error(
                `No hay precio disponible para el producto ${productId.value} en ${currency.code}`
            );
        }

        return new Money(price, currency);
    }

    /**
     * Inicializa el catálogo de precios con precios simulados
     * Estructura: productId -> currency -> amount
     */
    private initializePrices(): Map<string, Map<string, number>> {
        const catalog = new Map<string, Map<string, number>>();

        // Laptop - diferentes precios en cada moneda
        const laptopPrices = new Map<string, number>([
            ['USD', 999.99],
            ['EUR', 899.99],
            ['JPY', 110000],
        ]);
        catalog.set('laptop-001', laptopPrices);

        // Mouse - diferentes precios en cada moneda
        const mousePrices = new Map<string, number>([
            ['USD', 29.99],
            ['EUR', 27.99],
            ['JPY', 3300],
        ]);
        catalog.set('mouse-001', mousePrices);

        // Teclado - diferentes precios en cada moneda
        const keyboardPrices = new Map<string, number>([
            ['USD', 79.99],
            ['EUR', 74.99],
            ['JPY', 8800],
        ]);
        catalog.set('keyboard-001', keyboardPrices);

        // Monitor - diferentes precios en cada moneda
        const monitorPrices = new Map<string, number>([
            ['USD', 299.99],
            ['EUR', 279.99],
            ['JPY', 33000],
        ]);
        catalog.set('monitor-001', monitorPrices);

        // Cable USB - diferentes precios en cada moneda
        const cablePrices = new Map<string, number>([
            ['USD', 9.99],
            ['EUR', 9.99],
            ['JPY', 1100],
        ]);
        catalog.set('cable-usb-001', cablePrices);

        return catalog;
    }
}
