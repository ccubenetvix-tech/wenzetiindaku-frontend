/**
 * Price and VAT utility functions
 */

const VAT_PERCENTAGE = Number(import.meta.env.VITE_VAT_PERCENTAGE) || 16;

/**
 * Calculates the VAT amount for a given price
 * @param price The base price
 * @returns The calculated VAT amount
 */
export const calculateVAT = (price: number): number => {
    const vatPercentage = Number(import.meta.env.VITE_VAT_PERCENTAGE) || 16;
    return price * (vatPercentage / 100);
};

export const calculateIncludedVAT = (total: number): number => {
    const vatPercentage = Number(import.meta.env.VITE_VAT_PERCENTAGE) || 16;
    return total * (vatPercentage / (100 + vatPercentage));
};

/**
 * Calculates the total price including VAT
 * @param price The base price
 * @returns The total price including VAT
 */
export const calculateTotalWithVAT = (price: number): number => {
    return price + calculateVAT(price);
};

/**
 * Formats a number as a currency string (USD)
 * @param amount The number to format
 * @returns A formatted currency string
 */
export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const getVATPercentage = (): number => VAT_PERCENTAGE;
