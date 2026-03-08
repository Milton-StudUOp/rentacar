export function formatPrice(price: number | string | { d: number[] } | null | undefined): string {
    if (price === null || price === undefined) return '0';
    if (typeof price === 'number' || typeof price === 'string') {
        const num = Number(price);
        return isNaN(num) ? '0' : num.toLocaleString();
    }
    if (typeof price === 'object' && Array.isArray(price.d)) {
        // Handle Prisma Decimal object fallback: { d: [15000, 0], e: 4, s: 1 }
        const num = Number(price.d.join(''));
        return isNaN(num) ? '0' : num.toLocaleString();
    }
    return '0';
}
