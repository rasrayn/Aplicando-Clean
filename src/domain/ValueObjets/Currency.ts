export type CurrencyCode = 'USD' | 'EUR' | 'JPY';

const allowedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'JPY'];

const isAllowedCurrencyCode = (value: string): value is CurrencyCode =>
    allowedCurrencies.indexOf(value as CurrencyCode) !== -1;

export class Currency {
    public readonly code: CurrencyCode;

    constructor(code: string) {
        const normalized = code?.trim().toUpperCase();

        if (!normalized || !isAllowedCurrencyCode(normalized)) {
            throw new Error('Currency debe ser USD, EUR o JPY');
        }

        this.code = normalized;
    }

    static USD(): Currency {
        return new Currency('USD');
    }

    static EUR(): Currency {
        return new Currency('EUR');
    }

    static JPY(): Currency {
        return new Currency('JPY');
    }
}
