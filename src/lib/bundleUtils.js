/**
 * Calculates savings and discount percentage between individual sum and bundle offer price.
 *
 * @param {number} individualTotal
 * @param {number} bundlePrice
 * @returns {{
 *   individualTotal: number,
 *   bundlePrice: number,
 *   hasDiscount: boolean,
 *   savingsAmount: number,
 *   discountPercentage: number,
 *   badgeText: string
 * }}
 */
export function calculateBundleSavings(individualTotal, bundlePrice) {
  const total = Math.max(0, Number(individualTotal) || 0);
  const price = Math.max(0, Number(bundlePrice) || 0);

  const savingsAmount = Math.max(0, total - price);
  const hasDiscount = total > 0 && price > 0 && savingsAmount > 0;

  let discountPercentage = 0;
  if (hasDiscount && total > 0) {
    discountPercentage = Math.round((savingsAmount / total) * 100);
  }

  return {
    individualTotal: total,
    bundlePrice: price,
    hasDiscount,
    savingsAmount,
    discountPercentage,
    badgeText: hasDiscount ? `${discountPercentage}% OFF` : 'Bundle Offer'
  };
}

/**
 * Builds a WhatsApp quote and inquiry link for a specific bundle offer.
 *
 * @param {{
 *   businessPhone: string,
 *   bundleTitle: string,
 *   bundlePricePkr: number,
 *   books: Array<{ title: string, price_pkr?: number }>
 * }} params
 * @returns {string} wa.me URL
 */
export function buildBundleWhatsAppUrl({ businessPhone, bundleTitle, bundlePricePkr, books = [] }) {
  const cleanPhone = (businessPhone || '923421189593').replace(/^0/, '92').replace(/[^0-9]/g, '');
  const bookList = books.map((b, i) => `${i + 1}. ${b.title || 'Textbook'}`).join('\n');
  const formattedPrice = Number(bundlePricePkr || 0).toLocaleString();

  const message = [
    `*German Learning School — Book Bundle Inquiry*`,
    ``,
    `Hello Admissions & Book Department,`,
    `I would like to order the following textbook bundle offer:`,
    ``,
    `📚 *Bundle:* ${bundleTitle}`,
    `📦 *Included Books:*`,
    bookList || 'Selected official textbooks',
    ``,
    `💰 *Offer Price:* ₨ ${formattedPrice} PKR`,
    ``,
    `Please confirm current stock availability, delivery charges for my city, and payment details (Bank Transfer / JazzCash / EasyPaisa). Thank you!`
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
