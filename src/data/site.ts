import { SITE } from './site.config';
import { contactInfo } from './contact-info';

export const site = {
  name: SITE.name,
  title: SITE.title,
  description: SITE.description,
  url: SITE.url,
  defaultImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
};

export function whatsappHref(message?: string) {
  const msg = message || contactInfo.whatsappMessage || "Merhaba, hızlı sipariş vermek istiyorum.";
  return `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(msg)}`;
}
