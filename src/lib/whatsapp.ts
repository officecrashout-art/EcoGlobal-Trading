import { siteConfig } from "@/content/site";

/**
 * Builds a properly URL-encoded WhatsApp click-to-chat URL for Eco Global BD.
 * Format: https://wa.me/8801714011220?text=<URL-encoded message>
 */
export function buildWhatsAppUrl(message?: string): string {
  const digits = siteConfig.whatsapp.internationalNumber.replace(/\D/g, "");
  const textToEncode =
    message && message.trim().length > 0
      ? message.trim()
      : siteConfig.whatsapp.defaultMessage;

  return `https://wa.me/${digits}?text=${encodeURIComponent(textToEncode)}`;
}

/**
 * Builds the exact category inquiry message required for category cards and detail pages:
 * "Hello Eco Global BD, I'm interested in <Category>. Please share details."
 */
export function buildCategoryInquiryMessage(categoryTitle: string): string {
  return `Hello Eco Global BD, I'm interested in ${categoryTitle}. Please share details.`;
}

/**
 * Convenience helper returning the full WhatsApp URL for a specific category.
 */
export function buildCategoryWhatsAppUrl(categoryTitle: string): string {
  return buildWhatsAppUrl(buildCategoryInquiryMessage(categoryTitle));
}
